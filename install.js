(async () => {
  const p = new URLSearchParams(window.location.search).get("p");
  const valid = ["win", "mac", "appimage", "deb"];

  if (!valid.includes(p)) {
    window.location.href = "index.html";
    return;
  }

  const section = document.getElementById("section-" + p);
  if (section) section.hidden = false;

  // Wire up the checkbox gate for this section's download button.
  const dlBtn = document.getElementById("dl-btn-" + p);
  const checkbox = section && section.querySelector(".agree-check");
  if (checkbox && dlBtn) {
    checkbox.addEventListener("change", () => {
      dlBtn.classList.toggle("disabled", !checkbox.checked);
    });
  }

  // Resolve the real download URL from the live manifest.
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/m-mils/Saguinus/main/release-notes/latest.json",
    );
    if (!res.ok) throw new Error("bad response");

    const data = await res.json();
    const v = data.version;
    const base = `https://github.com/m-mils/Saguinus/releases/download/v${v}`;
    const files = data.files || [];

    const urls = {
      win:      files.find((f) => f.platform === "win32")?.url  ?? `${base}/Saguinus-${v}.exe`,
      mac:      files.find((f) => f.platform === "darwin")?.url ?? `${base}/Saguinus-${v}.dmg`,
      appimage: files.find((f) => f.platform === "linux")?.url  ?? `${base}/Saguinus-${v}.AppImage`,
      deb:      `${base}/Saguinus-${v}.deb`,
    };

    const labels = {
      win:      `v${v} · Windows installer (.exe)`,
      mac:      `v${v} · macOS disk image (.dmg)`,
      appimage: `v${v} · Linux AppImage`,
      deb:      `v${v} · Linux .deb package`,
    };

    if (dlBtn) dlBtn.href = urls[p];

    const meta = document.getElementById("dl-meta-" + p);
    if (meta) meta.textContent = labels[p];

    // Update version numbers in Linux terminal commands.
    document.querySelectorAll(".version-num").forEach((el) => {
      el.textContent = v;
    });

    // Set a descriptive page title for the browser tab / history.
    const titles = {
      win:      "Install Saguinus on Windows",
      mac:      "Install Saguinus on macOS",
      appimage: "Install Saguinus on Linux (AppImage)",
      deb:      "Install Saguinus on Linux (.deb)",
    };
    document.title = titles[p];
  } catch {
    /* keep the fallback links to the GitHub releases page */
  }
})();
