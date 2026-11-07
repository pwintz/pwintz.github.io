// ╭───────────────────────────────────────────────────────────────╮
// │                  "?" buttons that explain settings            │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the tools; moved here from audio/ui.ts so that non-audio tools can use it too.

// Each label with a `data-help` explanation (inside the element with the class `prefix`) gets a
// "?" button after it that shows the explanation in a popup (the element "<prefix>-help-popup")
// below the button.

export function setupHelp(prefix: string): void {
  const helpPopup = document.getElementById(`${prefix}-help-popup`) as HTMLDivElement;
  let openHelp: HTMLButtonElement | null = null;

  function closeHelp(): void {
    helpPopup.hidden = true;
    openHelp?.setAttribute("aria-expanded", "false");
    openHelp = null;
  }

  function showHelp(button: HTMLButtonElement, text: string): void {
    closeHelp();
    openHelp = button;
    button.setAttribute("aria-expanded", "true");
    helpPopup.textContent = text;
    helpPopup.hidden = false;
    // Below the button, kept within the window.
    const r = button.getBoundingClientRect();
    const left = Math.min(r.left, document.documentElement.clientWidth - helpPopup.offsetWidth - 8);
    helpPopup.style.left = `${Math.max(8, left) + window.scrollX}px`;
    helpPopup.style.top  = `${r.bottom + 6 + window.scrollY}px`;
  }

  document.body.append(helpPopup); // Positioned relative to the page
  for (const label of document.querySelectorAll<HTMLElement>(`.${prefix} [data-help]`)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${prefix}-help`;
    button.textContent = "?";
    button.setAttribute("aria-label", `About ${label.textContent}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", helpPopup.id);
    button.addEventListener("click", e => {
      e.stopPropagation();
      if (openHelp === button) closeHelp();
      else showHelp(button, label.dataset.help!);
    });
    label.after(button);
  }
  document.addEventListener("click", e => { if (!helpPopup.contains(e.target as Node)) closeHelp(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !openHelp) return;
    const button = openHelp;
    closeHelp();
    button.focus();
  });
}
