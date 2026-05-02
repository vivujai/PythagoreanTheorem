const { useState, useCallback, useMemo, useRef, useEffect } = React;

/* ========================================
   Constants & Utilities
   ======================================== */
const COLORS = ['#acfcd9ff', '#55d6beff', '#058ed9ff'];

function getTriangleColor(index) {
  return COLORS[index % COLORS.length];
}

// Geometry helpers
function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function triangleArea(pts) {
  const [a, b, c] = pts;
  return Math.abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2);
}

function computeTriInfo(tri, offset) {
  const off = offset || { x: 0, y: 0 };
  const pts = tri.points.map(p => [+(p[0] + off.x).toFixed(4), +(p[1] + off.y).toFixed(4)]);
  const sides = [
    { from: 0, to: 1, len: dist(pts[0], pts[1]) },
    { from: 1, to: 2, len: dist(pts[1], pts[2]) },
    { from: 2, to: 0, len: dist(pts[2], pts[0]) }
  ];
  const perimeter = sides.reduce((s, e) => s + e.len, 0);
  const area = triangleArea(pts);
  return { pts, sides, perimeter, area };
}

/* ========================================
   Graph Component (SVG)
   ======================================== */
function GraphView({ planeSize, gridSize, gridSnap, triangles, spiralTriangles, selectedIndex, onSelectTriangle, onOffsetChange }) {
  const padding = 40;
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  // Per-shape drag offsets (in graph-space units)
  const [offsets, setOffsets] = useState({});
  // Drag state
  const [dragIndex, setDragIndex] = useState(null);
  const dragStart = useRef(null);   // SVG-space start position
  const dragOffsetStart = useRef({ x: 0, y: 0 }); // offset at drag start

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reset offsets when shapes change
  useEffect(() => { setOffsets({}); }, [triangles, spiralTriangles]);

  const { w, h } = dims;
  const graphW = w - padding * 2;
  const graphH = h - padding * 2;
  const scale = Math.min(graphW, graphH) / (planeSize * 2);

  const cx = padding + graphW / 2;
  const cy = padding + graphH / 2;

  const toX = v => cx + v * scale;
  const toY = v => cy - v * scale;

  // Convert a client (page) position to SVG viewBox coordinates
  const clientToSVG = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgP = pt.matrixTransform(ctm.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Snap a graph-space value to the nearest grid increment
  const snapToGrid = useCallback(v => Math.round(v / gridSnap) * gridSnap, [gridSnap]);

  // ---- Drag handlers ----
  const handlePointerDown = useCallback((e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    const svgPos = clientToSVG(e.clientX, e.clientY);
    dragStart.current = svgPos;
    const cur = offsets[idx] || { x: 0, y: 0 };
    dragOffsetStart.current = { ...cur };
    setDragIndex(idx);
    // Select this triangle for the info panel
    if (onSelectTriangle) onSelectTriangle(idx);
    // Report current offset so info panel updates immediately
    if (onOffsetChange) onOffsetChange(idx, cur);

    // Capture pointer to receive move/up even outside SVG
    e.target.setPointerCapture(e.pointerId);
  }, [clientToSVG, offsets, onSelectTriangle, onOffsetChange]);

  const handlePointerMove = useCallback((e) => {
    if (dragIndex === null || !dragStart.current) return;
    const svgPos = clientToSVG(e.clientX, e.clientY);
    const dx = (svgPos.x - dragStart.current.x) / scale;  // convert px delta to graph-space
    const dy = -(svgPos.y - dragStart.current.y) / scale;  // invert Y
    setOffsets(prev => ({
      ...prev,
      [dragIndex]: {
        x: dragOffsetStart.current.x + dx,
        y: dragOffsetStart.current.y + dy
      }
    }));
  }, [dragIndex, clientToSVG, scale]);

  const handlePointerUp = useCallback(() => {
    if (dragIndex === null) return;
    // Snap to grid
    setOffsets(prev => {
      const cur = prev[dragIndex] || { x: 0, y: 0 };
      const snapped = {
        x: snapToGrid(cur.x),
        y: snapToGrid(cur.y)
      };
      // Report snapped offset to parent for info panel
      if (onOffsetChange) onOffsetChange(dragIndex, snapped);
      return {
        ...prev,
        [dragIndex]: snapped
      };
    });
    setDragIndex(null);
    dragStart.current = null;
  }, [dragIndex, snapToGrid, onOffsetChange]);

  // Grid lines & labels
  const gridLines = [];
  const labels = [];
  const step = gridSize;
  const labelStep = gridSize >= 5 ? gridSize : (planeSize <= 50 ? 5 : 10);

  for (let i = -planeSize; i <= planeSize; i += step) {
    gridLines.push(
      <line key={`gv${i}`} x1={toX(i)} y1={toY(-planeSize)} x2={toX(i)} y2={toY(planeSize)} className="graph-grid-line" />,
      <line key={`gh${i}`} x1={toX(-planeSize)} y1={toY(i)} x2={toX(planeSize)} y2={toY(i)} className="graph-grid-line" />
    );
  }
  for (let i = -planeSize; i <= planeSize; i += labelStep) {
    if (i !== 0) {
      labels.push(
        <text key={`lx${i}`} x={toX(i)} y={toY(0) + 14} className="graph-tick-label" textAnchor="middle">{i}</text>,
        <text key={`ly${i}`} x={toX(0) - 8} y={toY(i) + 4} className="graph-tick-label" textAnchor="end">{i}</text>
      );
    }
  }
  labels.push(
    <text key="l0" x={toX(0) - 8} y={toY(0) + 14} className="graph-tick-label" textAnchor="end">0</text>
  );

  // Compute centroid of a triangle (in SVG pixel space) for transform-origin
  const centroidSVG = (points, off) => {
    let sx = 0, sy = 0;
    for (const p of points) {
      sx += toX(p[0] + off.x);
      sy += toY(p[1] + off.y);
    }
    return { x: sx / points.length, y: sy / points.length };
  };

  // Render a single draggable triangle group
  const renderTri = (tri, idx) => {
    const color = getTriangleColor(idx);
    const off = offsets[idx] || { x: 0, y: 0 };
    const isDragging = dragIndex === idx;
    const isSelected = selectedIndex === idx;

    const pts = tri.points.map(p => `${toX(p[0] + off.x)},${toY(p[1] + off.y)}`).join(' ');
    const cen = centroidSVG(tri.points, off);

    // Build SVG transform: scale from centroid
    const s = isDragging ? 1.08 : 1;
    const transformStr = `translate(${cen.x}, ${cen.y}) scale(${s}) translate(${-cen.x}, ${-cen.y})`;

    return (
      <g
        key={idx}
        transform={transformStr}
        className={`draggable-shape${isDragging ? ' dragging' : ''}${isSelected ? ' selected' : ''}`}
        onPointerDown={e => handlePointerDown(e, idx)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <polygon
          points={pts}
          fill={color}
          fillOpacity={isSelected ? '0.72' : '0.55'}
          stroke={isSelected ? '#2e2f2f' : color}
          strokeWidth={isSelected ? '3' : '2.5'}
          className="triangle-shape"
          strokeDasharray={isSelected ? '6 3' : 'none'}
        />
        {/* Invisible wider hit area for easier grabbing */}
        <polygon
          points={pts}
          fill="transparent"
          stroke="transparent"
          strokeWidth="12"
          style={{ pointerEvents: 'stroke' }}
        />
        {tri.labels && tri.labels.map((lb, li) => (
          <text
            key={li}
            x={toX(lb.x + off.x)}
            y={toY(lb.y + off.y)}
            className="triangle-label"
            dy={lb.dy || 0}
            dx={lb.dx || 0}
          >
            {lb.text}
          </text>
        ))}
      </g>
    );
  };

  const allTriangles = [...triangles, ...spiralTriangles];

  return (
    <div className="graph-svg-wrapper" ref={wrapperRef} style={{ background: '#cddddd' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {gridLines}
        <line x1={toX(-planeSize)} y1={toY(0)} x2={toX(planeSize)} y2={toY(0)} className="graph-axis-line" />
        <line x1={toX(0)} y1={toY(-planeSize)} x2={toX(0)} y2={toY(planeSize)} className="graph-axis-line" />
        {labels}
        {allTriangles.map((tri, i) => renderTri(tri, i))}
      </svg>
    </div>
  );
}

/* ========================================
   Home Page
   ======================================== */
function HomePage({ onNavigate }) {
  return (
    <div className="home-content">
      <p className="home-subtitle">
        Explore the beauty of right-angle triangles through interactive visualization.
        Calculate, identify, and create geometric shapes on a live coordinate plane.
      </p>
      <div className="home-formula">a² + b² = c²</div>
      <button id="cta-graph-btn" className="cta-button" onClick={onNavigate}>
        Open Graph
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </button>
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">📐</div>
          <div className="feature-card-title">Calculate</div>
          <div className="feature-card-desc">Find missing sides instantly</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🔍</div>
          <div className="feature-card-title">Identify</div>
          <div className="feature-card-desc">Verify triples & right angles</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🌀</div>
          <div className="feature-card-title">Spiral</div>
          <div className="feature-card-desc">Build the Spiral of Theodorus</div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   Calculator Sections
   ======================================== */
function CollapsibleSection({ id, title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  return (
    <div className="calc-section" id={id}>
      <div className="calc-section-header" onClick={() => setOpen(o => !o)}>
        <h3>{title}</h3>
        <span className={`collapse-icon ${open ? '' : 'collapsed'}`}>▲</span>
      </div>
      <div className={`calc-section-body ${open ? '' : 'hidden'}`}>{children}</div>
    </div>
  );
}

function PythagoreanCalc({ onDraw }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [msg, setMsg] = useState(null);

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);
    const filled = [!isNaN(av), !isNaN(bv), !isNaN(cv)];
    const count = filled.filter(Boolean).length;
    if (count !== 2) { setMsg({ type: 'error', text: 'Please fill exactly two fields.' }); return; }
    let ra = av, rb = bv, rc = cv;
    if (isNaN(ra)) ra = Math.sqrt(cv * cv - bv * bv);
    else if (isNaN(rb)) rb = Math.sqrt(cv * cv - av * av);
    else rc = Math.sqrt(av * av + bv * bv);
    if (isNaN(ra) || isNaN(rb) || isNaN(rc) || ra <= 0 || rb <= 0 || rc <= 0) {
      setMsg({ type: 'error', text: 'Invalid values. Check inputs.' }); return;
    }
    setA(ra.toFixed(2)); setB(rb.toFixed(2)); setC(rc.toFixed(2));
    setMsg({ type: 'success', text: `a=${ra.toFixed(2)}, b=${rb.toFixed(2)}, c=${rc.toFixed(2)}` });
    const ox = 0, oy = 0;
    onDraw([{
      points: [[ox, oy], [ox + rb, oy], [ox, oy + ra]],
      labels: [
        { x: ox - 1.5, y: oy + ra / 2, text: `a=${ra.toFixed(1)}`, dx: -4 },
        { x: ox + rb / 2, y: oy - 1.2, text: `b=${rb.toFixed(1)}`, dy: 12 },
        { x: ox + rb / 2 + 1, y: oy + ra / 2 + 1, text: `c=${rc.toFixed(1)}` }
      ]
    }]);
  };

  return (
    <CollapsibleSection id="calc-pythag" title="Pythagorean Theorem Calculator">
      <div className="input-row">
        <div className="input-group"><label>Height (a)</label><input id="input-a" value={a} onChange={e => setA(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><label>Base (b)</label><input id="input-b" value={b} onChange={e => setB(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><label>Hypotenuse (c)</label><input id="input-c" value={c} onChange={e => setC(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-calc-pythag" className="calc-btn" onClick={calculate}>Calculate</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function TripleIdentifier({ onDraw }) {
  const [v1, setV1] = useState(''); const [v2, setV2] = useState(''); const [v3, setV3] = useState('');
  const [msg, setMsg] = useState(null);

  const identify = () => {
    const a = parseInt(v1), b = parseInt(v2), c = parseInt(v3);
    if (isNaN(a) || isNaN(b) || isNaN(c)) { setMsg({ type: 'error', text: 'Enter three integers.' }); return; }
    const sorted = [a, b, c].sort((x, y) => x - y);
    const isTriple = sorted[0] * sorted[0] + sorted[1] * sorted[1] === sorted[2] * sorted[2];
    if (isTriple) {
      setMsg({ type: 'success', text: 'These form a Pythagorean Triple!' });
      const ox = 0, oy = 0;
      onDraw([{ points: [[ox, oy], [ox + sorted[1], oy], [ox, oy + sorted[0]]], labels: [] }]);
    } else {
      setMsg({ type: 'error', text: 'These do not form a triple.' });
    }
  };

  return (
    <CollapsibleSection id="calc-triple" title="Pythagorean Triple Identifier">
      <div className="input-row">
        <div className="input-group"><input id="input-t1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-t2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-t3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-triple" className="calc-btn" onClick={identify}>Identify</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function Calc454590({ onDraw }) {
  const [val, setVal] = useState('');
  const [mode, setMode] = useState('side');
  const [msg, setMsg] = useState(null);

  const calculate = () => {
    const v = parseFloat(val);
    if (isNaN(v) || v <= 0) { setMsg({ type: 'error', text: 'Enter a positive number.' }); return; }
    let s, hyp;
    if (mode === 'side') { s = v; hyp = v * Math.SQRT2; }
    else { hyp = v; s = v / Math.SQRT2; }
    setMsg({ type: 'success', text: `Side = ${s.toFixed(2)}, Hypotenuse = ${hyp.toFixed(2)}` });
    const ox = 0, oy = 0;
    onDraw([{
      points: [[ox, oy], [ox + s, oy], [ox, oy + s]], labels: [
        { x: ox + s / 2, y: oy - 1.2, text: `s=${s.toFixed(1)}`, dy: 12 },
        { x: ox - 1.5, y: oy + s / 2, text: `s=${s.toFixed(1)}` },
        { x: ox + s / 2 + 1, y: oy + s / 2 + 1, text: `${hyp.toFixed(1)}` }
      ]
    }]);
  };

  return (
    <CollapsibleSection id="calc-4590" title="45°, 45°, 90° Triangle Calculator">
      <div className="radio-row">
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'side'} onChange={() => setMode('side')} /> Side (s)</label>
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'hyp'} onChange={() => setMode('hyp')} /> Hypotenuse</label>
      </div>
      <div className="input-group"><label>One Side</label><input id="input-4590" value={val} onChange={e => setVal(e.target.value)} placeholder={mode === 'side' ? 's' : 's√2'} /></div>
      <button id="btn-calc-4590" className="calc-btn" onClick={calculate}>Calculate</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function RightAngleIdentifier({ onDraw }) {
  const [v1, setV1] = useState(''); const [v2, setV2] = useState(''); const [v3, setV3] = useState('');
  const [msg, setMsg] = useState(null);

  const identify = () => {
    const a = parseFloat(v1), b = parseFloat(v2), c = parseFloat(v3);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) { setMsg({ type: 'error', text: 'Enter three positive numbers.' }); return; }
    const sorted = [a, b, c].sort((x, y) => x - y);
    const eps = 0.0001;
    const isRight = Math.abs(sorted[0] * sorted[0] + sorted[1] * sorted[1] - sorted[2] * sorted[2]) < eps;
    if (isRight) {
      setMsg({ type: 'success', text: 'This IS a right-angle triangle!' });
      const ox = 0, oy = 0;
      onDraw([{ points: [[ox, oy], [ox + sorted[1], oy], [ox, oy + sorted[0]]], labels: [] }]);
    } else {
      setMsg({ type: 'error', text: 'This is NOT a right-angle triangle.' });
    }
  };

  return (
    <CollapsibleSection id="calc-rightangle" title="Right Angle Triangle Identifier">
      <div className="input-row">
        <div className="input-group"><input id="input-ra1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-ra2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-ra3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-right" className="calc-btn" onClick={identify}>Identify</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function SpiralCreator({ onDrawSpiral }) {
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');
  const [count, setCount] = useState('16');
  const [msg, setMsg] = useState(null);

  const create = () => {
    const b0 = parseFloat(base), h = parseFloat(height), N = parseInt(count);
    if (isNaN(b0) || isNaN(h) || isNaN(N) || b0 <= 0 || h <= 0 || N <= 0) { setMsg({ type: 'error', text: 'Enter positive values.' }); return; }
    const tris = [];
    let cx = 0, cy = 0, angle = 0, currentBase = b0;
    for (let i = 0; i < N; i++) {
      const hyp = Math.sqrt(currentBase * currentBase + h * h);
      const baseAngle = Math.atan2(h, currentBase);
      const bx = cx + currentBase * Math.cos(angle);
      const by = cy + currentBase * Math.sin(angle);
      const hx = bx + h * Math.cos(angle + Math.PI / 2);
      const hy = by + h * Math.sin(angle + Math.PI / 2);

      tris.push({ points: [[cx, cy], [bx, by], [hx, hy]], labels: [] });
      angle += baseAngle;
      currentBase = hyp;
    }
    setMsg({ type: 'success', text: `Spiral created with ${N} triangles!` });
    onDrawSpiral(tris);
  };

  return (
    <CollapsibleSection id="calc-spiral" title="Pythagorean Spiral Creator">
      <div className="input-row">
        <div className="input-group"><label>Starting Base</label><input id="input-spiral-base" value={base} onChange={e => setBase(e.target.value)} placeholder="b₀" /></div>
        <div className="input-group"><label>Starting Height</label><input id="input-spiral-height" value={height} onChange={e => setHeight(e.target.value)} placeholder="h" /></div>
        <div className="input-group"><label>Triangles</label><input id="input-spiral-count" value={count} onChange={e => setCount(e.target.value)} placeholder="Count" type="number" min="1" max="100" /></div>
      </div>
      <button id="btn-create-spiral" className="calc-btn" onClick={create}>Create Spiral</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

/* ========================================
   Side Panel
   ======================================== */
function SidePanel({ activeTab, setActiveTab, planeSize, setPlaneSize, gridSize, setGridSize, gridSnap, setGridSnap, onDrawTriangles, onDrawSpiral, graphActive }) {
  const tabs = ['Calculators', 'Tools', 'Settings'];

  return (
    <aside className="side-panel">
      <div className="panel-header"><h2>Calculators</h2></div>
      <div className="subtabs">
        {tabs.map(t => (
          <button key={t} className={`subtab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>
      <div className="panel-body">
        {activeTab === 'Calculators' && (
          <>
            <PythagoreanCalc onDraw={onDrawTriangles} />
            <TripleIdentifier onDraw={onDrawTriangles} />
            <Calc454590 onDraw={onDrawTriangles} />
            <RightAngleIdentifier onDraw={onDrawTriangles} />
            <SpiralCreator onDrawSpiral={onDrawSpiral} />
          </>
        )}
        {activeTab === 'Tools' && (
          <div style={{ padding: '16px 0', fontSize: '0.82rem', opacity: 0.6 }}>
            <p>Additional tools and exports coming soon.</p>
          </div>
        )}
        {(activeTab === 'Settings') && (
          <div className="settings-section">
            <h3>Settings</h3>
            <div className="settings-row">
              <div className="input-group">
                <label>Grid Size</label>
                <select id="select-grid-size" value={gridSize} onChange={e => setGridSize(parseFloat(e.target.value))}>
                  <option value={0.5}>0.5 units</option>
                  <option value={1}>1 unit</option>
                  <option value={5}>5 units</option>
                  <option value={10}>10 units</option>
                </select>
              </div>
              <div className="input-group">
                <label>Grid Snap</label>
                <select id="select-grid-snap" value={gridSnap} onChange={e => setGridSnap(parseFloat(e.target.value))}>
                  <option value={0.5}>0.5 units</option>
                  <option value={1}>1 unit</option>
                </select>
              </div>
              <div className="input-group">
                <label>Plane Size</label>
                <select id="select-plane-size" value={planeSize} onChange={e => setPlaneSize(parseInt(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="panel-footer">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</div>
    </aside>
  );
}

/* ========================================
   App Root
   ======================================== */
/* ========================================
   Triangle Info Panel
   ======================================== */
function TriangleInfoPanel({ triInfo, index, color }) {
  if (!triInfo) {
    return (
      <div className="tri-info-panel" id="tri-info-panel">
        <div className="tri-info-empty">
          <div className="tri-info-empty-icon">📐</div>
          <p>Click a triangle on the graph to view its details.</p>
        </div>
      </div>
    );
  }

  const { pts, sides, perimeter, area } = triInfo;
  const fmt = v => Number.isInteger(v) ? v.toString() : v.toFixed(2);

  return (
    <div className="tri-info-panel" id="tri-info-panel">
      <div className="tri-info-header">
        <span className="tri-info-swatch" style={{ background: color }}></span>
        <h3>Triangle #{index + 1}</h3>
      </div>

      <div className="tri-info-section">
        <h4>Vertices</h4>
        <div className="tri-info-table">
          {pts.map((p, i) => (
            <div key={i} className="tri-info-row">
              <span className="tri-info-label">P{i + 1}</span>
              <span className="tri-info-value">({fmt(p[0])}, {fmt(p[1])})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tri-info-section">
        <h4>Side Lengths</h4>
        <div className="tri-info-table">
          {sides.map((s, i) => (
            <div key={i} className="tri-info-row">
              <span className="tri-info-label">P{s.from + 1} → P{s.to + 1}</span>
              <span className="tri-info-value">{fmt(s.len)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tri-info-section">
        <h4>Measurements</h4>
        <div className="tri-info-table">
          <div className="tri-info-row">
            <span className="tri-info-label">Perimeter</span>
            <span className="tri-info-value tri-info-highlight">{fmt(perimeter)}</span>
          </div>
          <div className="tri-info-row">
            <span className="tri-info-label">Area</span>
            <span className="tri-info-value tri-info-highlight">{fmt(area)} sq units</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   App Root
   ======================================== */
function App() {
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('Calculators');
  const [planeSize, setPlaneSize] = useState(50);
  const [gridSize, setGridSize] = useState(1);
  const [gridSnap, setGridSnap] = useState(1);
  const [triangles, setTriangles] = useState([]);
  const [spiralTriangles, setSpiralTriangles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Drag offsets mirror — we track offsets in GraphView but also need them here for the info panel.
  // Instead, GraphView will report offset changes. We keep a lightweight copy.
  const [shapeOffsets, setShapeOffsets] = useState({});

  const handleDrawTriangles = useCallback(tris => {
    setTriangles(tris); setSpiralTriangles([]); setSelectedIndex(null); setShapeOffsets({});
    if (page === 'home') setPage('graph');
  }, [page]);
  const handleDrawSpiral = useCallback(tris => {
    setSpiralTriangles(tris); setTriangles([]); setSelectedIndex(null); setShapeOffsets({});
    if (page === 'home') setPage('graph');
  }, [page]);

  const handleSelectTriangle = useCallback((idx) => {
    setSelectedIndex(idx);
  }, []);

  const handleOffsetChange = useCallback((idx, offset) => {
    setShapeOffsets(prev => ({ ...prev, [idx]: offset }));
  }, []);

  // Compute info for selected triangle
  const allTriangles = useMemo(() => [...triangles, ...spiralTriangles], [triangles, spiralTriangles]);
  const selectedTriInfo = useMemo(() => {
    if (selectedIndex === null || !allTriangles[selectedIndex]) return null;
    return computeTriInfo(allTriangles[selectedIndex], shapeOffsets[selectedIndex]);
  }, [selectedIndex, allTriangles, shapeOffsets]);
  const selectedColor = selectedIndex !== null ? getTriangleColor(selectedIndex) : null;

  return (
    <div className="app-container">
      <div className="main-area">
        {page === 'home' ? (
          <>
            <h1 className="graph-title">Theorem De Pythagoras</h1>
            <HomePage onNavigate={() => setPage('graph')} />
          </>
        ) : (
          <>
            <h1 className="graph-title">Theorem De Pythagoras</h1>
            <div className="graph-container">
              <div className="graph-plane-area">
                <GraphView
                  planeSize={planeSize}
                  gridSize={gridSize}
                  gridSnap={gridSnap}
                  triangles={triangles}
                  spiralTriangles={spiralTriangles}
                  selectedIndex={selectedIndex}
                  onSelectTriangle={handleSelectTriangle}
                  onOffsetChange={handleOffsetChange}
                />
              </div>
              <TriangleInfoPanel triInfo={selectedTriInfo} index={selectedIndex} color={selectedColor} />
            </div>
          </>
        )}
      </div>
      <SidePanel
        activeTab={activeTab} setActiveTab={setActiveTab}
        planeSize={planeSize} setPlaneSize={setPlaneSize}
        gridSize={gridSize} setGridSize={setGridSize}
        gridSnap={gridSnap} setGridSnap={setGridSnap}
        onDrawTriangles={handleDrawTriangles}
        onDrawSpiral={handleDrawSpiral}
        graphActive={page === 'graph'}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
