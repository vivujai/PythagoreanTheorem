const fs = require('fs');

let content = fs.readFileSync('c:/Vivaan/programming/Vibecoding/PythagoreanTheorem/app.jsx', 'utf8');

// 1. Add context and DICT
const headerReplace = `const { useState, useCallback, useMemo, useRef, useEffect, useContext, createContext } = React;

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
  export_desc: { en: "Save your current grid configuration and triangles.", fr: "Enregistrez votre configuration de grille actuelle et vos triangles.", de: "Speichern Sie Ihre aktuelle Rasterkonfiguration und Dreiecke." },
  export_svg: { en: "Export as .SVG", fr: "Exporter en .SVG", de: "Als .SVG exportieren" },
  import_design: { en: "Import Design", fr: "Importer un design", de: "Design importieren" },
  import_desc: { en: "Load a .SVG file to add shapes to your graph.", fr: "Chargez un fichier .SVG pour ajouter des formes à votre graphique.", de: "Laden Sie eine .SVG-Datei, um Ihrem Diagramm Formen hinzuzufügen." },
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
  a_b_c: { en: "a={a}, b={b}, c={c}", fr: "a={a}, b={b}, c={c}", de: "a={a}, b={b}, c={c}" }
};

const LanguageContext = createContext('en');

function useTranslation() {
  const lang = useContext(LanguageContext);
  return (key, params) => {
    let enText = DICT[key]?.en || key;
    if (lang === 'la') {
      let substitutedEn = enText;
      if (params) {
        Object.keys(params).forEach(k => {
          substitutedEn = substitutedEn.replace(\`{\${k}}\`, params[k]);
        });
      }
      return generateLorem(substitutedEn.length);
    }
    
    let text = DICT[key]?.[lang] || enText;
    if (params) {
      Object.keys(params).forEach(k => {
        text = text.replace(\`{\${k}}\`, params[k]);
      });
    }
    return text;
  };
}
`;

content = content.replace("const { useState, useCallback, useMemo, useRef, useEffect } = React;", headerReplace);

// HomePage
content = content.replace(
  /function HomePage\(\s*\{\s*onNavigate\s*\}\s*\)\s*\{([\s\S]*?)return\s*\(([\s\S]*?)\);\s*\}/,
  `function HomePage({ onNavigate }) {
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
}`
);

