// Cloudflare Worker - Claude API Proxy with PIN Authentication
//
// Deploy: wrangler deploy
//
// Required secrets (wrangler secret put <NAME>):
//   ANTHROPIC_API_KEY  - Anthropic API key
//   PIN_HASH           - SHA-256 hex of the PIN (generate: echo -n "your-pin" | shasum -a 256)
//   HMAC_SECRET        - Random string for signing session tokens (any long random string)
//
// Security layers:
//   1. CORS locked to GitHub Pages domain
//   2. PIN login → 24h session token (HMAC-signed)
//   3. Per-IP rate limiting (5 req/min for API, 3 attempts/min for auth)
//   4. Daily request cap (300/day)

const ALLOWED_ORIGIN = 'https://tincomking.github.io';
const TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_API = 5;     // max API calls per IP per minute
const RATE_LIMIT_AUTH = 3;     // max auth attempts per IP per minute
const DAILY_CAP = 300;

// In-memory rate limiting (resets on Worker restart, good enough for light use)
const rateLimits = new Map();
const dailyCounter = { count: 0, resetAt: 0 };

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    // Only POST
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, request);
    }

    // CORS origin check (skip for non-browser clients - they can't read the response anyway)
    const origin = request.headers.get('Origin');
    if (origin && origin !== ALLOWED_ORIGIN) {
      return jsonResponse({ error: 'Forbidden origin' }, 403, request);
    }

    const url = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Route: POST /auth - PIN login
    if (url.pathname === '/auth') {
      // Rate limit auth attempts
      if (isRateLimited(ip, 'auth', RATE_LIMIT_AUTH)) {
        return jsonResponse({ error: 'Too many attempts. Try again in a minute.' }, 429, request);
      }

      try {
        const body = await request.json();
        const pin = String(body.pin || '');

        if (!pin) {
          return jsonResponse({ error: 'PIN required' }, 400, request);
        }

        // Hash the submitted PIN and compare
        const pinHash = await sha256(pin);

        if (!env.PIN_HASH || pinHash !== env.PIN_HASH.toLowerCase()) {
          return jsonResponse({ error: 'Wrong PIN' }, 401, request);
        }

        // Generate session token: timestamp.hmac
        const now = Date.now();
        const signature = await hmacSign(String(now), env.HMAC_SECRET);
        const token = now + '.' + signature;

        return jsonResponse({
          token: token,
          expiresIn: TOKEN_TTL,
          message: 'Welcome, Ruby!'
        }, 200, request);
      } catch (err) {
        return jsonResponse({ error: 'Invalid request' }, 400, request);
      }
    }

    // Route: POST /api - Claude API proxy (requires valid session token)
    if (url.pathname === '/api') {
      // Rate limit API calls
      if (isRateLimited(ip, 'api', RATE_LIMIT_API)) {
        return jsonResponse({ error: 'Too many requests. Slow down!' }, 429, request);
      }

      // Daily cap
      const now = Date.now();
      if (now > dailyCounter.resetAt) {
        dailyCounter.count = 0;
        dailyCounter.resetAt = now + 86400000;
      }
      if (dailyCounter.count >= DAILY_CAP) {
        return jsonResponse({ error: 'Daily limit reached. Try again tomorrow!' }, 429, request);
      }

      try {
        const body = await request.json();

        // Validate session token
        const token = body.token || '';
        const valid = await validateToken(token, env.HMAC_SECRET);
        if (!valid) {
          return jsonResponse({ error: 'Session expired. Please log in again.' }, 401, request);
        }

        // Validate request
        if (!body.messages || !Array.isArray(body.messages)) {
          return jsonResponse({ error: 'Invalid request' }, 400, request);
        }

        // Forward to Claude API
        dailyCounter.count++;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: body.model || 'claude-haiku-4-5-20251001',
            max_tokens: body.max_tokens || 2048,
            system: body.system || '',
            messages: body.messages
          })
        });

        const result = await response.json();

        if (!response.ok) {
          return jsonResponse({ error: 'API error', details: result }, response.status, request);
        }

        return jsonResponse(result, 200, request);
      } catch (err) {
        return jsonResponse({ error: 'Internal error', message: err.message }, 500, request);
      }
    }

    return jsonResponse({ error: 'Not found' }, 404, request);
  }
};

// ---- Crypto helpers ----

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSign(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validateToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const timestamp = parseInt(parts[0]);
  const signature = parts[1];

  // Check expiry
  if (Date.now() - timestamp > TOKEN_TTL) return false;

  // Verify signature
  const expected = await hmacSign(String(timestamp), secret);
  return signature === expected;
}

// ---- Rate limiting ----

function isRateLimited(ip, type, limit) {
  const key = type + ':' + ip;
  const now = Date.now();
  const window = 60000; // 1 minute

  if (!rateLimits.has(key)) {
    rateLimits.set(key, { count: 1, resetAt: now + window });
    return false;
  }

  const entry = rateLimits.get(key);
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + window;
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// ---- Response helpers ----

function corsHeaders(request) {
  const origin = request ? request.headers.get('Origin') : ALLOWED_ORIGIN;
  const allowedOrigin = (origin === ALLOWED_ORIGIN) ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request)
    }
  });
}
