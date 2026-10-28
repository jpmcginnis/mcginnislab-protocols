// Shared reagent-tooltip loader for all protocol pages.
// Each reagent in HTML looks like: <span class="reagent" data-reagent="bme">BME</span>
// This script fetches /reagents.json and sets a data-tooltip attribute on each
// matching element; CSS in style.css renders the actual popup on hover/focus.

(async function loadReagents() {
  try {
    const res = await fetch("/reagents.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("reagents.json fetch failed: " + res.status);
    const reagents = await res.json();

    const nodes = document.querySelectorAll(".reagent[data-reagent]");
    nodes.forEach((el) => {
      const key = el.dataset.reagent;
      const r = reagents[key];
      if (!r) {
        el.setAttribute("data-tooltip", "Reagent not in registry: " + key);
        el.style.borderBottomColor = "#c0392b";
        return;
      }
      const lines = [
        r.name + "  (" + (r.vendor || "?") + " " + (r.catalog || "?") + ")",
        r.form ? "Form: " + r.form : null,
        r.storage ? "Storage: " + r.storage : null,
        r.location && r.location !== "TBD" ? "Location: " + r.location : null,
        r.notes ? "Notes: " + r.notes : null,
      ].filter(Boolean);
      el.setAttribute("data-tooltip", lines.join("\n"));
      el.setAttribute("tabindex", "0"); // make focusable for touch devices
    });
  } catch (e) {
    console.error("reagents.js:", e);
  }
})();
