(async () => {
  const btn = document.getElementById("download-btn");
  const meta = document.getElementById("download-meta");
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
  } catch {
    /* keep the fallback link to the GitHub releases page */
  }
})();
