# Hanwha Aerospace - Design Guidelines

## 1. Brand Identity & Concept
**"Precision, Trust, and Dynamic Innovation"**

Based on the Hanwha Aerospace corporate identity and recruitment materials (JD eBook), the design language focuses on a clean, professional, and high-tech enterprise aesthetic. The interface prioritizes readability, data clarity, and a modern corporate feel, transitioning away from heavy dark modes to bright, editorial-style layouts.

## 2. Color Palette
*   **Primary Brand Color (Hanwha Orange):** 
    *   Hex: `#F37321` (Mapped to Tailwind `orange-500` / `orange-600`)
    *   **Usage:** Key metric highlights, primary chart lines, active states, progress bars, and call-to-action elements. Represents Hanwha's dynamic energy and innovation.
*   **Backgrounds (Clean & Bright):** 
    *   `White` (`#FFFFFF`) for content cards.
    *   `Slate-50` (`#F8FAFC`) to `Slate-100` (`#F1F5F9`) for the application background.
    *   **Usage:** Creates a clean, "editorial" feel similar to a digital eBook or modern dashboard, reducing eye strain when analyzing complex data.
*   **Text & Borders (Neutral Slate):**
    *   `Slate-900` (`#0F172A`) for primary headings and KPI values.
    *   `Slate-500` (`#64748B`) to `Slate-600` (`#475569`) for secondary text, labels, and descriptions.
    *   `Slate-200` (`#E2E8F0`) for subtle borders and structural dividers.
*   **Semantic Colors (Data & Alerts):**
    *   **Warning/Error:** `Red-500` (`#EF4444`) for bottleneck alerts and penalty indicators.
    *   **Comparison Base:** `Slate-300` (`#CBD5E1`) for baseline data (e.g., default costs vs. simulated costs).

## 3. Typography
*   **Font Family:** `Pretendard`, `Inter`, or System Sans-serif.
*   **Characteristics:** 
    *   High legibility for numerical data and complex dashboards.
    *   Tight tracking (letter-spacing) on headings for a structural, engineered look.
    *   Clear hierarchy using font weights (Bold for KPI values and headers, Medium for labels, Regular for descriptions).

## 4. UI/UX Principles
*   **Generous Whitespace:** Use ample padding (e.g., `p-5`, `p-6`) to separate distinct data points, preventing information overload.
*   **Subtle Elevation:** Rely on thin borders (`border-slate-200`) and very soft shadows (`shadow-sm`) for cards rather than heavy, distracting drop shadows.
*   **Data Visualization Clarity:** Charts should be minimal. Remove heavy grid lines, use smooth curves for area charts, and clearly contrast the "Current/Base" state (muted gray) versus the "Simulated/Target" state (brand orange).
*   **Interactive Feedback:** Input controls (sliders, toggles, dropdowns) should clearly indicate their state using the primary orange accent color, making the simulation process intuitive and engaging.

## 5. Tailwind Implementation Reference
*   **App Canvas:** `bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100`
*   **Cards:** `bg-white border border-slate-200 rounded-2xl shadow-sm`
*   **Text:** `text-slate-900` (Headers), `text-slate-500` (Subtext)
*   **Accents / Tags:** `bg-orange-50 text-orange-600 border-orange-200`
