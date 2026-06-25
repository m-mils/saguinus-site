(async () => {
  const btn = document.getElementById("download-btn");
  const meta = document.getElementById("download-meta");
  const dateEl = document.getElementById("release-date");
  const notesEl = document.getElementById("release-notes");
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

  let data;
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/m-mils/Saguinus/main/release-notes/latest.json",
    );
    if (!res.ok) throw new Error("bad response");

    data = await res.json();
    const file = data.files && data.files[0];
    if (!file || !file.url) throw new Error("no file info");

    if (btn) btn.href = file.url;
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
    return;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/m-mils/Saguinus/releases/tags/v${data.version}`,
    );
    if (res.ok) {
      const release = await res.json();
      if (dateEl && release.published_at) {
        const d = new Date(release.published_at);
        dateEl.textContent = `Released ${d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`;
      }
    }
  } catch {
    /* date is optional */
  }

  if (notesEl && data.notes) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/m-mils/Saguinus/main/release-notes/${data.notes}`,
      );
      if (res.ok) {
        const md = await res.text();
        notesEl.innerHTML = marked.parse(md);
      }
    } catch {
      /* leave notes section empty */
    }
  }
})();
