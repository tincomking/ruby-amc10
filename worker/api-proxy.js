// Cloudflare Worker - Claude API Proxy
// Deploy with: wrangler deploy worker/api-proxy.js
//
// Required secrets (set via wrangler secret put):
//   ANTHROPIC_API_KEY - Your Claude API key
//   APP_TOKEN - Simple auth token to prevent abuse
//
// Set allowed origin in wrangler.toml or update ALLOWED_ORIGIN below

const ALLOWED_ORIGIN = '*'; // Update to your GitHub Pages URL in production

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // Simple auth
    const authToken = request.headers.get('X-Auth-Token');
    if (!env.APP_TOKEN || authToken !== env.APP_TOKEN) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
      const body = await request.json();

      // Validate request
      if (!body.messages || !Array.isArray(body.messages)) {
        return jsonResponse({ error: 'Invalid request: messages required' }, 400);
      }

      // Forward to Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          system: body.system || '',
          messages: body.messages
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return jsonResponse({ error: 'API error', details: result }, response.status);
      }

      return jsonResponse(result, 200);
    } catch (err) {
      return jsonResponse({ error: 'Internal error', message: err.message }, 500);
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}
