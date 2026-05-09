const { useState, useCallback, useMemo, useRef, useEffect, useContext, createContext } = React;

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";

function generateLorem(length) {
  if (length <= 0) return "";
  let res = "";
  while (res.length < length) res += LOREM;
  return res.substring(0, length);
}

const DICT = {
  home_subtitle: { en: "Explore the beauty of right-angle triangles through interactive visualization. Calculate, identify, and create geometric shapes on a live coordinate plane.", fr: "Explorez la beauté des triangles rectangles grâce à une visualisation interactive. Calculez, identifiez et créez des formes géométriques sur un plan de coordonnées en direct.", de: "Entdecken Sie die Schönheit rechtwinkliger Dreiecke durch interaktive Visualisierung. Berechnen, identifizieren und erstellen Sie geometrische Formen auf einer Live-Koordinatenebene." },
  open_graph: { en: "Open Graph", fr: "Ouvrir le graphique", de: "Diagramm öffnen" },
  calculate: { en: "Calculate", fr: "Calculer", de: "Berechnen" },
  calc_desc: { en: "Find missing sides instantly", fr: "Trouvez instantanément les côtés manquants", de: "Fehlende Seiten sofort finden" },
  identify: { en: "Identify", fr: "Identifier", de: "Identifizieren" },
  ident_desc: { en: "Verify triples & right angles", fr: "Vérifier les triplets et les angles droits", de: "Tripel & rechte Winkel überprüfen" },
  spiral: { en: "Spiral", fr: "Spirale", de: "Spirale" },
  spiral_desc: { en: "Build the Spiral of Theodorus", fr: "Construire la Spirale de Théodore", de: "Die Spirale des Theodorus bauen" },
  calculators: { en: "Calculators", fr: "Calculatrices", de: "Taschenrechner" },
  tools: { en: "Tools", fr: "Outils", de: "Werkzeuge" },
  settings: { en: "Settings", fr: "Paramètres", de: "Einstellungen" },
  pythag_calc_title: { en: "Pythagorean Theorem Calculator", fr: "Calculatrice du théorème de Pythagore", de: "Satz des Pythagoras Rechner" },
  height_a: { en: "Height (a)", fr: "Hauteur (a)", de: "Höhe (a)" },
  base_b: { en: "Base (b)", fr: "Base (b)", de: "Basis (b)" },
  hypotenuse_c: { en: "Hypotenuse (c)", fr: "Hypoténuse (c)", de: "Hypotenuse (c)" },
  fill_two_fields: { en: "Please fill exactly two fields.", fr: "Veuillez remplir exactement deux champs.", de: "Bitte genau zwei Felder ausfüllen." },
  invalid_values: { en: "Invalid values. Check inputs.", fr: "Valeurs invalides. Vérifiez les entrées.", de: "Ungültige Werte. Eingaben prüfen." },
  triple_title: { en: "Pythagorean Triple Identifier", fr: "Identificateur de triplets pythagoriciens", de: "Pythagoreische Tripel Identifikator" },
  enter_three_ints: { en: "Enter three integers.", fr: "Entrez trois entiers.", de: "Geben Sie drei Ganzzahlen ein." },
  is_triple: { en: "These form a Pythagorean Triple!", fr: "Ceux-ci forment un triplet pythagoricien !", de: "Diese bilden ein pythagoreisches Tripel!" },
  not_triple: { en: "These do not form a triple.", fr: "Ceux-ci ne forment pas un triplet.", de: "Diese bilden kein Tripel." },
  calc_4590_title: { en: "45°, 45°, 90° Triangle Calculator", fr: "Calculatrice de triangle 45°, 45°, 90°", de: "45°, 45°, 90° Dreiecksrechner" },
  side_s: { en: "Side (s)", fr: "Côté (s)", de: "Seite (s)" },
  hypotenuse: { en: "Hypotenuse", fr: "Hypoténuse", de: "Hypotenuse" },
  one_side: { en: "One Side", fr: "Un côté", de: "Eine Seite" },
  enter_pos_num: { en: "Enter a positive number.", fr: "Entrez un nombre positif.", de: "Geben Sie eine positive Zahl ein." },
  right_angle_title: { en: "Right Angle Triangle Identifier", fr: "Identificateur de triangle rectangle", de: "Rechtwinkliges Dreieck Identifikator" },
  enter_three_pos: { en: "Enter three positive numbers.", fr: "Entrez trois nombres positifs.", de: "Geben Sie drei positive Zahlen ein." },
  is_right_angle: { en: "This IS a right-angle triangle!", fr: "C'EST un triangle rectangle !", de: "Dies IST ein rechtwinkliges Dreieck!" },
  not_right_angle: { en: "This is NOT a right-angle triangle.", fr: "Ce n'est PAS un triangle rectangle.", de: "Dies ist KEIN rechtwinkliges Dreieck." },
  spiral_title: { en: "Pythagorean Spiral Creator", fr: "Créateur de spirale pythagoricienne", de: "Pythagoreische Spirale Ersteller" },
  starting_base: { en: "Starting Base", fr: "Base de départ", de: "Startbasis" },
  starting_height: { en: "Starting Height", fr: "Hauteur de départ", de: "Starthöhe" },
  triangles: { en: "Triangles", fr: "Triangles", de: "Dreiecke" },
  create_spiral: { en: "Create Spiral", fr: "Créer la spirale", de: "Spirale erstellen" },
  enter_pos_vals: { en: "Enter positive values.", fr: "Entrez des valeurs positives.", de: "Geben Sie positive Werte ein." },
  export_design: { en: "Export Design", fr: "Exporter le design", de: "Design exportieren" },
  export_desc: { en: "{t('export_desc')}", fr: "Enregistrez votre configuration de grille actuelle et vos triangles.", de: "Speichern Sie Ihre aktuelle Rasterkonfiguration und Dreiecke." },
  export_svg: { en: "Export as .SVG", fr: "Exporter en .SVG", de: "Als .SVG exportieren" },
  import_design: { en: "Import Design", fr: "Importer un design", de: "Design importieren" },
  import_desc: { en: "{t('import_desc')}", fr: "Chargez un fichier .SVG pour ajouter des formes à votre graphique.", de: "Laden Sie eine .SVG-Datei, um Ihrem Diagramm Formen hinzuzufügen." },
  import_svg: { en: "Import .SVG", fr: "Importer .SVG", de: ".SVG importieren" },
  no_valid_shapes: { en: "No valid shapes found in the SVG file.", fr: "Aucune forme valide trouvée dans le fichier SVG.", de: "Keine gültigen Formen in der SVG-Datei gefunden." },
  grid_size: { en: "Grid Size", fr: "Taille de la grille", de: "Rastergröße" },
  grid_snap: { en: "Grid Snap", fr: "Accrochage à la grille", de: "Am Raster ausrichten" },
  plane_size: { en: "Plane Size", fr: "Taille du plan", de: "Plangröße" },
  color_scheme: { en: "Color Scheme", fr: "Schéma de couleurs", de: "Farbschema" },
  units_0_5: { en: "0.5 units", fr: "0.5 unités", de: "0.5 Einheiten" },
  units_1: { en: "1 unit", fr: "1 unité", de: "1 Einheit" },
  units_5: { en: "5 units", fr: "5 unités", de: "5 Einheiten" },
  units_10: { en: "10 units", fr: "10 unités", de: "10 Einheiten" },
  click_shape: { en: "Click a shape on the graph to view its details.", fr: "Cliquez sur une forme sur le graphique pour afficher ses détails.", de: "Klicken Sie auf eine Form im Diagramm, um deren Details anzuzeigen." },
  delete_all: { en: "Delete All Shapes", fr: "Supprimer toutes les formes", de: "Alle Formen löschen" },
  vertices: { en: "Vertices", fr: "Sommets", de: "Eckpunkte" },
  side_lengths: { en: "Side Lengths", fr: "Longueurs des côtés", de: "Seitenlängen" },
  measurements: { en: "Measurements", fr: "Mesures", de: "Messungen" },
  perimeter: { en: "Perimeter", fr: "Périmètre", de: "Umfang" },
  area: { en: "Area", fr: "Superficie", de: "Fläche" },
  sq_units: { en: "sq units", fr: "unités carrées", de: "Quadrateinheiten" },
  app_title: { en: "Theorem De Pythagoras", fr: "Le théorème de Pythagore", de: "Satz des Pythagoras" },
  language: { en: "Language", fr: "Langue", de: "Sprache" },
  pastel_petals: { en: "Pastel Petals", fr: "Pétales pastel", de: "Pastellblüten" },
  olive_wood: { en: "Olive Wood", fr: "Bois d'olivier", de: "Olivenholz" },
  ocean_blue: { en: "Ocean Blue", fr: "Bleu océan", de: "Ozeanblau" },
  modern_palette: { en: "Modern Palette", fr: "Palette moderne", de: "Moderne Palette" },
  watermelon_sugar: { en: "Watermelon Sugar", fr: "Sucre de pastèque", de: "Wassermelonenzucker" },
  pastel_serenity: { en: "Pastel Serenity", fr: "Sérénité pastel", de: "Pastellgelassenheit" },
  side_and_hyp: { en: "Side = {s}, Hypotenuse = {hyp}", fr: "Côté = {s}, Hypoténuse = {hyp}", de: "Seite = {s}, Hypotenuse = {hyp}" },
  spiral_created: { en: "Spiral created with {N} triangles!", fr: "Spirale créée avec {N} triangles !", de: "Spirale mit {N} Dreiecken erstellt!" },
  delete_shape: { en: "Delete {name}", fr: "Supprimer {name}", de: "{name} löschen" },
  shape_index: { en: "{name} #{index}", fr: "{name} n°{index}", de: "{name} #{index}" },
  shape_name_triangle: { en: "Triangle", fr: "Triangle", de: "Dreieck" },
  shape_name_shape: { en: "Shape", fr: "Forme", de: "Form" },
  a_b_c: { en: "a={a}, b={b}, c={c}", fr: "a={a}, b={b}, c={c}", de: "a={a}, b={b}, c={c}" },
  rotate_cw: { en: "Rotate CW", fr: "Rotation horaire", de: "Im UZS drehen" },
  rotate_ccw: { en: "Rotate CCW", fr: "Rotation antihoraire", de: "Gegen UZS drehen" },
  rotate_origin_cw: { en: "Rotate Origin CW", fr: "Rotation origine horaire", de: "Im UZS um Ursprung drehen" },
  rotate_origin_ccw: { en: "Rotate Origin CCW", fr: "Rotation origine antihoraire", de: "Gegen UZS um Ursprung drehen" },
  rotation_snap: { en: "Rotation Snap", fr: "Accrochage de rotation", de: "Rotationsraster" },
  degrees_15: { en: "15°", fr: "15°", de: "15°" },
  degrees_30: { en: "30°", fr: "30°", de: "30°" },
  degrees_45: { en: "45°", fr: "45°", de: "45°" },
  degrees_90: { en: "90°", fr: "90°", de: "90°" },
  degrees_5: { en: "5°", fr: "5°", de: "5°" },
  degrees_10: { en: "10°", fr: "10°", de: "10°" },
  degrees_1: { en: "1°", fr: "1°", de: "1°" }
};

