// Whiteboard - Scratchpad for iPad drawing
// Features: pen, eraser, color picker, undo, shape recognition (lines & circles)
// Touch-optimized with two-finger erase

var Whiteboard = (function() {
  var canvas, ctx;
  var strokes = [];       // [{points, color, width, type}]
  var undoStack = [];     // for undo
  var currentStroke = null;
  var isDrawing = false;
  var isErasing = false;
  var currentColor = '#1B2A4A';
  var lineWidth = 3;
  var eraseRadius = 30;
  var dpr = 1;
  var wrapEl, toggleBtn;
  var collapsed = false;

  function init() {
    canvas = document.getElementById('whiteboardCanvas');
    wrapEl = document.getElementById('whiteboardWrap');
    toggleBtn = document.getElementById('whiteboardToggle');
    if (!canvas || !wrapEl) return;

    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
    resizeCanvas();

    // Touch events
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    // Mouse events (desktop fallback)
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

    // Toolbar buttons
    bindToolbar();

    // Toggle
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleWhiteboard);
    }

    // Resize
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas || !wrapEl) return;
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = rect.width || canvas.parentElement.offsetWidth || 300;
    // Let CSS control height via calc(100vh - 220px), read computed value
    var computedH = parseFloat(window.getComputedStyle(canvas).height) || 500;
    canvas.style.width = w + 'px';
    canvas.width = w * dpr;
    canvas.height = computedH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawAll();
  }

  function toggleWhiteboard() {
    collapsed = !collapsed;
    if (collapsed) {
      wrapEl.style.display = 'none';
      toggleBtn.innerHTML = '&#x270F;&#xFE0F; Scratchpad &#x25B8;';
    } else {
      wrapEl.style.display = 'block';
      toggleBtn.innerHTML = '&#x270F;&#xFE0F; Scratchpad &#x25BE;';
      resizeCanvas();
    }
  }

  function bindToolbar() {
    // Color buttons
    var colorBtns = document.querySelectorAll('.wb-color-btn');
    for (var i = 0; i < colorBtns.length; i++) {
      colorBtns[i].addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
        // Update active state
        var all = document.querySelectorAll('.wb-color-btn');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
        this.classList.add('active');
        // Switch to pen mode
        setToolMode('pen');
      });
    }

    // Pen button
    var penBtn = document.getElementById('wbPenBtn');
    if (penBtn) penBtn.addEventListener('click', function() { setToolMode('pen'); });

    // Eraser button
    var eraserBtn = document.getElementById('wbEraserBtn');
    if (eraserBtn) eraserBtn.addEventListener('click', function() { setToolMode('eraser'); });

    // Clear button
    var clearBtn = document.getElementById('wbClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    // Undo button
    var undoBtn = document.getElementById('wbUndoBtn');
    if (undoBtn) undoBtn.addEventListener('click', undo);
  }

  var toolMode = 'pen'; // pen | eraser
  function setToolMode(mode) {
    toolMode = mode;
    var penBtn = document.getElementById('wbPenBtn');
    var eraserBtn = document.getElementById('wbEraserBtn');
    if (penBtn) penBtn.classList.toggle('active', mode === 'pen');
    if (eraserBtn) eraserBtn.classList.toggle('active', mode === 'eraser');
    if (canvas) canvas.style.cursor = mode === 'eraser' ? 'crosshair' : 'default';
  }

  // ---- Touch handling ----
  function getPos(touch) {
    var rect = canvas.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      // Two-finger erase
      isErasing = true;
      if (currentStroke) {
        // Cancel current drawing stroke
        currentStroke = null;
        isDrawing = false;
      }
      var pos = getPos(e.touches[1]);
      eraseAt(pos.x, pos.y);
      return;
    }
    if (e.touches.length > 2) return;

    if (isErasing) return;

    var pos = getPos(e.touches[0]);
    startStroke(pos);
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2 && isErasing) {
      // Erase at both finger positions
      for (var i = 0; i < e.touches.length; i++) {
        var pos = getPos(e.touches[i]);
        eraseAt(pos.x, pos.y);
      }
      return;
    }
    if (isErasing) return;
    if (!isDrawing || !currentStroke) return;
    if (e.touches.length !== 1) return;

    var pos = getPos(e.touches[0]);
    continueStroke(pos);
  }

  function onTouchEnd(e) {
    if (e.touches.length === 0) {
      isErasing = false;
      if (isDrawing && currentStroke) {
        endStroke();
      }
    } else if (e.touches.length === 1 && isErasing) {
      // Still one finger, exit erase mode
      isErasing = false;
    }
  }

  // ---- Mouse handling ----
  function onMouseDown(e) {
    if (toolMode === 'eraser') {
      isErasing = true;
      var pos = { x: e.offsetX, y: e.offsetY };
      eraseAt(pos.x, pos.y);
      return;
    }
    var pos = { x: e.offsetX, y: e.offsetY };
    startStroke(pos);
  }

  function onMouseMove(e) {
    if (isErasing && toolMode === 'eraser') {
      if (e.buttons === 1) {
        var pos = { x: e.offsetX, y: e.offsetY };
        eraseAt(pos.x, pos.y);
      }
      return;
    }
    if (!isDrawing || !currentStroke) return;
    var pos = { x: e.offsetX, y: e.offsetY };
    continueStroke(pos);
  }

  function onMouseUp() {
    if (isErasing) {
      isErasing = false;
      return;
    }
    if (isDrawing && currentStroke) {
      endStroke();
    }
  }

  // ---- Drawing ----
  function startStroke(pos) {
    isDrawing = true;
    currentStroke = {
      points: [pos],
      color: currentColor,
      width: lineWidth,
      type: 'freehand'
    };
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function continueStroke(pos) {
    currentStroke.points.push(pos);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function endStroke() {
    isDrawing = false;
    if (!currentStroke || currentStroke.points.length < 2) {
      currentStroke = null;
      return;
    }

    // Try shape recognition
    var recognized = recognizeShape(currentStroke);
    if (recognized) {
      undoStack.push({ action: 'draw', stroke: recognized });
      strokes.push(recognized);
    } else {
      undoStack.push({ action: 'draw', stroke: currentStroke });
      strokes.push(currentStroke);
    }
    currentStroke = null;
    redrawAll();
  }

  // ---- Shape recognition ----
  function recognizeShape(stroke) {
    var pts = stroke.points;
    if (pts.length < 3) return null;

    // Try line recognition
    var line = tryRecognizeLine(pts);
    if (line) {
      return {
        points: [pts[0], pts[pts.length - 1]],
        color: stroke.color,
        width: stroke.width,
        type: 'line'
      };
    }

    // Try circle recognition
    var circle = tryRecognizeCircle(pts);
    if (circle) {
      return {
        center: circle.center,
        radius: circle.radius,
        color: stroke.color,
        width: stroke.width,
        type: 'circle'
      };
    }

    return null;
  }

  function tryRecognizeLine(pts) {
    var start = pts[0];
    var end = pts[pts.length - 1];
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var lineLen = Math.sqrt(dx * dx + dy * dy);

    if (lineLen < 20) return false; // Too short

    // Calculate max perpendicular distance
    var maxDist = 0;
    for (var i = 1; i < pts.length - 1; i++) {
      var dist = pointToLineDist(pts[i], start, end);
      if (dist > maxDist) maxDist = dist;
    }

    // Calculate path length
    var pathLen = 0;
    for (var i = 1; i < pts.length; i++) {
      var pdx = pts[i].x - pts[i - 1].x;
      var pdy = pts[i].y - pts[i - 1].y;
      pathLen += Math.sqrt(pdx * pdx + pdy * pdy);
    }

    var threshold = Math.max(8, lineLen * 0.05);
    return maxDist < threshold && pathLen < lineLen * 1.5;
  }

  function pointToLineDist(p, a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.sqrt((p.x - a.x) * (p.x - a.x) + (p.y - a.y) * (p.y - a.y));
    var cross = Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx);
    return cross / Math.sqrt(len2);
  }

  function tryRecognizeCircle(pts) {
    if (pts.length < 8) return null;

    // Calculate centroid
    var cx = 0, cy = 0;
    for (var i = 0; i < pts.length; i++) {
      cx += pts[i].x;
      cy += pts[i].y;
    }
    cx /= pts.length;
    cy /= pts.length;

    // Calculate average radius and standard deviation
    var radii = [];
    for (var i = 0; i < pts.length; i++) {
      var dx = pts[i].x - cx;
      var dy = pts[i].y - cy;
      radii.push(Math.sqrt(dx * dx + dy * dy));
    }

    var avgR = 0;
    for (var i = 0; i < radii.length; i++) avgR += radii[i];
    avgR /= radii.length;

    if (avgR < 15) return null; // Too small

    var variance = 0;
    for (var i = 0; i < radii.length; i++) {
      var d = radii[i] - avgR;
      variance += d * d;
    }
    var stdDev = Math.sqrt(variance / radii.length);

    // Check start/end proximity
    var startEnd = Math.sqrt(
      (pts[0].x - pts[pts.length - 1].x) * (pts[0].x - pts[pts.length - 1].x) +
      (pts[0].y - pts[pts.length - 1].y) * (pts[0].y - pts[pts.length - 1].y)
    );

    if (stdDev / avgR < 0.15 && startEnd < avgR * 0.4) {
      return { center: { x: cx, y: cy }, radius: avgR };
    }

    return null;
  }

  // ---- Erasing ----
  function eraseAt(x, y) {
    var removed = [];
    var remaining = [];
    for (var i = 0; i < strokes.length; i++) {
      if (strokeHitTest(strokes[i], x, y, eraseRadius)) {
        removed.push(strokes[i]);
      } else {
        remaining.push(strokes[i]);
      }
    }
    if (removed.length > 0) {
      undoStack.push({ action: 'erase', strokes: removed });
      strokes = remaining;
      redrawAll();
    }
  }

  function strokeHitTest(stroke, x, y, radius) {
    if (stroke.type === 'circle') {
      // Test distance from point to circle perimeter
      var dx = x - stroke.center.x;
      var dy = y - stroke.center.y;
      var dist = Math.abs(Math.sqrt(dx * dx + dy * dy) - stroke.radius);
      return dist < radius;
    }

    var pts = stroke.points;
    for (var i = 0; i < pts.length; i++) {
      var dx = pts[i].x - x;
      var dy = pts[i].y - y;
      if (dx * dx + dy * dy < radius * radius) return true;
    }
    return false;
  }

  // ---- Undo ----
  function undo() {
    if (undoStack.length === 0) return;
    var action = undoStack.pop();
    if (action.action === 'draw') {
      // Remove the last drawn stroke
      var idx = strokes.indexOf(action.stroke);
      if (idx >= 0) strokes.splice(idx, 1);
    } else if (action.action === 'erase') {
      // Restore erased strokes
      for (var i = 0; i < action.strokes.length; i++) {
        strokes.push(action.strokes[i]);
      }
    }
    redrawAll();
  }

  // ---- Rendering ----
  function redrawAll() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    for (var i = 0; i < strokes.length; i++) {
      drawStroke(strokes[i]);
    }
  }

  function drawStroke(stroke) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.type === 'circle') {
      ctx.beginPath();
      ctx.arc(stroke.center.x, stroke.center.y, stroke.radius, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    if (stroke.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      ctx.lineTo(stroke.points[1].x, stroke.points[1].y);
      ctx.stroke();
      return;
    }

    // Freehand
    var pts = stroke.points;
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var j = 1; j < pts.length; j++) {
      ctx.lineTo(pts[j].x, pts[j].y);
    }
    ctx.stroke();
  }

  // ---- Clear ----
  function clearAll() {
    if (strokes.length > 0) {
      undoStack.push({ action: 'erase', strokes: strokes.slice() });
    }
    strokes = [];
    redrawAll();
  }

  function clear() {
    strokes = [];
    undoStack = [];
    redrawAll();
  }

  return {
    init: init,
    clear: clear
  };
})();
