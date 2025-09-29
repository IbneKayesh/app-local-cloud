let currentPath = "";
const driveListEl = document.getElementById("driveList");
const fileListEl = document.getElementById("fileList");
const fileSection = document.getElementById("fileSection");
const driveSection = document.getElementById("driveSection");
const breadcrumbsEl = document.getElementById("breadcrumbs");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadSection = document.getElementById("uploadSection");
const dropArea = document.getElementById("dropArea");
const selectFilesBtn = document.getElementById("selectFilesBtn");
const uploadProgressEl = document.getElementById("uploadProgress");

// Load drives
fetch("/api/files/drives").then(res => res.json()).then(drives => {
  driveListEl.innerHTML = "";
  drives.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = d.letter + ":";
    card.onclick = () => loadPath(d.path);
    driveListEl.appendChild(card);
  });
});

// Load folder contents
function loadPath(path) {
  currentPath = path;
  updateBreadcrumbs(path);

  fetch(`/api/files/list?path=${encodeURIComponent(path)}`)
    .then(res => res.json())
    .then(data => {
      driveSection.style.display = "none";
      fileSection.style.display = "block";
      uploadSection.style.display = "block";

      fileListEl.innerHTML = "";
      data.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = item.name + (item.isDirectory ? " 📁" : "");

        if(item.isDirectory){
          // Navigate folder
          card.onclick = () => loadPath(path + "\\" + item.name);
          
          // Add download folder button
          const btn = document.createElement("button");
          btn.textContent = "⬇ Download Folder";
          btn.onclick = (e) => {
            e.stopPropagation();
            const fullPath = path + "\\" + item.name;
            window.open(`/api/files/download?path=${encodeURIComponent(fullPath)}`, "_blank");
          };
          card.appendChild(btn);
        } else {
          // File download
          card.onclick = () => {
            const fullPath = path + "\\" + item.name;
            window.open(`/api/files/download?path=${encodeURIComponent(fullPath)}`, "_blank");
          };
        }

        fileListEl.appendChild(card);
      });
    });
}

// Breadcrumbs
function updateBreadcrumbs(path) {
  const parts = path.split(/\\|\//).filter(p => p);
  let accumulated = "";
  breadcrumbsEl.innerHTML = "";
  parts.forEach((part, index) => {
    accumulated += index === 0 ? part + ":/" : "\\" + part;
    const span = document.createElement("span");
    span.textContent = part;
    span.className = "breadcrumb-link";
    span.onclick = () => loadPath(accumulated);
    breadcrumbsEl.appendChild(span);
    if(index < parts.length - 1){
      const sep = document.createElement("span");
      sep.textContent = " > ";
      breadcrumbsEl.appendChild(sep);
    }
  });
}

// Upload file
// Upload file
uploadBtn.onclick = () => {
  if (!fileInput.files[0]) return alert("Select a file");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("currentPath", currentPath);

  fetch("/api/files/upload", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      alert("Uploaded: " + data.file.originalname);
      loadPath(currentPath); // Refresh folder
    })
    .catch(err => alert("Upload failed"));
};
