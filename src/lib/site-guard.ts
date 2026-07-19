// Client-side deterrents against casual inspection/capture.
// Note: nothing in a browser can truly stop a determined user; this raises friction only.

let installed = false;

export function installSiteGuard() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const blockContext = (e: MouseEvent) => {
    e.preventDefault();
  };

  const blockKeys = (e: KeyboardEvent) => {
    const key = e.key?.toLowerCase();
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      return;
    }
    // Ctrl/Cmd + Shift + I/J/C/K (devtools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(key)) {
      e.preventDefault();
      return;
    }
    // Ctrl/Cmd + U (view-source), S (save), P (print)
    if ((e.ctrlKey || e.metaKey) && ["u", "s", "p"].includes(key)) {
      e.preventDefault();
      return;
    }
  };

  const blockDrag = (e: DragEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "IMG" || t.tagName === "VIDEO")) {
      e.preventDefault();
    }
  };

  const blockCopyOnMedia = (e: ClipboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "IMG" || t.tagName === "VIDEO")) {
      e.preventDefault();
    }
  };

  window.addEventListener("contextmenu", blockContext);
  window.addEventListener("keydown", blockKeys);
  window.addEventListener("dragstart", blockDrag);
  window.addEventListener("copy", blockCopyOnMedia);
}
