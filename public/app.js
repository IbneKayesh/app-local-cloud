let currentPath = "";
const driveSection = document.getElementById("driveSection");
const fileSection = document.getElementById("fileSection");
const breadcrumbsEl = document.getElementById("breadcrumbs");

const driveTableBody = document.querySelector("#driveTable tbody");
const fileTableBody = document.querySelector("#fileTable tbody");

// ----------------- Helper Functions -----------------

function joinPath(base, folder) {
  base = base.replace(/[\\\/]+$/, ""); // remove trailing slash
  return `${base}\\${folder}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
  console.log("path", path);
  currentPath = path;
  updateBreadcrumbs(path);

  driveSection.style.display = "none";
  fileSection.style.display = "block";

  fetch(`/api/files/list?path=${encodeURIComponent(path)}`)
    .then((res) => res.json())
    .then((data) => {
      fileTableBody.innerHTML = "";
      data.items.forEach((item) => {
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
              `/api/files/download?path=${encodeURIComponent(joinPath(path, item.name))}`,
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

        // Download
        const btnDownload = document.createElement("button");
        btnDownload.textContent = item.isDirectory ? "⬇ Folder" : "⬇ File";
        btnDownload.onclick = (e) => {
          e.stopPropagation();
          window.open(
            `/api/files/download?path=${encodeURIComponent(joinPath(path, item.name))}`,
            "_blank"
          );
        };
        actionTd.appendChild(btnDownload);

        // ZIP folder
        if (item.isDirectory) {
          const btnZip = document.createElement("button");
          btnZip.textContent = "🗜 ZIP Folder";
          btnZip.onclick = (e) => {
            e.stopPropagation();
            window.open(
              `/api/files/download-folder?path=${encodeURIComponent(joinPath(path, item.name))}`,
              "_blank"
            );
          };
          actionTd.appendChild(btnZip);
        }

        // Rename
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
              if (data.success) loadPath(path);
              else alert("Rename failed: " + data.message);
            })
            .catch(() => alert("Rename failed"));
        };
        actionTd.appendChild(btnRename);

        // Delete
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
      });
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
  homeSpan.textContent = "Home";
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

// ----------------- Create Folder Modal -----------------
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

// Close modal on outside click
window.onclick = (event) => {
  if (event.target === createFolderModal) createFolderModal.style.display = "none";
};

// ----------------- Upload File Modal -----------------
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
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loadPath(currentPath);
      uploadModal.style.display = "none";
    } else {
      alert("Upload failed: " + data.message);
    }
  })
  .catch(() => alert("Error uploading file"));
};


// Close upload modal on outside click
window.onclick = (event) => {
  if (event.target === uploadModal) uploadModal.style.display = "none";
};