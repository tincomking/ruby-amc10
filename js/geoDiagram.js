// GeoDiagram - SVG geometry diagram generator with CSS animations
// Generates animated diagrams for geometry problems (triangles, circles, coordinate)

var GeoDiagram = (function() {
  var SVG_W = 280;
  var SVG_H = 220;
  var PAD = 30;

  function generate(problem) {
    if (!problem || problem.topic !== 'geometry') return null;

    var subtopic = problem.subtopic || '';
    var text = problem.problem || '';

    try {
      if (subtopic === 'triangles' || subtopic === 'similarity') {
        return generateTriangle(text);
      }
      if (subtopic === 'circles') {
        return generateCircle(text);
      }
      if (subtopic === 'coordinate') {
        return generateCoordinate(text);
      }
    } catch (e) {
      console.warn('GeoDiagram: could not generate for', subtopic, e);
    }

    return null;
  }

  // ---- Parsing helpers ----
  function extractSides(text) {
    var sides = {};
    // Match patterns like "AB = 5", "BC = 12"
    var re = /([A-Z]{2})\s*=\s*(\d+(?:\.\d+)?)/g;
    var m;
    while ((m = re.exec(text)) !== null) {
      sides[m[1]] = parseFloat(m[2]);
    }
    return sides;
  }

  function extractVertices(text) {
    // Match "triangle ABC" or "triangle $ABC$"
    var m = text.match(/triangle\s+\$?([A-Z]{3})\$?/i);
    if (m) return m[1].split('');
    return ['A', 'B', 'C'];
  }

  function extractRadius(text) {
    var m = text.match(/radi(?:us|i)\s+\$?(\d+(?:\.\d+)?)\$?/i);
    if (m) return parseFloat(m[1]);
    m = text.match(/radi(?:us|i)\s*=?\s*\$?(\d+(?:\.\d+)?)\$?/i);
    if (m) return parseFloat(m[1]);
    return null;
  }

  function extractCoordPoints(text) {
    var points = [];
    var re = /\((-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\)/g;
    var m;
    while ((m = re.exec(text)) !== null) {
      points.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) });
    }
    return points;
  }

  // ---- SVG builders ----
  function svgOpen() {
    return '<svg viewBox="0 0 ' + SVG_W + ' ' + SVG_H + '" xmlns="http://www.w3.org/2000/svg" class="geo-diagram">';
  }

  function animatedLine(x1, y1, x2, y2, delay, color) {
    color = color || '#1B2A4A';
    var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' +
      'stroke="' + color + '" stroke-width="2" stroke-linecap="round" ' +
      'stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '" ' +
      'style="animation: geo-draw 0.6s ease forwards; animation-delay: ' + delay + 'ms;" />';
  }

  function animatedCirclePath(cx, cy, r, delay, color) {
    color = color || '#4ECDC4';
    var circ = 2 * Math.PI * r;
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' +
      'fill="none" stroke="' + color + '" stroke-width="2" ' +
      'stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '" ' +
      'style="animation: geo-draw 0.8s ease forwards; animation-delay: ' + delay + 'ms;" />';
  }

  function animatedDot(x, y, delay, color) {
    color = color || '#FF6B6B';
    return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + color + '" ' +
      'style="opacity:0; transform-origin:' + x + 'px ' + y + 'px; transform:scale(0); ' +
      'animation: geo-pop 0.3s ease forwards; animation-delay: ' + delay + 'ms;" />';
  }

  function animatedLabel(x, y, text, delay, color, fontSize) {
    color = color || '#1B2A4A';
    fontSize = fontSize || 13;
    return '<text x="' + x + '" y="' + y + '" fill="' + color + '" ' +
      'font-family="Fredoka, sans-serif" font-size="' + fontSize + '" font-weight="600" text-anchor="middle" ' +
      'style="opacity:0; animation: geo-fade 0.4s ease forwards; animation-delay: ' + delay + 'ms;">' +
      text + '</text>';
  }

  function animatedPolygon(points, delay, color, fill) {
    color = color || '#1B2A4A';
    fill = fill || 'rgba(78,205,196,0.08)';
    var pointStr = points.map(function(p) { return p.x + ',' + p.y; }).join(' ');
    // Calculate perimeter
    var perim = 0;
    for (var i = 0; i < points.length; i++) {
      var next = points[(i + 1) % points.length];
      perim += Math.sqrt((next.x - points[i].x) * (next.x - points[i].x) + (next.y - points[i].y) * (next.y - points[i].y));
    }
    return '<polygon points="' + pointStr + '" fill="' + fill + '" ' +
      'stroke="' + color + '" stroke-width="2" stroke-linejoin="round" ' +
      'stroke-dasharray="' + perim + '" stroke-dashoffset="' + perim + '" ' +
      'style="animation: geo-draw 0.8s ease forwards; animation-delay: ' + delay + 'ms;" />';
  }

  // ---- Triangle generator ----
  function generateTriangle(text) {
    var verts = extractVertices(text);
    var sides = extractSides(text);

    // Determine triangle vertices in SVG coords
    var triPts = computeTriangleCoords(sides, verts);
    if (!triPts) {
      // Default equilateral if we can't parse
      triPts = [
        { x: SVG_W / 2, y: PAD + 10 },
        { x: PAD + 10, y: SVG_H - PAD - 10 },
        { x: SVG_W - PAD - 10, y: SVG_H - PAD - 10 }
      ];
    }

    var svg = svgOpen();

    // Draw triangle polygon
    svg += animatedPolygon(triPts, 0);

    // Vertex labels
    var labelOffsets = computeLabelOffsets(triPts);
    for (var i = 0; i < 3; i++) {
      svg += animatedDot(triPts[i].x, triPts[i].y, 800 + i * 200, '#FF6B6B');
      svg += animatedLabel(
        triPts[i].x + labelOffsets[i].dx,
        triPts[i].y + labelOffsets[i].dy,
        verts[i], 900 + i * 200
      );
    }

    // Side labels
    var sideNames = [verts[0] + verts[1], verts[1] + verts[2], verts[0] + verts[2]];
    var sidePairs = [[0, 1], [1, 2], [0, 2]];
    for (var i = 0; i < sidePairs.length; i++) {
      var name = sideNames[i];
      var val = sides[name] || sides[name.split('').reverse().join('')];
      if (val !== undefined) {
        var mx = (triPts[sidePairs[i][0]].x + triPts[sidePairs[i][1]].x) / 2;
        var my = (triPts[sidePairs[i][0]].y + triPts[sidePairs[i][1]].y) / 2;
        // Offset label away from center
        var cx = (triPts[0].x + triPts[1].x + triPts[2].x) / 3;
        var cy = (triPts[0].y + triPts[1].y + triPts[2].y) / 3;
        var offx = (mx - cx) * 0.25;
        var offy = (my - cy) * 0.25;
        svg += animatedLabel(mx + offx, my + offy, '' + val, 1400 + i * 200, '#5A6B8A', 12);
      }
    }

    // Right angle marker if applicable
    if (isRightTriangle(sides, verts)) {
      var rightIdx = findRightAngleVertex(sides, verts);
      if (rightIdx >= 0) {
        svg += drawRightAngleMarker(triPts, rightIdx, 1800);
      }
    }

    svg += '</svg>';
    return svg;
  }

  function computeTriangleCoords(sides, verts) {
    // Try to get 3 side lengths
    var ab = sides[verts[0] + verts[1]] || sides[verts[1] + verts[0]];
    var bc = sides[verts[1] + verts[2]] || sides[verts[2] + verts[1]];
    var ac = sides[verts[0] + verts[2]] || sides[verts[2] + verts[0]];

    if (ab && bc && ac) {
      return triangleFromSides(ab, bc, ac);
    }
    if (ab && bc) {
      ac = ac || Math.sqrt(ab * ab + bc * bc); // assume right triangle
      return triangleFromSides(ab, bc, ac);
    }
    return null;
  }

  function triangleFromSides(a, b, c) {
    // Place A at origin, B on x-axis
    // a = AB, b = BC, c = AC
    var Ax = 0, Ay = 0;
    var Bx = a, By = 0;

    // C using law of cosines: angle at A
    var cosA = (a * a + c * c - b * b) / (2 * a * c);
    cosA = Math.max(-1, Math.min(1, cosA));
    var sinA = Math.sqrt(1 - cosA * cosA);
    var Cx = c * cosA;
    var Cy = -c * sinA; // negative y so triangle points up

    // Scale and center to fit SVG
    var pts = [{ x: Ax, y: Ay }, { x: Bx, y: By }, { x: Cx, y: Cy }];
    return fitToSVG(pts);
  }

  function fitToSVG(pts) {
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (var i = 0; i < pts.length; i++) {
      if (pts[i].x < minX) minX = pts[i].x;
      if (pts[i].x > maxX) maxX = pts[i].x;
      if (pts[i].y < minY) minY = pts[i].y;
      if (pts[i].y > maxY) maxY = pts[i].y;
    }

    var w = maxX - minX || 1;
    var h = maxY - minY || 1;
    var drawW = SVG_W - 2 * PAD;
    var drawH = SVG_H - 2 * PAD;
    var scale = Math.min(drawW / w, drawH / h);

    var result = [];
    for (var i = 0; i < pts.length; i++) {
      result.push({
        x: PAD + (pts[i].x - minX) * scale + (drawW - w * scale) / 2,
        y: PAD + (pts[i].y - minY) * scale + (drawH - h * scale) / 2
      });
    }
    return result;
  }

  function computeLabelOffsets(pts) {
    var cx = (pts[0].x + pts[1].x + pts[2].x) / 3;
    var cy = (pts[0].y + pts[1].y + pts[2].y) / 3;
    var offsets = [];
    for (var i = 0; i < 3; i++) {
      var dx = pts[i].x - cx;
      var dy = pts[i].y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      offsets.push({
        dx: (dx / dist) * 16,
        dy: (dy / dist) * 16 + 4
      });
    }
    return offsets;
  }

  function isRightTriangle(sides, verts) {
    var ab = sides[verts[0] + verts[1]] || sides[verts[1] + verts[0]];
    var bc = sides[verts[1] + verts[2]] || sides[verts[2] + verts[1]];
    var ac = sides[verts[0] + verts[2]] || sides[verts[2] + verts[0]];
    if (!ab || !bc || !ac) return false;
    var s = [ab, bc, ac].sort(function(a, b) { return a - b; });
    return Math.abs(s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) < 0.01;
  }

  function findRightAngleVertex(sides, verts) {
    var ab = sides[verts[0] + verts[1]] || sides[verts[1] + verts[0]];
    var bc = sides[verts[1] + verts[2]] || sides[verts[2] + verts[1]];
    var ac = sides[verts[0] + verts[2]] || sides[verts[2] + verts[0]];
    if (!ab || !bc || !ac) return -1;
    // Hypotenuse is the longest side; right angle is opposite
    var s = [ab, bc, ac];
    var maxIdx = s.indexOf(Math.max.apply(null, s));
    // Side 0 = AB (opposite C=2), Side 1 = BC (opposite A=0), Side 2 = AC (opposite B=1)
    return [2, 0, 1][maxIdx];
  }

  function drawRightAngleMarker(pts, idx, delay) {
    var p = pts[idx];
    var prev = pts[(idx + 2) % 3];
    var next = pts[(idx + 1) % 3];

    var size = 10;
    var d1x = prev.x - p.x, d1y = prev.y - p.y;
    var d2x = next.x - p.x, d2y = next.y - p.y;
    var len1 = Math.sqrt(d1x * d1x + d1y * d1y) || 1;
    var len2 = Math.sqrt(d2x * d2x + d2y * d2y) || 1;

    var u1x = d1x / len1 * size, u1y = d1y / len1 * size;
    var u2x = d2x / len2 * size, u2y = d2y / len2 * size;

    var p1 = { x: p.x + u1x, y: p.y + u1y };
    var p2 = { x: p.x + u1x + u2x, y: p.y + u1y + u2y };
    var p3 = { x: p.x + u2x, y: p.y + u2y };

    return '<polyline points="' + p1.x + ',' + p1.y + ' ' + p2.x + ',' + p2.y + ' ' + p3.x + ',' + p3.y + '" ' +
      'fill="none" stroke="#5A6B8A" stroke-width="1.5" ' +
      'style="opacity:0; animation: geo-fade 0.3s ease forwards; animation-delay: ' + delay + 'ms;" />';
  }

  // ---- Circle generator ----
  function generateCircle(text) {
    var svg = svgOpen();
    var radius = extractRadius(text);
    var cx = SVG_W / 2;
    var cy = SVG_H / 2;

    // Extract numbers for circle problems
    var nums = [];
    var numRe = /(?:radii|radius)\s+(\d+)/gi;
    var m;
    while ((m = numRe.exec(text)) !== null) {
      nums.push(parseFloat(m[1]));
    }
    if (nums.length === 0) {
      numRe = /(?:radii|radius)\s+\$?(\d+)\$?\s+and\s+\$?(\d+)\$?/i;
      m = text.match(numRe);
      if (m) { nums = [parseFloat(m[1]), parseFloat(m[2])]; }
    }

    // Two tangent circles
    if (text.match(/tangent/i) && nums.length >= 2) {
      var r1 = nums[0], r2 = nums[1];
      var maxR = Math.max(r1, r2);
      var scale = (SVG_H / 2 - PAD - 10) / maxR;
      var sr1 = r1 * scale, sr2 = r2 * scale;
      var cx1 = SVG_W / 2 - sr1 * 0.5;
      var cx2 = cx1 + sr1 + sr2;
      // Center the pair
      var totalW = sr1 * 2 + sr2 * 2;
      cx1 = (SVG_W - (sr1 + sr2)) / 2;
      cx2 = cx1 + sr1 + sr2;

      svg += animatedCirclePath(cx1, cy, sr1, 0, '#4ECDC4');
      svg += animatedCirclePath(cx2, cy, sr2, 300, '#FF6B6B');
      svg += animatedDot(cx1, cy, 800, '#4ECDC4');
      svg += animatedDot(cx2, cy, 900, '#FF6B6B');
      svg += animatedLabel(cx1, cy - sr1 - 8, 'r=' + r1, 1000, '#4ECDC4', 11);
      svg += animatedLabel(cx2, cy - sr2 - 8, 'r=' + r2, 1100, '#FF6B6B', 11);
      // Distance line between centers
      svg += animatedLine(cx1, cy, cx2, cy, 1200, '#5A6B8A');
      svg += '</svg>';
      return svg;
    }

    // Chord problem
    if (text.match(/chord/i)) {
      var chordLen = null, dist = null;
      var chordM = text.match(/chord\s+(?:of\s+)?length\s+\$?(\d+(?:\.\d+)?)\$?/i);
      if (chordM) chordLen = parseFloat(chordM[1]);
      var distM = text.match(/(\d+(?:\.\d+)?)\s+units?\s+from\s+(?:the\s+)?center/i);
      if (distM) dist = parseFloat(distM[1]);

      var r = radius || 60;
      var svgR = 70;
      svg += animatedCirclePath(cx, cy, svgR, 0, '#4ECDC4');
      svg += animatedDot(cx, cy, 600, '#1B2A4A');
      svg += animatedLabel(cx + 8, cy - 8, 'O', 700);

      if (chordLen && dist) {
        var halfChord = svgR * 0.55;
        var perpDist = svgR * 0.35;
        // Chord
        svg += animatedLine(cx - halfChord, cy + perpDist, cx + halfChord, cy + perpDist, 400, '#FF6B6B');
        // Perpendicular from center
        svg += animatedLine(cx, cy, cx, cy + perpDist, 800, '#5A6B8A');
        // Labels
        svg += animatedLabel(cx + halfChord + 12, cy + perpDist + 4, '' + chordLen, 1000, '#FF6B6B', 11);
        svg += animatedLabel(cx + 10, cy + perpDist / 2, '' + dist, 1100, '#5A6B8A', 11);
        // Right angle marker
        svg += '<rect x="' + (cx - 5) + '" y="' + (cy + perpDist - 5) + '" width="5" height="5" ' +
          'fill="none" stroke="#5A6B8A" stroke-width="1" ' +
          'style="opacity:0; animation: geo-fade 0.3s ease forwards; animation-delay: 1200ms;" />';
      }

      svg += '</svg>';
      return svg;
    }

    // Sector
    if (text.match(/sector/i)) {
      var angleM = text.match(/(?:angle|central\s+angle)\s+\$?(\d+)°?\$?/i);
      var angle = angleM ? parseInt(angleM[1]) : 60;
      var r = radius || 6;
      var svgR = 70;

      svg += animatedDot(cx, cy, 0, '#1B2A4A');
      // Arc
      var startAngle = -angle / 2;
      var endAngle = angle / 2;
      var rad1 = startAngle * Math.PI / 180;
      var rad2 = endAngle * Math.PI / 180;
      var x1 = cx + svgR * Math.cos(rad1);
      var y1 = cy + svgR * Math.sin(rad1);
      var x2 = cx + svgR * Math.cos(rad2);
      var y2 = cy + svgR * Math.sin(rad2);
      var largeArc = angle > 180 ? 1 : 0;

      svg += animatedLine(cx, cy, x1, y1, 200, '#1B2A4A');
      svg += animatedLine(cx, cy, x2, y2, 400, '#1B2A4A');

      var arcLen = svgR * angle * Math.PI / 180;
      svg += '<path d="M ' + x1 + ' ' + y1 + ' A ' + svgR + ' ' + svgR + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 + '" ' +
        'fill="rgba(78,205,196,0.15)" stroke="#4ECDC4" stroke-width="2" ' +
        'stroke-dasharray="' + arcLen + '" stroke-dashoffset="' + arcLen + '" ' +
        'style="animation: geo-draw 0.6s ease forwards; animation-delay: 600ms;" />';

      svg += animatedLabel(cx - 5, cy - 8, 'O', 800);
      svg += animatedLabel(cx + 25, cy + 4, angle + '\u00B0', 1000, '#5A6B8A', 11);
      svg += animatedLabel(cx + svgR / 2 + 10, cy - svgR / 3, 'r=' + r, 1100, '#4ECDC4', 11);

      svg += '</svg>';
      return svg;
    }

    // Generic single circle
    var svgR = 70;
    svg += animatedCirclePath(cx, cy, svgR, 0, '#4ECDC4');
    svg += animatedDot(cx, cy, 600, '#1B2A4A');
    svg += animatedLabel(cx + 8, cy - 8, 'O', 700);
    if (radius) {
      svg += animatedLine(cx, cy, cx + svgR, cy, 400, '#5A6B8A');
      svg += animatedLabel(cx + svgR / 2, cy - 10, 'r=' + radius, 900, '#5A6B8A', 11);
    }
    svg += '</svg>';
    return svg;
  }

  // ---- Coordinate generator ----
  function generateCoordinate(text) {
    var svg = svgOpen();
    var points = extractCoordPoints(text);

    // Draw axes
    var originX = PAD + 10;
    var originY = SVG_H - PAD - 10;
    var axisEndX = SVG_W - PAD;
    var axisEndY = PAD;

    svg += animatedLine(originX, originY, axisEndX, originY, 0, '#CCC');  // x-axis
    svg += animatedLine(originX, originY, originX, axisEndY, 100, '#CCC'); // y-axis

    // Axis labels
    svg += animatedLabel(axisEndX - 5, originY + 16, 'x', 300, '#999', 11);
    svg += animatedLabel(originX - 14, axisEndY + 10, 'y', 400, '#999', 11);
    svg += animatedLabel(originX - 8, originY + 14, 'O', 200, '#999', 10);

    if (points.length === 0) {
      // Try to extract intercepts from equation
      var interceptM = text.match(/(\d+)x\s*\+\s*(\d+)y\s*=\s*(\d+)/);
      if (interceptM) {
        var a = parseFloat(interceptM[1]);
        var b = parseFloat(interceptM[2]);
        var c = parseFloat(interceptM[3]);
        points.push({ x: c / a, y: 0 });
        points.push({ x: 0, y: c / b });
      }
    }

    if (points.length > 0) {
      // Scale points to fit
      var maxVal = 1;
      for (var i = 0; i < points.length; i++) {
        maxVal = Math.max(maxVal, Math.abs(points[i].x), Math.abs(points[i].y));
      }
      var drawW = axisEndX - originX - 20;
      var drawH = originY - axisEndY - 20;
      var pScale = Math.min(drawW, drawH) / (maxVal * 1.2);

      for (var i = 0; i < points.length; i++) {
        var sx = originX + points[i].x * pScale;
        var sy = originY - points[i].y * pScale;
        svg += animatedDot(sx, sy, 500 + i * 200, '#FF6B6B');
        svg += animatedLabel(sx + 8, sy - 8,
          '(' + points[i].x + ',' + points[i].y + ')',
          600 + i * 200, '#1B2A4A', 10);
      }

      // Draw line between first two points
      if (points.length >= 2) {
        var sx1 = originX + points[0].x * pScale;
        var sy1 = originY - points[0].y * pScale;
        var sx2 = originX + points[1].x * pScale;
        var sy2 = originY - points[1].y * pScale;
        svg += animatedLine(sx1, sy1, sx2, sy2, 900, '#4ECDC4');
      }

      // Draw filled triangle if origin is involved
      if (text.match(/area\s+of\s+triangle/i) && points.length >= 2) {
        var sx1 = originX + points[0].x * pScale;
        var sy1 = originY - points[0].y * pScale;
        var sx2 = originX + points[1].x * pScale;
        var sy2 = originY - points[1].y * pScale;
        svg += animatedPolygon([
          { x: originX, y: originY },
          { x: sx1, y: sy1 },
          { x: sx2, y: sy2 }
        ], 1100, '#4ECDC4', 'rgba(78,205,196,0.1)');
      }
    }

    // Axis tick marks
    if (points.length > 0) {
      var maxVal = 1;
      for (var i = 0; i < points.length; i++) {
        maxVal = Math.max(maxVal, Math.abs(points[i].x), Math.abs(points[i].y));
      }
      var drawW = axisEndX - originX - 20;
      var drawH = originY - axisEndY - 20;
      var pScale = Math.min(drawW, drawH) / (maxVal * 1.2);
      var step = Math.ceil(maxVal / 5);
      for (var v = step; v <= maxVal; v += step) {
        var tx = originX + v * pScale;
        var ty = originY - v * pScale;
        if (tx < axisEndX - 10) {
          svg += '<line x1="' + tx + '" y1="' + (originY - 3) + '" x2="' + tx + '" y2="' + (originY + 3) + '" stroke="#BBB" stroke-width="1" ' +
            'style="opacity:0; animation: geo-fade 0.2s ease forwards; animation-delay: 150ms;" />';
          svg += animatedLabel(tx, originY + 14, '' + v, 200, '#999', 9);
        }
        if (ty > axisEndY + 10) {
          svg += '<line x1="' + (originX - 3) + '" y1="' + ty + '" x2="' + (originX + 3) + '" y2="' + ty + '" stroke="#BBB" stroke-width="1" ' +
            'style="opacity:0; animation: geo-fade 0.2s ease forwards; animation-delay: 150ms;" />';
          svg += animatedLabel(originX - 14, ty + 4, '' + v, 200, '#999', 9);
        }
      }
    }

    svg += '</svg>';
    return svg;
  }

  return {
    generate: generate
  };
})();