const LanguageContext = createContext('en');

function useTranslation() {
  const lang = useContext(LanguageContext);
  return (key, params) => {
    let enText = DICT[key]?.en || key;
    if (lang === 'la') {
      let substitutedEn = enText;
      if (params) {
        for (let k in params) {
          substitutedEn = substitutedEn.replace(`{${k}}`, params[k]);
        }
      }
      return generateLorem(substitutedEn.length);
    }

    let text = DICT[key]?.[lang] || enText;
    if (params) {
      for (let k in params) {
        text = text.replace(`{${k}}`, params[k]);
      }
    }
    return text;
  };
}


/* ========================================
   Constants & Utilities
   ======================================== */
const COLORS = ['var(--aquamarine)', 'var(--turquoise)', 'var(--blue-bell)'];

function getTriangleColor(index) {
  return COLORS[index % COLORS.length];
}

// Geometry helpers
function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function polygonArea(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    let j = (i + 1) % pts.length;
    area += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
  }
  return Math.abs(area / 2);
}

function computeTriInfo(tri, offset) {
  const off = offset || { x: 0, y: 0 };
  const pts = tri.points.map(p => [+(p[0] + off.x).toFixed(4), +(p[1] + off.y).toFixed(4)]);
  const sides = [];
  for (let i = 0; i < pts.length; i++) {
    sides.push({ from: i, to: (i + 1) % pts.length, len: dist(pts[i], pts[(i + 1) % pts.length]) });
  }
  const perimeter = sides.reduce((s, e) => s + e.len, 0);
  const area = polygonArea(pts);
  return { pts, sides, perimeter, area };
}

