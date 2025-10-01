export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatLocalDateTime = (datetime) => {
  return datetime ? new Date(datetime).toLocaleString() : "-";
};

export const getFileType = (name) => {
  const ext = name.split('.').pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  return "other";
}
