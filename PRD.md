Product Requirements Document (PRD): Theorem De Pythagoras
Date: October 26, 2023
Project Type: Interactive Educational Visualization Tool

1. Introduction & Objectives
1.1 Project Overview
"Theorem De Pythagoras" is an interactive web application designed to help students visualize and calculate properties of right-angle triangles. The core innovation is connecting algebra with geometry: users input values into specific calculators and immediately see the corresponding right-angle triangles generated dynamically on a Cartesian coordinate plane.
1.2 Primary Objectives
Provide a visual feedback loop: inputs immediately generate geometric shapes.
Offer five distinct mathematical modes related to the Pythagorean Theorem ($a^2 + b^2 = c^2$).
Allow customization of the visualization (grid snapping, plane size).
Create a visually engaging experience using a modern, specific pastel color palette.

2. Target Audience
Middle school and high school geometry students.
Mathematics educators seeking a visual aid for teaching the Pythagorean Theorem.

3. Functional Requirements
The application is structured around a persistent side panel containing specialized tools that interact with a main visualization graph.
3.1 Persistent Side Panel (Left or Right)
This panel must always be visible, acting as the navigation and input hub. It must feature the background color --pastel-petal (#f4cae0ff).
3.1.1 Pythagorean Theorem Calculator
Description: Calculates the missing side of a right-angle triangle.
Inputs: Three (3) input boxes labeled (Height 'a', Base 'b', Hypotenuse 'c').
Action: When two inputs are provided and "Calculate" is clicked, the system must calculate the third value using $a^2 + b^2 = c^2$.
Visualization: The calculated triangle must be drawn on the Graphing Interface. The triangle must clearly indicate which sides correspond to 'a', 'b', and 'c'.
3.1.2 Pythagorean Triple Identifier
Description: Validates if three integers form a Pythagorean Triple (e.g., 3, 4, 5).
Inputs: Three (3) input boxes for integer values.
Action: Validates if $input1^2 + input2^2 = input3^2$.
Output: Displays a text message: "These form a Pythagorean Triple!" or "These do not form a triple."
Visualization: If valid, visualizes the corresponding triangle on the graph.
3.1.3 45°, 45°, 90° Triangle Side Calculator
Description: Specifically solves the isosceles right triangle relationship ($s, s, s\sqrt{2}$).
Inputs: One (1) input box. Users must be able to specify if they are entering the base ($s$) or the hypotenuse ($s\sqrt{2}$).
Action: Calculates the other two sides based on the property that the hypotenuse is $\sqrt{2}$ times the base.
Visualization: Visualizes the specific isosceles right triangle.
3.1.4 Right Angle Triangle Identifier
Description: Checks if any triangle with given side lengths is a right-angle triangle.
Inputs: Three (3) input boxes for any real number side lengths.
Action: Checks if the square of the longest side equals the sum of the squares of the two shorter sides (regardless of input order).
Output: Displays a text message confirming or denying the right-angle property.
Visualization: If valid, visualize the triangle on the graph.
3.1.5 Pythagorean Spiral Creator (The 'Spiral of Theodorus')
Description: Visualizes the sequential creation of right triangles where the hypotenuse of the previous triangle becomes the base of the next, always with a fixed height.
Inputs: Two (2) input boxes: Starting Base ($b_0$) and Starting Height ($h$).
Action: Recursively generates $N$ triangles. Triangle 1: Base $b_0$, Height $h$. Triangle 2: Base $c_1$ (hypotenuse of T1), Height $h$.
Visualization: Renders the spiral continuously on the Graphing Interface.
3.2 Settings (Side Panel Subtab)
Grid Snap Amount: A dropdown allowing choices of 1 unit or 0.5 unit. Affects how points are placed or visualized on the graph.
Plane Size: A dropdown defining the visible coordinate area: 25x25, 50x50, 100x100. The graph must recenter and rescale when changed.
3.3 Graphing Interface (Main Area)
This is the primary visualization canvas where shapes are rendered.
Title: Must be permanently displayed as "Theorem De Pythagoras."
Visual Style:
Plane Background: --azure-mist (#cddddd).
Grid Lines: --graphite (#2e2f2f).
Triangle Coloring (Alternating): When multiple triangles exist (e.g., in the Spiral), the system must rotate through the colors --aquamarine (#acfcd9ff), --turquoise (#55d6beff), and --blue-bell (#058ed9ff) for each new triangle generated.

4. User Interface (UI) Requirements
4.1 Layout
Persistent Layout: The application must maintain a two-column structure.
A main Visualization Area (roughly 70% width).
A persistent Side Panel (roughly 30% width) containing all controls.
Responsiveness: The layout should adapt smoothly to different screen sizes, perhaps stacking columns on mobile.
4.2 Home Page vs. Graph Page
The user starts on the Home Page.
The Home Page contains introductory text, a prominent Graph CTA button, and the persistent side panel (with functions perhaps disabled or hidden behind the CTA).
Clicking the Graph button transitions the main area into the active Graphing Interface.

5. Technical Requirements
5.1 Technology Stack
Frontend: HTML5, CSS3.
JavaScript Framework: React.
Backend: (Required for complex spiral calculation/saving user state, otherwise optional). A lightweight backend (e.g., Node.js with Express) is recommended if features like user accounts or data persistence are required.
Rendering: The graph should be rendered using SVG (via a library like D3.js or basic SVG manipulation) or HTML Canvas, integrated into the React component structure. SVG is preferred for interactivity and precision.
5.2 Performance & Interactivity
Calculations must happen instantly upon action button click.
Graph rendering must be dynamic and smooth; calculations from the side panel must immediately draw or update the visualization without page reloads.

6. Color Scheme Summary (Hex Codes)
Developers must strictly adhere to the following color definitions for all CSS declarations:
Name
Hex Code
Usage
Azure Mist
#cddddd
Graph Background
Graphite
#2e2f2f
Grid Lines, Primary Text
Pastel Petal
#f4cae0ff
Side Panel Background
Turquoise
#55d6beff
Triangle Accent Color 1
Aquamarine
#acfcd9ff
Triangle Accent Color 2
Blue Bell
#058ed9ff
Triangle Accent Color 3


