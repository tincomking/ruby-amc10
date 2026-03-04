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
  var wrapEl;
  var displayW = 0, displayH = 0; // cached CSS display size

  function init() {
    canvas = document.getElementById('whiteboardCanvas');
    wrapEl = document.getElementById('whiteboardWrap');
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

    // Resize: window + orientation change
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', function() {
      setTimeout(resizeCanvas, 200);
    });

    // ResizeObserver for reliable responsive detection
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resizeCanvas).observe(wrapEl);
    }
  }

  function resizeCanvas() {
    if (!canvas || !wrapEl) return;

    // 1. Remove inline size so CSS rules (width:100%, height:calc) take effect
    canvas.style.width = '';
    canvas.style.height = '';

    // 2. Measure actual CSS display size
    var rect = canvas.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w < 10 || h < 10) return; // not visible yet

    // 3. Set high-DPI buffer
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    // 4. LOCK CSS display size via inline styles
    //    This prevents layout feedback loops where setting canvas.width
    //    could change grid sizing, causing coordinate mismatches
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    // Cache display dimensions
    displayW = w;
    displayH = h;

    // 5. Scale context so we draw in CSS-pixel space
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.scale(dpr, dpr);

    redrawAll();
  }

  function bindToolbar() {
    // Color buttons
    var colorBtns = document.querySelectorAll('.wb-color-btn');
    for (var i = 0; i < colorBtns.length; i++) {
      colorBtns[i].addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
        var all = document.querySelectorAll('.wb-color-btn');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
        this.classList.add('active');
        setToolMode('pen');
      });
    }

    var penBtn = document.getElementById('wbPenBtn');
    if (penBtn) penBtn.addEventListener('click', function() { setToolMode('pen'); });

    var eraserBtn = document.getElementById('wbEraserBtn');
    if (eraserBtn) eraserBtn.addEventListener('click', function() { setToolMode('eraser'); });

    var clearBtn = document.getElementById('wbClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    var undoBtn = document.getElementById('wbUndoBtn');
    if (undoBtn) undoBtn.addEventListener('click', undo);
  }

  var toolMode = 'pen';
  function setToolMode(mode) {
    toolMode = mode;
    var penBtn = document.getElementById('wbPenBtn');
    var eraserBtn = document.getElementById('wbEraserBtn');
    if (penBtn) penBtn.classList.toggle('active', mode === 'pen');
    if (eraserBtn) eraserBtn.classList.toggle('active', mode === 'eraser');
    if (canvas) canvas.style.cursor = mode === 'eraser' ? 'crosshair' : 'default';
  }

  // ---- Coordinate mapping ----
  // Always use getBoundingClientRect() at event time for accurate mapping.
  // With ctx.scale(dpr, dpr), drawing space is in CSS pixels.
  function getPos(touch) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = displayW / rect.width;   // handle any CSS transform scaling
    var scaleY = displayH / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    };
  }

  function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = displayW / rect.width;
    var scaleY = displayH / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // ---- Touch handling ----
  function onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      isErasing = true;
      if (currentStroke) {
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
    if (toolMode === 'eraser') {
      isErasing = true;
      eraseAt(pos.x, pos.y);
    } else {
      startStroke(pos);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2 && isErasing) {
      for (var i = 0; i < e.touches.length; i++) {
        var pos = getPos(e.touches[i]);
        eraseAt(pos.x, pos.y);
      }
      return;
    }
    if (isErasing && toolMode === 'eraser') {
      if (e.touches.length === 1) {
        var pos = getPos(e.touches[0]);
        eraseAt(pos.x, pos.y);
      }
      return;
    }
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
      isErasing = false;
    }
  }

  // ---- Mouse handling ----
  function onMouseDown(e) {
    var pos = getMousePos(e);
    if (toolMode === 'eraser') {
      isErasing = true;
      eraseAt(pos.x, pos.y);
      return;
    }
    startStroke(pos);
  }

  function onMouseMove(e) {
    if (isErasing && toolMode === 'eraser') {
      if (e.buttons === 1) {
        var pos = getMousePos(e);
        eraseAt(pos.x, pos.y);
      }
      return;
    }
    if (!isDrawing || !currentStroke) return;
    var pos = getMousePos(e);
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

    var line = tryRecognizeLine(pts);
    if (line) {
      return {
        points: [pts[0], pts[pts.length - 1]],
        color: stroke.color,
        width: stroke.width,
        type: 'line'
      };
    }

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

    if (lineLen < 20) return false;

    var maxDist = 0;
    for (var i = 1; i < pts.length - 1; i++) {
      var dist = pointToLineDist(pts[i], start, end);
      if (dist > maxDist) maxDist = dist;
    }

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

    var cx = 0, cy = 0;
    for (var i = 0; i < pts.length; i++) {
      cx += pts[i].x;
      cy += pts[i].y;
    }
    cx /= pts.length;
    cy /= pts.length;

    var radii = [];
    for (var i = 0; i < pts.length; i++) {
      var dx = pts[i].x - cx;
      var dy = pts[i].y - cy;
      radii.push(Math.sqrt(dx * dx + dy * dy));
    }

    var avgR = 0;
    for (var i = 0; i < radii.length; i++) avgR += radii[i];
    avgR /= radii.length;

    if (avgR < 15) return null;

    var variance = 0;
    for (var i = 0; i < radii.length; i++) {
      var d = radii[i] - avgR;
      variance += d * d;
    }
    var stdDev = Math.sqrt(variance / radii.length);

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
      var idx = strokes.indexOf(action.stroke);
      if (idx >= 0) strokes.splice(idx, 1);
    } else if (action.action === 'erase') {
      for (var i = 0; i < action.strokes.length; i++) {
        strokes.push(action.strokes[i]);
      }
    }
    redrawAll();
  }

  // ---- Rendering ----
  function redrawAll() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, displayW, displayH);

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
