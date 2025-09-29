let currentPath = "";
let recentFolders = [];
let lastFileItems = [];
let currentSort = { field: null, ascending: true };

const driveSection = document.getElementById("driveSection");
const fileSection = document.getElementById("fileSection");
const breadcrumbsEl = document.getElementById("breadcrumbs");
const recentSection = document.getElementById("recentSection");

const driveTableBody = document.querySelector("#driveTable tbody");
const fileTableBody = document.querySelector("#fileTable tbody");

// ----------------- Helper Functions -----------------
function joinPath(base, folder) {
  base = base.replace(/[\\\/]+$/, "");
  return `${base}\\${folder}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ----------------- File Row Renderer -----------------
function renderFileRow(item, path) {
  const tr = document.createElement("tr");

  // Name
  const nameTd = document.createElement("td");
  nameTd.textContent = (item.isDirectory ? "📁 " : "📄 ") + item.name;
  nameTd.style.cursor = "pointer";
  if (item.isDirectory) {
    nameTd.onclick = () => loadPath(joinPath(path, item.name));
  } else {
    nameTd.onclick = () =>
      window.open(
        `/api/files/download?path=${encodeURIComponent(
          joinPath(path, item.name)
        )}`,
        "_blank"
      );
  }
  tr.appendChild(nameTd);

  // Size
  const sizeTd = document.createElement("td");
  sizeTd.textContent = item.isDirectory ? "-" : formatBytes(item.size);
  tr.appendChild(sizeTd);

  // Last Modified
  const dateTd = document.createElement("td");
  dateTd.textContent = item.mtime ? new Date(item.mtime).toLocaleString() : "-";
  tr.appendChild(dateTd);

  // Actions
  const actionTd = document.createElement("td");

  // Download button
  const btnDownload = document.createElement("button");
  btnDownload.textContent = "⬇ Download";
  btnDownload.onclick = (e) => {
    e.stopPropagation();
    const url = item.isDirectory
      ? `/api/files/download-folder?path=${encodeURIComponent(
          joinPath(path, item.name)
        )}`
      : `/api/files/download?path=${encodeURIComponent(
          joinPath(path, item.name)
        )}`;
    window.open(url, "_blank");
  };
  actionTd.appendChild(btnDownload);

  // Rename button
  const btnRename = document.createElement("button");
  btnRename.textContent = "✏ Rename";
  btnRename.onclick = (e) => {
    e.stopPropagation();
    const newName = prompt("Enter new name:", item.name);
    if (!newName || newName === item.name) return;
    fetch("/api/files/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: joinPath(path, item.name),
        newName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) renderFileTable(lastFileItems);
        else alert("Rename failed: " + data.message);
      })
      .catch(() => alert("Rename failed"));
  };
  actionTd.appendChild(btnRename);

  // Delete button
  const btnDelete = document.createElement("button");
  btnDelete.textContent = "🗑 Delete";
  btnDelete.onclick = (e) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    fetch("/api/files/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: joinPath(path, item.name) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) loadPath(path);
        else alert("Delete failed: " + data.message);
      })
      .catch(() => alert("Delete failed"));
  };
  actionTd.appendChild(btnDelete);

  tr.appendChild(actionTd);
  fileTableBody.appendChild(tr);
}

// ----------------- Load Drives -----------------
fetch("/api/files/drives")
  .then((res) => res.json())
  .then((drives) => {
    driveTableBody.innerHTML = "";
    drives.forEach((d) => {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.textContent = d.letter;
      td.style.cursor = "pointer";
      td.onclick = () => loadPath(d.path);
      tr.appendChild(td);
      driveTableBody.appendChild(tr);
    });
  });

// ----------------- Load Folder Contents -----------------
function loadPath(path) {
  currentPath = path;
  updateBreadcrumbs(path);
  addRecentFolder(path);

  driveSection.style.display = "none";
  fileSection.style.display = "block";

  fetch(`/api/files/list?path=${encodeURIComponent(path)}`)
    .then((res) => res.json())
    .then((data) => {
      lastFileItems = data.items;
      renderFileTable(data.items);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load folder contents");
    });
}

// ----------------- Breadcrumbs -----------------
function updateBreadcrumbs(path) {
  breadcrumbsEl.innerHTML = "";
  breadcrumbsEl.style.display = "flex";
  breadcrumbsEl.style.overflowX = "auto";
  breadcrumbsEl.style.whiteSpace = "nowrap";

  const homeSpan = document.createElement("span");
  homeSpan.textContent = "Drive";
  homeSpan.className = "breadcrumb-link";
  homeSpan.onclick = () => {
    driveSection.style.display = "block";
    fileSection.style.display = "none";
    breadcrumbsEl.innerHTML = "";
  };
  breadcrumbsEl.appendChild(homeSpan);

  if (!path) return;

  const parts = path.split(/\\|\//).filter((p) => p);
  let accumulated = parts[0];

  parts.forEach((part, index) => {
    if (index > 0) accumulated += "\\" + part;
    const breadcrumbPath = accumulated;

    const sep = document.createElement("span");
    sep.textContent = " > ";
    breadcrumbsEl.appendChild(sep);

    const span = document.createElement("span");
    span.textContent = part;
    span.className = "breadcrumb-link";
    span.onclick = () => loadPath(breadcrumbPath);
    breadcrumbsEl.appendChild(span);
  });
}

// ----------------- Recent Folders -----------------
function addRecentFolder(path) {
  recentFolders = recentFolders.filter((p) => p !== path);
  recentFolders.unshift(path);
  if (recentFolders.length > 15) recentFolders.pop();
  renderRecentFolders();
}

function renderRecentFolders() {
  if (!recentSection) return;
  recentSection.innerHTML = "";

  recentFolders.forEach((path) => {
    const btn = document.createElement("button");
    btn.textContent = path.split(/\\|\//).pop() || path;
    btn.title = path;
    btn.onclick = () => loadPath(path);
    recentSection.appendChild(btn);
  });
}

// ----------------- Sorting -----------------
document.querySelectorAll("#fileTable th[data-sort]").forEach((th) => {
  th.style.cursor = "pointer";
  th.onclick = () => {
    const field = th.getAttribute("data-sort");
    if (currentSort.field === field) currentSort.ascending = !currentSort.ascending;
    else {
      currentSort.field = field;
      currentSort.ascending = true;
    }
    renderFileTable(lastFileItems);
    updateSortIndicators();
  };
});

function renderFileTable(items) {
  let sortedItems = [...items];

  if (currentSort.field) {
    sortedItems.sort((a, b) => {
      let valA = a[currentSort.field];
      let valB = b[currentSort.field];

      if (currentSort.field === "name") {
        valA = a.isDirectory ? "0_" + valA.toLowerCase() : "1_" + valA.toLowerCase();
        valB = b.isDirectory ? "0_" + valB.toLowerCase() : "1_" + valB.toLowerCase();
      }

      if (valA < valB) return currentSort.ascending ? -1 : 1;
      if (valA > valB) return currentSort.ascending ? 1 : -1;
      return 0;
    });
  }

  fileTableBody.innerHTML = "";
  sortedItems.forEach((item) => renderFileRow(item, currentPath));
}

function updateSortIndicators() {
  document.querySelectorAll("#fileTable th[data-sort]").forEach((th) => {
    const field = th.getAttribute("data-sort");
    th.textContent = th.textContent.replace(/⬆|⬇/g, "");
    if (field === currentSort.field) th.textContent += currentSort.ascending ? " ⬆" : " ⬇";
  });
}

// ----------------- Search -----------------
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");

searchBtn.onclick = () => {
  const query = searchInput.value.trim();
  if (!query) return alert("Enter a search term!");
  if (!currentPath) return alert("Select a drive or folder first!");

  fileTableBody.innerHTML = "<tr><td colspan='4'>Searching ...</td></tr>";

  fetch(`/api/files/search?path=${encodeURIComponent(currentPath)}&query=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        lastFileItems = data.items;
        renderFileTable(data.items);
        clearSearchBtn.style.display = "inline-block";
      } else {
        alert("Search failed: " + data.message);
      }
    })
    .catch(() => alert("Error searching files"));
};

