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

  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "tif", "ico"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "mpg", "mpeg", "3gp"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a", "flac", "aac", "wma", "opus"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (ext === "svg") return "svg";
  if (["txt", "log", "md", "json", "xml", "csv", "js", "css", "py", "java", "cpp", "c", "html", "htm"].includes(ext)) return "text";
  return "other";
}