function importSvgAsShapes(svgText, currentPlaneSize) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const shapes = [];

  const isOurSvg = doc.querySelector('.graph-axis-line') !== null;

  let cx = 0, cy = 0, scale = 1;

  if (isOurSvg) {
    const xAxis = Array.from(doc.querySelectorAll('.graph-axis-line')).find(l => l.getAttribute('y1') === l.getAttribute('y2'));
    const yAxis = Array.from(doc.querySelectorAll('.graph-axis-line')).find(l => l.getAttribute('x1') === l.getAttribute('x2'));
    if (xAxis) cy = parseFloat(xAxis.getAttribute('y1'));
    if (yAxis) cx = parseFloat(yAxis.getAttribute('x1'));

    const labels = Array.from(doc.querySelectorAll('.graph-tick-label'));
    let foundScale = false;
    for (const label of labels) {
      const text = label.textContent;
      const val = parseFloat(text);
      if (val !== 0 && !isNaN(val)) {
        const x = parseFloat(label.getAttribute('x'));
        if (!isNaN(x) && Math.abs(x - cx) > 5) {
          scale = (x - cx) / val;
          foundScale = true;
          break;
        }
      }
    }
    if (!foundScale) scale = 1;
  }

  const rawPolygons = [];

  if (isOurSvg) {
    const ourPolys = doc.querySelectorAll('.triangle-shape');
    ourPolys.forEach(p => {
      const pts = p.getAttribute('points');
      if (pts) rawPolygons.push(pts);
    });
  } else {
    const polys = doc.querySelectorAll('polygon');
    polys.forEach(p => {
      if (p.getAttribute('fill') === 'transparent' || p.getAttribute('opacity') === '0') return;
      const pts = p.getAttribute('points');
      if (pts) rawPolygons.push(pts);
    });
    const rects = doc.querySelectorAll('rect');
    rects.forEach(r => {
      const x = parseFloat(r.getAttribute('x')) || 0;
      const y = parseFloat(r.getAttribute('y')) || 0;
      const w = parseFloat(r.getAttribute('width')) || 0;
      const h = parseFloat(r.getAttribute('height')) || 0;
      if (w > 0 && h > 0) {
        rawPolygons.push(`${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`);
      }
    });
    const circles = doc.querySelectorAll('circle');
    circles.forEach(c => {
      const x = parseFloat(c.getAttribute('cx')) || 0;
      const y = parseFloat(c.getAttribute('cy')) || 0;
      const r = parseFloat(c.getAttribute('r')) || 0;
      if (r > 0) {
        let pts = '';
        const numSegments = 32;
        for (let i = 0; i < numSegments; i++) {
          const theta = (i / numSegments) * 2 * Math.PI;
          pts += `${x + r * Math.cos(theta)},${y + r * Math.sin(theta)} `;
        }
        rawPolygons.push(pts.trim());
      }
    });
    const paths = doc.querySelectorAll('path');
    paths.forEach(p => {
      const d = p.getAttribute('d');
      if (d) {
        const coords = d.match(/-?\d+(\.\d+)?/g);
        if (coords && coords.length >= 6) {
          rawPolygons.push(coords.join(' '));
        }
      }
    });
  }

  const parsedPolygons = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  rawPolygons.forEach(ptsStr => {
    const coords = ptsStr.trim().split(/[\s,]+/).map(Number);
    const points = [];
    for (let i = 0; i < coords.length; i += 2) {
      if (!isNaN(coords[i]) && !isNaN(coords[i + 1])) {
        points.push([coords[i], coords[i + 1]]);
        if (!isOurSvg) {
          minX = Math.min(minX, coords[i]);
          maxX = Math.max(maxX, coords[i]);
          minY = Math.min(minY, coords[i + 1]);
          maxY = Math.max(maxY, coords[i + 1]);
        }
      }
    }
    if (points.length >= 3) {
      parsedPolygons.push(points);
    }
  });

  if (!isOurSvg && parsedPolygons.length > 0) {
    if (minX !== Infinity) {
      cx = (minX + maxX) / 2;
      cy = (minY + maxY) / 2;
      const w = maxX - minX;
      const h = maxY - minY;
      const size = Math.max(w, h);
      if (size > 0) {
        scale = size / (currentPlaneSize * 1.5);
      } else {
        scale = 1;
      }
    }
  }

  parsedPolygons.forEach(pts => {
    const graphPts = pts.map(p => {
      let gx = (p[0] - cx) / scale;
      let gy = (cy - p[1]) / scale;
      return [gx, gy];
    });
    shapes.push({ points: graphPts, labels: [] });
  });

  return shapes;
}

