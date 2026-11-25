// ╭───────────────────────────────────────────────────────────────╮
// │            Putting the cursor in a page's main text box       │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the pages whose main control is one text box (a search or filter box, or the input of a
// converter such as the LaTeX-to-Unicode tool), so that a visitor can type without clicking the box
// first. (The dictionary's main page, whose script is inline, repeats this logic.)

// Focuses `input`. With `select`, any text it already has (such as a word from the URL) is selected,
// so that typing replaces it; otherwise, the cursor goes after that text.
// Skipped on touch screens, where focusing could open the on-screen keyboard over the page, and when
// the visitor has already focused something else while the page was loading.
export function focusOnLoad(input: HTMLInputElement | HTMLTextAreaElement, { select = false } = {}): void {
  if (!matchMedia("(pointer: fine)").matches) return;
  if (document.activeElement && document.activeElement !== document.body) return;
  input.focus({ preventScroll: true });
  if (select) input.select();
  else input.setSelectionRange(input.value.length, input.value.length);
}
