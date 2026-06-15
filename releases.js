(async () => {
  const btn = document.getElementById("download-btn");
  const meta = document.getElementById("download-meta");
  const dateEl = document.getElementById("release-date");
  const notesEl = document.getElementById("release-notes");

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