/* ========================================
   Graph Component (SVG)
   ======================================== */
function GraphView({ planeSize, gridSize, gridSnap, triangles, spiralTriangles, selectedIndex, onSelectTriangle, onOffsetChange, shapeOffsets }) {
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

  // Sync local offsets with shapeOffsets
  useEffect(() => {
    if (dragIndex === null) {
      setOffsets(shapeOffsets || {});
    }
  }, [shapeOffsets, dragIndex]);

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
    <div className="graph-svg-wrapper" ref={wrapperRef} style={{ background: 'var(--azure-mist)' }}>
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
  const t = useTranslation();
  return (
    <div className="home-content">
      <p className="home-subtitle">
        {t('home_subtitle')}
      </p>
      <div className="home-formula">a² + b² = c²</div>
      <button id="cta-graph-btn" className="cta-button" onClick={onNavigate}>
        {t('open_graph')}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </button>
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">📐</div>
          <div className="feature-card-title">{t('calculate')}</div>
          <div className="feature-card-desc">{t('calc_desc')}</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🔍</div>
          <div className="feature-card-title">{t('identify')}</div>
          <div className="feature-card-desc">{t('ident_desc')}</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🌀</div>
          <div className="feature-card-title">{t('spiral')}</div>
          <div className="feature-card-desc">{t('spiral_desc')}</div>
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
  const t = useTranslation();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [msg, setMsg] = useState(null);

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);
    const filled = [!isNaN(av), !isNaN(bv), !isNaN(cv)];
    const count = filled.filter(Boolean).length;
    if (count !== 2) { setMsg({ type: 'error', text: t('fill_two_fields') }); return; }
    let ra = av, rb = bv, rc = cv;
    if (isNaN(ra)) ra = Math.sqrt(cv * cv - bv * bv);
    else if (isNaN(rb)) rb = Math.sqrt(cv * cv - av * av);
    else rc = Math.sqrt(av * av + bv * bv);
    if (isNaN(ra) || isNaN(rb) || isNaN(rc) || ra <= 0 || rb <= 0 || rc <= 0) {
      setMsg({ type: 'error', text: t('invalid_values') }); return;
    }
    setA(ra.toFixed(2)); setB(rb.toFixed(2)); setC(rc.toFixed(2));
    setMsg({ type: 'success', text: t('a_b_c', { a: ra.toFixed(2), b: rb.toFixed(2), c: rc.toFixed(2) }) });
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
    <CollapsibleSection id="calc-pythag" title={t('pythag_calc_title')}>
      <div className="input-row">
        <div className="input-group"><label>{t('height_a')}</label><input id="input-a" value={a} onChange={e => setA(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><label>{t('base_b')}</label><input id="input-b" value={b} onChange={e => setB(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><label>{t('hypotenuse_c')}</label><input id="input-c" value={c} onChange={e => setC(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-calc-pythag" className="calc-btn" onClick={calculate}>{t('calculate')}</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function TripleIdentifier({ onDraw }) {
  const t = useTranslation();
  const [v1, setV1] = useState(''); const [v2, setV2] = useState(''); const [v3, setV3] = useState('');
  const [msg, setMsg] = useState(null);

  const identify = () => {
    const a = parseInt(v1), b = parseInt(v2), c = parseInt(v3);
    if (isNaN(a) || isNaN(b) || isNaN(c)) { setMsg({ type: 'error', text: t('enter_three_ints') }); return; }
    const sorted = [a, b, c].sort((x, y) => x - y);
    const isTriple = sorted[0] * sorted[0] + sorted[1] * sorted[1] === sorted[2] * sorted[2];
    if (isTriple) {
      setMsg({ type: 'success', text: t('is_triple') });
      const ox = 0, oy = 0;
      onDraw([{ points: [[ox, oy], [ox + sorted[1], oy], [ox, oy + sorted[0]]], labels: [] }]);
    } else {
      setMsg({ type: 'error', text: t('not_triple') });
    }
  };
  return (
    <CollapsibleSection id="calc-triple" title={t('triple_title')}>
      <div className="input-row">
        <div className="input-group"><input id="input-t1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-t2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-t3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-triple" className="calc-btn" onClick={identify}>{t('identify')}</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function Calc454590({ onDraw }) {
  const t = useTranslation();
  const [val, setVal] = useState('');
  const [mode, setMode] = useState('side');
  const [msg, setMsg] = useState(null);

  const calculate = () => {
    const v = parseFloat(val);
    if (isNaN(v) || v <= 0) { setMsg({ type: 'error', text: t('enter_pos_num') }); return; }
    let s, hyp;
    if (mode === 'side') { s = v; hyp = v * Math.SQRT2; }
    else { hyp = v; s = v / Math.SQRT2; }
    setMsg({ type: 'success', text: t('side_and_hyp', { s: s.toFixed(2), hyp: hyp.toFixed(2) }) });
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
    <CollapsibleSection id="calc-4590" title={t('calc_4590_title')}>
      <div className="radio-row">
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'side'} onChange={() => setMode('side')} /> {t('side_s')}</label>
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'hyp'} onChange={() => setMode('hyp')} /> {t('hypotenuse')}</label>
      </div>
      <div className="input-group"><label>{t('one_side')}</label><input id="input-4590" value={val} onChange={e => setVal(e.target.value)} placeholder={mode === 'side' ? 's' : 's√2'} /></div>
      <button id="btn-calc-4590" className="calc-btn" onClick={calculate}>{t('calculate')}</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function RightAngleIdentifier({ onDraw }) {
  const t = useTranslation();
  const [v1, setV1] = useState(''); const [v2, setV2] = useState(''); const [v3, setV3] = useState('');
  const [msg, setMsg] = useState(null);

  const identify = () => {
    const a = parseFloat(v1), b = parseFloat(v2), c = parseFloat(v3);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) { setMsg({ type: 'error', text: t('enter_three_pos') }); return; }
    const sorted = [a, b, c].sort((x, y) => x - y);
    const eps = 0.0001;
    const isRight = Math.abs(sorted[0] * sorted[0] + sorted[1] * sorted[1] - sorted[2] * sorted[2]) < eps;
    if (isRight) {
      setMsg({ type: 'success', text: t('is_right_angle') });
      const ox = 0, oy = 0;
      onDraw([{ points: [[ox, oy], [ox + sorted[1], oy], [ox, oy + sorted[0]]], labels: [] }]);
    } else {
      setMsg({ type: 'error', text: t('not_right_angle') });
    }
  };
  return (
    <CollapsibleSection id="calc-rightangle" title={t('right_angle_title')}>
      <div className="input-row">
        <div className="input-group"><input id="input-ra1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-ra2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-ra3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-right" className="calc-btn" onClick={identify}>{t('identify')}</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

function SpiralCreator({ onDrawSpiral }) {
  const t = useTranslation();
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');
  const [count, setCount] = useState('16');
  const [msg, setMsg] = useState(null);

  const create = () => {
    const b0 = parseFloat(base), h = parseFloat(height), N = parseInt(count);
    if (isNaN(b0) || isNaN(h) || isNaN(N) || b0 <= 0 || h <= 0 || N <= 0) { setMsg({ type: 'error', text: t('enter_pos_vals') }); return; }
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
    setMsg({ type: 'success', text: t('spiral_created', { N: N }) });
    onDrawSpiral(tris);
  };
  return (
    <CollapsibleSection id="calc-spiral" title={t('spiral_title')}>
      <div className="input-row">
        <div className="input-group"><label>{t('starting_base')}</label><input id="input-spiral-base" value={base} onChange={e => setBase(e.target.value)} placeholder="b₀" /></div>
        <div className="input-group"><label>{t('starting_height')}</label><input id="input-spiral-height" value={height} onChange={e => setHeight(e.target.value)} placeholder="h" /></div>
        <div className="input-group"><label>{t('triangles')}</label><input id="input-spiral-count" value={count} onChange={e => setCount(e.target.value)} placeholder="Count" type="number" min="1" max="100" /></div>
      </div>
      <button id="btn-create-spiral" className="calc-btn" onClick={create}>{t('create_spiral')}</button>
      {msg && <div className={`result-message ${msg.type}`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}

/* ========================================
   Side Panel
   ======================================== */
function SidePanel({ activeTab, setActiveTab, planeSize, setPlaneSize, gridSize, setGridSize, gridSnap, setGridSnap, rotationSnap, setRotationSnap, theme, setTheme, onDrawTriangles, onDrawSpiral, graphActive, onExport, onImport, lang, setLang }) {
  const t = useTranslation();
  const tabs = ['Calculators', 'Tools', 'Settings'];

  return (
    <aside className="side-panel">
      <div className="panel-header"><h2>{t('calculators')}</h2></div>
      <div className="subtabs">
        {tabs.map(tab => (
          <button key={tab} className={`subtab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{t(tab.toLowerCase())}</button>
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
          <div className="tools-section">
            <h3>{t('export_design')}</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '12px' }}>
              {t('export_desc')}
            </p>
            <button id="btn-export-svg" className="calc-btn" onClick={onExport} style={{ backgroundColor: 'var(--turquoise)', color: 'var(--graphite)', borderColor: 'var(--turquoise)' }}>{t('export_svg')}</button>

            <h3 style={{ marginTop: '24px' }}>{t('import_design')}</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '12px' }}>
              {t('import_desc')}
            </p>
            <label id="btn-import-svg" className="calc-btn" style={{ backgroundColor: 'var(--pastel-petal)', color: 'var(--graphite)', borderColor: 'var(--pastel-petal-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              {t('import_svg')}<input type="file" accept=".svg" style={{ display: 'none' }} onChange={onImport} />
            </label>
          </div>
        )}
        {(activeTab === 'Settings') && (
          <div className="settings-section">
            <h3>{t('settings')}</h3>
            <div className="settings-row">
              <div className="input-group">
                <label>{t('grid_size')}</label>
                <select id="select-grid-size" value={gridSize} onChange={e => setGridSize(parseFloat(e.target.value))}>
                  <option value={0.5}>{t('units_0_5')}</option>
                  <option value={1}>{t('units_1')}</option>
                  <option value={5}>{t('units_5')}</option>
                  <option value={10}>{t('units_10')}</option>
                </select>
              </div>
              <div className="input-group">
                <label>{t('grid_snap')}</label>
                <select id="select-grid-snap" value={gridSnap} onChange={e => setGridSnap(parseFloat(e.target.value))}>
                  <option value={0.5}>{t('units_0_5')}</option>
                  <option value={1}>{t('units_1')}</option>
                </select>
              </div>
              <div className="input-group">
                <label>{t('plane_size')}</label>
                <select id="select-plane-size" value={planeSize} onChange={e => setPlaneSize(parseInt(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="settings-row" style={{ marginTop: '12px' }}>
              <div className="input-group">
                <label>{t('language')}</label>
                <select id="select-language" value={lang} onChange={e => setLang(e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="la">Latin</option>
                </select>
              </div>
              <div className="input-group">
                <label>{t('color_scheme')}</label>
                <select id="select-theme" value={theme} onChange={e => setTheme(e.target.value)}>
                  <option value="pastel-petals">{t('pastel_petals')}</option>
                  <option value="olive-wood">{t('olive_wood')}</option>
                  <option value="ocean-blue">{t('ocean_blue')}</option>
                  <option value="modern-palette">{t('modern_palette')}</option>
                  <option value="watermelon-sugar">{t('watermelon_sugar')}</option>
                  <option value="pastel-serenity">{t('pastel_serenity')}</option>
                </select>
              </div>
            </div>
            <div className="settings-row" style={{ marginTop: '12px' }}>
              <div className="input-group">
                <label>{t('rotation_snap')}</label>
                <select id="select-rotation-snap" value={rotationSnap} onChange={e => setRotationSnap(parseFloat(e.target.value))}>
                  <option value={1}>{t('degrees_1')}</option>
                  <option value={5}>{t('degrees_5')}</option>
                  <option value={10}>{t('degrees_10')}</option>
                  <option value={15}>{t('degrees_15')}</option>
                  <option value={30}>{t('degrees_30')}</option>
                  <option value={45}>{t('degrees_45')}</option>
                  <option value={90}>{t('degrees_90')}</option>
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
function TriangleInfoPanel({ triInfo, index, color, onDelete, onDeleteAll, onRotate, onRename, customName }) {
  const t = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  if (!triInfo) {
    return (
      <div className="tri-info-panel" id="tri-info-panel">
        <div className="tri-info-empty">
          <div className="tri-info-empty-icon">📐</div>
          <p>{t('click_shape')}</p>
        </div>
        <div className="tri-info-actions" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px' }}>
          <button className="calc-btn" onClick={onDeleteAll} style={{ backgroundColor: 'var(--pastel-petal)', color: 'var(--graphite)', borderColor: 'var(--pastel-petal-dark)' }}>{t('delete_all')}</button>
        </div>
      </div>
    );
  }

  const { pts, sides, perimeter, area } = triInfo;
  const fmt = v => Number.isInteger(v) ? v.toString() : v.toFixed(2);
  const shapeNameKey = pts.length === 3 ? 'shape_name_triangle' : 'shape_name_shape';
  const shapeName = t(shapeNameKey);
  const defaultTitle = t('shape_index', { name: shapeName, index: index + 1 });
  const displayTitle = customName || defaultTitle;

  const handleEditClick = () => {
    setEditName(displayTitle);
    setIsEditing(true);
  };
  
  const handleSaveName = () => {
    setIsEditing(false);
    if (onRename) onRename(index, editName);
  };

  return (
    <div className="tri-info-panel" id="tri-info-panel">
      <div className="tri-info-header">
        <span className="tri-info-swatch" style={{ background: color }}></span>
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              onBlur={handleSaveName}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); }}
              autoFocus
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--graphite)', background: 'transparent', color: 'var(--graphite)', width: '150px' }}
            />
          </div>
        ) : (
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {displayTitle}
            <svg onClick={handleEditClick} style={{ cursor: 'pointer', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </h3>
        )}
      </div>

      <div className="tri-info-section">
        <h4>{t('vertices')}</h4>
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
        <h4>{t('side_lengths')}</h4>
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
        <h4>{t('measurements')}</h4>
        <div className="tri-info-table">
          <div className="tri-info-row">
            <span className="tri-info-label">{t('perimeter')}</span>
            <span className="tri-info-value tri-info-highlight">{fmt(perimeter)}</span>
          </div>
          <div className="tri-info-row">
            <span className="tri-info-label">{t('area')}</span>
            <span className="tri-info-value tri-info-highlight">{fmt(area)} {t('sq_units')}</span>
          </div>
        </div>
        <div className="rotation-buttons">
          <button className="rotation-btn" onClick={() => onRotate && onRotate('ccw', 'centroid')} title={t('rotate_ccw')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            {t('rotate_ccw')}
          </button>
          <button className="rotation-btn" onClick={() => onRotate && onRotate('cw', 'centroid')} title={t('rotate_cw')}>
            {t('rotate_cw')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
          </button>
        </div>
        <div className="rotation-buttons" style={{ marginTop: '8px' }}>
          <button className="rotation-btn" onClick={() => onRotate && onRotate('ccw', 'origin')} title={t('rotate_origin_ccw')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            {t('rotate_origin_ccw')}
          </button>
          <button className="rotation-btn" onClick={() => onRotate && onRotate('cw', 'origin')} title={t('rotate_origin_cw')}>
            {t('rotate_origin_cw')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
          </button>
        </div>
      </div>

      <div className="tri-info-actions" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px' }}>
        <button className="calc-btn" onClick={onDelete} style={{ backgroundColor: 'var(--pastel-petal)', color: 'var(--graphite)', borderColor: 'var(--pastel-petal-dark)' }}>{t('delete_shape', { name: shapeName })}</button>
        <button className="calc-btn" onClick={onDeleteAll} style={{ backgroundColor: 'var(--pastel-petal-dark)', color: 'var(--graphite)', borderColor: 'var(--pastel-petal-dark)' }}>{t('delete_all')}</button>
      </div>
    </div>
  );
}

/* ========================================
   App Root
   ======================================== */
function MainApp({ lang, setLang }) {
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('Calculators');
  const [planeSize, setPlaneSize] = useState(50);
  const [gridSize, setGridSize] = useState(1);
  const [gridSnap, setGridSnap] = useState(1);
  const [triangles, setTriangles] = useState([]);
  const [spiralTriangles, setSpiralTriangles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [theme, setTheme] = useState('pastel-petals');
  const [rotationSnap, setRotationSnap] = useState(15);
  const t = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Drag offsets mirror — we track offsets in GraphView but also need them here for the info panel.
  // Instead, GraphView will report offset changes. We keep a lightweight copy.
  const [shapeOffsets, setShapeOffsets] = useState({});

  const handleDrawTriangles = useCallback(tris => {
    setTriangles(prev => [...prev, ...tris]);
    setSelectedIndex(null);
    if (page === 'home') setPage('graph');
  }, [page]);
  const handleDrawSpiral = useCallback(tris => {
    setSpiralTriangles(prev => [...prev, ...tris]);
    setSelectedIndex(null);
    if (page === 'home') setPage('graph');
  }, [page]);

  const handleSelectTriangle = useCallback((idx) => {
    setSelectedIndex(idx);
  }, []);

  const handleOffsetChange = useCallback((idx, offset) => {
    setShapeOffsets(prev => ({ ...prev, [idx]: offset }));
  }, []);

  const handleDeleteTriangle = useCallback(() => {
    if (selectedIndex === null) return;
    const isSpiral = selectedIndex >= triangles.length;
    if (isSpiral) {
      const spiralIdx = selectedIndex - triangles.length;
      setSpiralTriangles(prev => prev.filter((_, i) => i !== spiralIdx));
    } else {
      setTriangles(prev => prev.filter((_, i) => i !== selectedIndex));
    }

    setShapeOffsets(prev => {
      const next = {};
      Object.keys(prev).forEach(key => {
        const k = parseInt(key, 10);
        if (k < selectedIndex) next[k] = prev[k];
        else if (k > selectedIndex) next[k - 1] = prev[k];
      });
      return next;
    });

    setSelectedIndex(null);
  }, [selectedIndex, triangles.length]);

  const handleDeleteAllTriangles = useCallback(() => {
    setTriangles([]);
    setSpiralTriangles([]);
    setShapeOffsets({});
    setSelectedIndex(null);
  }, []);

  // Rotate the selected triangle around its centroid or the origin
  const handleRotateTriangle = useCallback((direction, center = 'centroid') => {
    if (selectedIndex === null) return;
    const all = [...triangles, ...spiralTriangles];
    const tri = all[selectedIndex];
    if (!tri) return;

    const offset = shapeOffsets[selectedIndex] || { x: 0, y: 0 };
    // Compute actual positions (points + drag offset)
    const actualPts = tri.points.map(p => [p[0] + offset.x, p[1] + offset.y]);

    let cx, cy;
    if (center === 'origin') {
      cx = 0;
      cy = 0;
    } else {
      // Centroid = midpoint of bounding box (as specified)
      const xs = actualPts.map(p => p[0]);
      const ys = actualPts.map(p => p[1]);
      cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    }

    const angleDeg = direction === 'cw' ? -rotationSnap : rotationSnap;
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    // Rotate each actual point around centroid
    const newActualPts = actualPts.map(p => {
      const dx = p[0] - cx;
      const dy = p[1] - cy;
      return [
        +(cx + dx * cosA - dy * sinA).toFixed(4),
        +(cy + dx * sinA + dy * cosA).toFixed(4)
      ];
    });

    // Store rotated points back as base points (subtract offset so the offset stays the same)
    const newBasePts = newActualPts.map(p => [p[0] - offset.x, p[1] - offset.y]);

    // Rotate labels too if they exist
    const newLabels = (tri.labels || []).map(lb => {
      const lx = lb.x + offset.x;
      const ly = lb.y + offset.y;
      const dx = lx - cx;
      const dy = ly - cy;
      return {
        ...lb,
        x: +(cx + dx * cosA - dy * sinA - offset.x).toFixed(4),
        y: +(cy + dx * sinA + dy * cosA - offset.y).toFixed(4)
      };
    });

    const newTri = { ...tri, points: newBasePts, labels: newLabels };

    const isSpiral = selectedIndex >= triangles.length;
    if (isSpiral) {
      const spiralIdx = selectedIndex - triangles.length;
      setSpiralTriangles(prev => prev.map((t, i) => i === spiralIdx ? newTri : t));
    } else {
      setTriangles(prev => prev.map((t, i) => i === selectedIndex ? newTri : t));
    }
  }, [selectedIndex, triangles, spiralTriangles, shapeOffsets, rotationSnap]);

  const handleRenameTriangle = useCallback((idx, newName) => {
    if (idx === null) return;
    const isSpiral = idx >= triangles.length;
    if (isSpiral) {
      const spiralIdx = idx - triangles.length;
      setSpiralTriangles(prev => prev.map((t, i) => i === spiralIdx ? { ...t, name: newName } : t));
    } else {
      setTriangles(prev => prev.map((t, i) => i === idx ? { ...t, name: newName } : t));
    }
  }, [triangles.length]);

  // Compute info for selected triangle
  const allTriangles = useMemo(() => [...triangles, ...spiralTriangles], [triangles, spiralTriangles]);

  const handleExportSvg = useCallback(() => {
    const svgEl = document.querySelector('.graph-svg-wrapper svg');
    if (!svgEl) return;

    const clonedSvg = svgEl.cloneNode(true);
    if (!clonedSvg.getAttribute('xmlns')) {
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    const svgData = clonedSvg.outerHTML;
    const svgHeader = '<?xml version="1.0" standalone="no"?>\r\n';
    const blob = new Blob([svgHeader + svgData], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "pythagorean_design.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, []);

  const handleImportSvg = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const shapes = importSvgAsShapes(text, planeSize);
      if (shapes.length > 0) {
        setTriangles(prev => [...prev, ...shapes]);
        if (page === 'home') setPage('graph');
      } else {
        alert(t('no_valid_shapes'));
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  }, [planeSize, page, t]);
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
            <h1 className="graph-title">{t('app_title')}</h1>
            <HomePage onNavigate={() => setPage('graph')} />
          </>
        ) : (
          <>
            <h1 className="graph-title">{t('app_title')}</h1>
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
                  shapeOffsets={shapeOffsets}
                />
              </div>
              <TriangleInfoPanel
                triInfo={selectedTriInfo}
                index={selectedIndex}
                color={selectedColor}
                onDelete={handleDeleteTriangle}
                onDeleteAll={handleDeleteAllTriangles}
                onRotate={handleRotateTriangle}
                onRename={handleRenameTriangle}
                customName={selectedIndex !== null && allTriangles[selectedIndex] ? allTriangles[selectedIndex].name : null}
              />
            </div>
          </>
        )}
      </div>
      <SidePanel
        activeTab={activeTab} setActiveTab={setActiveTab}
        planeSize={planeSize} setPlaneSize={setPlaneSize}
        gridSize={gridSize} setGridSize={setGridSize}
        gridSnap={gridSnap} setGridSnap={setGridSnap}
        rotationSnap={rotationSnap} setRotationSnap={setRotationSnap}
        theme={theme} setTheme={setTheme}
        onDrawTriangles={handleDrawTriangles}
        onDrawSpiral={handleDrawSpiral}
        graphActive={page === 'graph'}
        onExport={handleExportSvg}
        onImport={handleImportSvg}
        lang={lang} setLang={setLang}
      />
    </div>
  );
}



function App() {
  const [lang, setLang] = useState('en');
  return (
    <LanguageContext.Provider value={lang}>
      <MainApp lang={lang} setLang={setLang} />
    </LanguageContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
