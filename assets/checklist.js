// Shared protocol-checklist persistence.
// Any <table> with data-checklist-id="…" gets:
//   - checkbox state persisted to localStorage under that id
//   - tr.done class toggled on checked rows
//   - a #progress element updated with "N of M checked" (if present)
//   - a #reset-checklist button that clears state (if present)

(function () {
  const table = document.querySelector("table[data-checklist-id]");
  if (!table) return;
  const id = "checklist:" + table.dataset.checklistId;
  const boxes = Array.from(table.querySelectorAll('input[type="checkbox"][data-row]'));
  const progressEl = document.getElementById("progress");
  const resetBtn = document.getElementById("reset-checklist");

  const total = boxes.length;

  function load() {
    try {
      const raw = localStorage.getItem(id);
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch { return new Set(); }
  }
  function save(set) {
    try { localStorage.setItem(id, JSON.stringify([...set])); } catch {}
  }
  function updateProgress(set) {
    if (!progressEl) return;
    progressEl.textContent = set.size + " of " + total + " checked";
  }
  function applyRowStyle(box) {
    const tr = box.closest("tr");
    if (!tr) return;
    tr.classList.toggle("done", box.checked);
  }

  const state = load();
  boxes.forEach((box) => {
    const row = box.dataset.row;
    if (state.has(row)) box.checked = true;
    applyRowStyle(box);
    box.addEventListener("change", () => {
      const r = box.dataset.row;
      if (box.checked) state.add(r); else state.delete(r);
      save(state);
      applyRowStyle(box);
      updateProgress(state);
    });
  });
  updateProgress(state);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Clear all checklist marks on this page?")) return;
      state.clear();
      save(state);
      boxes.forEach((box) => { box.checked = false; applyRowStyle(box); });
      updateProgress(state);
    });
  }
})();
