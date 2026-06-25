(async () => {
  const btn = document.getElementById("download-btn");
  const meta = document.getElementById("download-meta");
  const appimageBtn = document.getElementById("download-btn-linux-appimage");
  const debBtn = document.getElementById("download-btn-linux-deb");

  // The "I agree" checkbox gates all download buttons regardless of
  // whether their real URL has resolved yet — the disabled class is
  // purely a UX nudge (no enforcement against right-click/middle-click),
  // matching how the disclaimer itself is a statement, not a hard block.
  const agreeCheckbox = document.getElementById("agree-checkbox");
  const allDownloadBtns = [btn, appimageBtn, debBtn].filter(Boolean);

  if (agreeCheckbox) {
    agreeCheckbox.addEventListener("change", () => {
      for (const el of allDownloadBtns) {
        el.classList.toggle("disabled", !agreeCheckbox.checked);
      }
    });
  }

  if (!btn) return;

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/m-mils/Saguinus/main/release-notes/latest.json",
    );
    if (!res.ok) throw new Error("bad response");

    const data = await res.json();
    const file = data.files && data.files[0];
    if (!file || !file.url) throw new Error("no file info");

    btn.href = file.url;
    if (meta) meta.textContent = `v${data.version} · Windows installer (.exe)`;

    // Linux artifacts aren't listed in latest.json (no auto-update path
    // there yet — see checkForUpdates.ts), so their URLs are built from
    // the same per-release naming convention electron-builder uses
    // (artifactName: "${productName}-${version}.${ext}") instead of
    // being read from manifest data directly.
    const releaseBase = `https://github.com/m-mils/Saguinus/releases/download/v${data.version}`;
    if (appimageBtn) {
      appimageBtn.href = `${releaseBase}/Saguinus-${data.version}.AppImage`;
    }
    if (debBtn) {
      debBtn.href = `${releaseBase}/Saguinus-${data.version}.deb`;
    }
  } catch {
    /* keep the fallback links to the GitHub releases page */
  }
})();