clearSearchBtn.onclick = () => {
  searchInput.value = "";
  clearSearchBtn.style.display = "none";
  loadPath(currentPath);
};

// ----------------- Modals (Create Folder & Upload) -----------------
const createFolderModal = document.getElementById("createFolderModal");
const openCreateFolderBtn = document.getElementById("openCreateFolderBtn");
const cancelCreateFolderBtn = document.getElementById("cancelCreateFolderBtn");
const confirmCreateFolderBtn = document.getElementById("confirmCreateFolderBtn");
const newFolderInput = document.getElementById("newFolderName");

openCreateFolderBtn.onclick = () => {
  createFolderModal.style.display = "flex";
  newFolderInput.value = "";
  newFolderInput.focus();
};

cancelCreateFolderBtn.onclick = () => {
  createFolderModal.style.display = "none";
};

confirmCreateFolderBtn.onclick = () => {
  const folderName = newFolderInput.value.trim();
  if (!folderName) return alert("Enter a folder name!");
  if (!currentPath) return alert("Select a drive or folder first!");

  fetch("/api/files/create-folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: currentPath, name: folderName }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadPath(currentPath);
        createFolderModal.style.display = "none";
      } else {
        alert("Failed to create folder: " + data.message);
      }
    })
    .catch(() => alert("Error creating folder"));
};

const uploadModal = document.getElementById("uploadModal");
const openUploadBtn = document.getElementById("openUploadBtn");
const cancelUploadBtn = document.getElementById("cancelUploadBtn");
const confirmUploadBtn = document.getElementById("confirmUploadBtn");
const uploadFileInput = document.getElementById("uploadFileInput");

openUploadBtn.onclick = () => {
  uploadModal.style.display = "flex";
  uploadFileInput.value = "";
};

cancelUploadBtn.onclick = () => {
  uploadModal.style.display = "none";
};

confirmUploadBtn.onclick = () => {
  const file = uploadFileInput.files[0];
  if (!file) return alert("Select a file!");
  if (!currentPath) return alert("Select a folder first!");

  const formData = new FormData();
  formData.append("file", file);

  fetch(`/api/files/upload?currentPath=${encodeURIComponent(currentPath)}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadPath(currentPath);
        uploadModal.style.display = "none";
      } else {
        alert("Upload failed: " + data.message);
      }
    })
    .catch(() => alert("Error uploading file"));
};

window.onclick = (event) => {
  if (event.target === createFolderModal) createFolderModal.style.display = "none";
  if (event.target === uploadModal) uploadModal.style.display = "none";
};