// PythagoreanCalc
content = content.replace(
  /function PythagoreanCalc\(\s*\{\s*onDraw\s*\}\s*\)\s*\{([\s\S]*?)\n\s*return\s*\(([\s\S]*?)\);\s*\}/,
  `function PythagoreanCalc({ onDraw }) {
  const t = useTranslation();$1
  return (
    <CollapsibleSection id="calc-pythag" title={t('pythag_calc_title')}>
      <div className="input-row">
        <div className="input-group"><label>{t('height_a')}</label><input id="input-a" value={a} onChange={e => setA(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><label>{t('base_b')}</label><input id="input-b" value={b} onChange={e => setB(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><label>{t('hypotenuse_c')}</label><input id="input-c" value={c} onChange={e => setC(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-calc-pythag" className="calc-btn" onClick={calculate}>{t('calculate')}</button>
      {msg && <div className={\`result-message \${msg.type}\`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}`
);
// Fix strings in PythagoreanCalc
content = content.replace(
  /setMsg\(\{ type: 'error', text: 'Please fill exactly two fields.' \}\);/g,
  `setMsg({ type: 'error', text: t('fill_two_fields') });`
).replace(
  /setMsg\(\{ type: 'error', text: 'Invalid values. Check inputs.' \}\);/g,
  `setMsg({ type: 'error', text: t('invalid_values') });`
).replace(
  /setMsg\(\{ type: 'success', text: \`a=\$\{ra.toFixed\(2\)\}, b=\$\{rb.toFixed\(2\)\}, c=\$\{rc.toFixed\(2\)\}\` \}\);/g,
  `setMsg({ type: 'success', text: t('a_b_c', { a: ra.toFixed(2), b: rb.toFixed(2), c: rc.toFixed(2) }) });`
);

// TripleIdentifier
content = content.replace(
  /function TripleIdentifier\(\s*\{\s*onDraw\s*\}\s*\)\s*\{([\s\S]*?)\n\s*return\s*\(([\s\S]*?)\);\s*\}/,
  `function TripleIdentifier({ onDraw }) {
  const t = useTranslation();$1
  return (
    <CollapsibleSection id="calc-triple" title={t('triple_title')}>
      <div className="input-row">
        <div className="input-group"><input id="input-t1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-t2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-t3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-triple" className="calc-btn" onClick={identify}>{t('identify')}</button>
      {msg && <div className={\`result-message \${msg.type}\`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}`
);
content = content.replace(
  /setMsg\(\{ type: 'error', text: 'Enter three integers.' \}\);/g,
  `setMsg({ type: 'error', text: t('enter_three_ints') });`
).replace(
  /setMsg\(\{ type: 'success', text: 'These form a Pythagorean Triple!' \}\);/g,
  `setMsg({ type: 'success', text: t('is_triple') });`
).replace(
  /setMsg\(\{ type: 'error', text: 'These do not form a triple.' \}\);/g,
  `setMsg({ type: 'error', text: t('not_triple') });`
);

// Calc454590
content = content.replace(
  /function Calc454590\(\s*\{\s*onDraw\s*\}\s*\)\s*\{([\s\S]*?)\n\s*return\s*\(([\s\S]*?)\);\s*\}/,
  `function Calc454590({ onDraw }) {
  const t = useTranslation();$1
  return (
    <CollapsibleSection id="calc-4590" title={t('calc_4590_title')}>
      <div className="radio-row">
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'side'} onChange={() => setMode('side')} /> {t('side_s')}</label>
        <label className="radio-option"><input type="radio" name="mode4590" checked={mode === 'hyp'} onChange={() => setMode('hyp')} /> {t('hypotenuse')}</label>
      </div>
      <div className="input-group"><label>{t('one_side')}</label><input id="input-4590" value={val} onChange={e => setVal(e.target.value)} placeholder={mode === 'side' ? 's' : 's√2'} /></div>
      <button id="btn-calc-4590" className="calc-btn" onClick={calculate}>{t('calculate')}</button>
      {msg && <div className={\`result-message \${msg.type}\`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}`
);
content = content.replace(
  /setMsg\(\{ type: 'error', text: 'Enter a positive number.' \}\);/g,
  `setMsg({ type: 'error', text: t('enter_pos_num') });`
).replace(
  /setMsg\(\{ type: 'success', text: \`Side = \$\{s.toFixed\(2\)\}, Hypotenuse = \$\{hyp.toFixed\(2\)\}\` \}\);/g,
  `setMsg({ type: 'success', text: t('side_and_hyp', { s: s.toFixed(2), hyp: hyp.toFixed(2) }) });`
);

// RightAngleIdentifier
content = content.replace(
  /function RightAngleIdentifier\(\s*\{\s*onDraw\s*\}\s*\)\s*\{([\s\S]*?)\n\s*return\s*\(([\s\S]*?)\);\s*\}/,
  `function RightAngleIdentifier({ onDraw }) {
  const t = useTranslation();$1
  return (
    <CollapsibleSection id="calc-rightangle" title={t('right_angle_title')}>
      <div className="input-row">
        <div className="input-group"><input id="input-ra1" value={v1} onChange={e => setV1(e.target.value)} placeholder="a" /></div>
        <div className="input-group"><input id="input-ra2" value={v2} onChange={e => setV2(e.target.value)} placeholder="b" /></div>
        <div className="input-group"><input id="input-ra3" value={v3} onChange={e => setV3(e.target.value)} placeholder="c" /></div>
      </div>
      <button id="btn-identify-right" className="calc-btn" onClick={identify}>{t('identify')}</button>
      {msg && <div className={\`result-message \${msg.type}\`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}`
);
content = content.replace(
  /setMsg\(\{ type: 'error', text: 'Enter three positive numbers.' \}\);/g,
  `setMsg({ type: 'error', text: t('enter_three_pos') });`
).replace(
  /setMsg\(\{ type: 'success', text: 'This IS a right-angle triangle!' \}\);/g,
  `setMsg({ type: 'success', text: t('is_right_angle') });`
).replace(
  /setMsg\(\{ type: 'error', text: 'This is NOT a right-angle triangle.' \}\);/g,
  `setMsg({ type: 'error', text: t('not_right_angle') });`
);

// SpiralCreator
content = content.replace(
  /function SpiralCreator\(\s*\{\s*onDrawSpiral\s*\}\s*\)\s*\{([\s\S]*?)\n\s*return\s*\(([\s\S]*?)\);\s*\}/,
  `function SpiralCreator({ onDrawSpiral }) {
  const t = useTranslation();$1
  return (
    <CollapsibleSection id="calc-spiral" title={t('spiral_title')}>
      <div className="input-row">
        <div className="input-group"><label>{t('starting_base')}</label><input id="input-spiral-base" value={base} onChange={e => setBase(e.target.value)} placeholder="b₀" /></div>
        <div className="input-group"><label>{t('starting_height')}</label><input id="input-spiral-height" value={height} onChange={e => setHeight(e.target.value)} placeholder="h" /></div>
        <div className="input-group"><label>{t('triangles')}</label><input id="input-spiral-count" value={count} onChange={e => setCount(e.target.value)} placeholder="Count" type="number" min="1" max="100" /></div>
      </div>
      <button id="btn-create-spiral" className="calc-btn" onClick={create}>{t('create_spiral')}</button>
      {msg && <div className={\`result-message \${msg.type}\`}>{msg.text}</div>}
    </CollapsibleSection>
  );
}`
);
content = content.replace(
  /setMsg\(\{ type: 'error', text: 'Enter positive values.' \}\);/g,
  `setMsg({ type: 'error', text: t('enter_pos_vals') });`
).replace(
  /setMsg\(\{ type: 'success', text: \`Spiral created with \$\{N\} triangles!\` \}\);/g,
  `setMsg({ type: 'success', text: t('spiral_created', { N: N }) });`
);

// SidePanel
content = content.replace(
  /function SidePanel\(\{\s*activeTab,[\s\S]*?onImport\s*\}\)\s*\{([\s\S]*?)const tabs = \['Calculators', 'Tools', 'Settings'\];/,
  `function SidePanel({ activeTab, setActiveTab, planeSize, setPlaneSize, gridSize, setGridSize, gridSnap, setGridSnap, theme, setTheme, onDrawTriangles, onDrawSpiral, graphActive, onExport, onImport, lang, setLang }) {
  const t = useTranslation();
  const tabs = ['Calculators', 'Tools', 'Settings'];`
);
// Replace subtabs in SidePanel
content = content.replace(
  /\{tabs\.map\(t => \(\s*<button key=\{t\} className=\{`subtab \$\{activeTab === t \? 'active' : ''\}`\} onClick=\{\(\) => setActiveTab\(t\)\}>\{t\}<\/button>\s*\)\)\}/,
  `{tabs.map(tab => (
          <button key={tab} className={\`subtab \${activeTab === tab ? 'active' : ''}\`} onClick={() => setActiveTab(tab)}>{t(tab.toLowerCase())}</button>
        ))}`
);

content = content.replace(
  /<div className="panel-header"><h2>Calculators<\/h2><\/div>/,
  `<div className="panel-header"><h2>{t('calculators')}</h2></div>`
);

// Tools Section
content = content.replace(
  /<h3>Export Design<\/h3>/,
  `<h3>{t('export_design')}</h3>`
).replace(
  /Save your current grid configuration and triangles\./,
  `{t('export_desc')}`
).replace(
  />\s*Export as \.SVG\s*<\/button>/,
  `>{t('export_svg')}</button>`
).replace(
  /<h3 style=\{\{ marginTop: '24px' \}\}>Import Design<\/h3>/,
  `<h3 style={{ marginTop: '24px' }}>{t('import_design')}</h3>`
).replace(
  /Load a \.SVG file to add shapes to your graph\./,
  `{t('import_desc')}`
).replace(
  /Import \.SVG\s*<input/,
  `{t('import_svg')}<input`
);

// Settings Section
content = content.replace(
  /<h3>Settings<\/h3>/,
  `<h3>{t('settings')}</h3>`
).replace(
  /<label>Grid Size<\/label>/,
  `<label>{t('grid_size')}</label>`
).replace(
  /<label>Grid Snap<\/label>/,
  `<label>{t('grid_snap')}</label>`
).replace(
  /<label>Plane Size<\/label>/,
  `<label>{t('plane_size')}</label>`
).replace(
  /<option value=\{0\.5\}>0\.5 units<\/option>/g,
  `<option value={0.5}>{t('units_0_5')}</option>`
).replace(
  /<option value=\{1\}>1 unit<\/option>/g,
  `<option value={1}>{t('units_1')}</option>`
).replace(
  /<option value=\{5\}>5 units<\/option>/g,
  `<option value={5}>{t('units_5')}</option>`
).replace(
  /<option value=\{10\}>10 units<\/option>/g,
  `<option value={10}>{t('units_10')}</option>`
).replace(
  /<label>Color Scheme<\/label>/,
  `<label>{t('color_scheme')}</label>`
).replace(
  /<option value="pastel-petals">Pastel Petals<\/option>/,
  `<option value="pastel-petals">{t('pastel_petals')}</option>`
).replace(
  /<option value="olive-wood">Olive Wood<\/option>/,
  `<option value="olive-wood">{t('olive_wood')}</option>`
).replace(
  /<option value="ocean-blue">Ocean Blue<\/option>/,
  `<option value="ocean-blue">{t('ocean_blue')}</option>`
).replace(
  /<option value="modern-palette">Modern Palette<\/option>/,
  `<option value="modern-palette">{t('modern_palette')}</option>`
).replace(
  /<option value="watermelon-sugar">Watermelon Sugar<\/option>/,
  `<option value="watermelon-sugar">{t('watermelon_sugar')}</option>`
).replace(
  /<option value="pastel-serenity">Pastel Serenity<\/option>/,
  `<option value="pastel-serenity">{t('pastel_serenity')}</option>`
);

// Add language drop-down to Settings
content = content.replace(
  /<div className="settings-row" style=\{\{ marginTop: '12px' \}\}>/,
  `<div className="settings-row" style={{ marginTop: '12px' }}>
              <div className="input-group">
                <label>{t('language')}</label>
                <select id="select-language" value={lang} onChange={e => setLang(e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="la">Latin</option>
                </select>
              </div>`
);

// TriangleInfoPanel
content = content.replace(
  /function TriangleInfoPanel\(\{\s*triInfo,\s*index,\s*color,\s*onDelete,\s*onDeleteAll\s*\}\)\s*\{/,
  `function TriangleInfoPanel({ triInfo, index, color, onDelete, onDeleteAll }) {
  const t = useTranslation();`
).replace(
  /<p>Click a shape on the graph to view its details\.<\/p>/,
  `<p>{t('click_shape')}</p>`
).replace(
  />Delete All Shapes<\/button>/g,
  `>{t('delete_all')}</button>`
).replace(
  /const shapeName = pts\.length === 3 \? 'Triangle' : 'Shape';/,
  `const shapeNameKey = pts.length === 3 ? 'shape_name_triangle' : 'shape_name_shape';
  const shapeName = t(shapeNameKey);`
).replace(
  /<h3>\{shapeName\} #\{index \+ 1\}<\/h3>/,
  `<h3>{t('shape_index', { name: shapeName, index: index + 1 })}</h3>`
).replace(
  /<h4>Vertices<\/h4>/,
  `<h4>{t('vertices')}</h4>`
).replace(
  /<h4>Side Lengths<\/h4>/,
  `<h4>{t('side_lengths')}</h4>`
).replace(
  /<h4>Measurements<\/h4>/,
  `<h4>{t('measurements')}</h4>`
).replace(
  /<span className="tri-info-label">Perimeter<\/span>/,
  `<span className="tri-info-label">{t('perimeter')}</span>`
).replace(
  /<span className="tri-info-label">Area<\/span>/,
  `<span className="tri-info-label">{t('area')}</span>`
).replace(
  /\{fmt\(area\)\} sq units/,
  `{fmt(area)} {t('sq_units')}`
).replace(
  />Delete \{shapeName\}<\/button>/,
  `>{t('delete_shape', { name: shapeName })}</button>`
);

// App -> MainApp
content = content.replace(
  /function App\(\)\s*\{/,
  `function MainApp({ lang, setLang }) {`
);
content = content.replace(
  /const \[theme, setTheme\] = useState\('pastel-petals'\);/,
  `const [theme, setTheme] = useState('pastel-petals');
  const t = useTranslation();`
);
content = content.replace(
  /alert\("No valid shapes found in the SVG file\."\);/,
  `alert(t('no_valid_shapes'));`
).replace(
  /<h1 className="graph-title">Theorem De Pythagoras<\/h1>/g,
  `<h1 className="graph-title">{t('app_title')}</h1>`
);

content = content.replace(
  /onImport=\{handleImportSvg\}\s*\/>/,
  `onImport={handleImportSvg}
        lang={lang} setLang={setLang}
      />`
);

// Add the real App wrapper
content += `
function App() {
  const [lang, setLang] = useState('en');
  return (
    <LanguageContext.Provider value={lang}>
      <MainApp lang={lang} setLang={setLang} />
    </LanguageContext.Provider>
  );
}
`;

content = content.replace(/ReactDOM\.createRoot\(document\.getElementById\('root'\)\)\.render\(<App \/>\);\s*function App\(\) \{/, `function App() {`);

content += `ReactDOM.createRoot(document.getElementById('root')).render(<App />);\n`;


fs.writeFileSync('c:/Vivaan/programming/Vibecoding/PythagoreanTheorem/app.jsx', content);
console.log("Done");
