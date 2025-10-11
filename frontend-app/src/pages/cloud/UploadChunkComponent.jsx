import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import axios from "axios";

//internal components

const UploadChunkComponent = ({
  uploaderDlg,
  setUploaderDlg,
  baseUrl,
  currentPath,
}) => {
  const toast = useRef(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSelect = (e) => {
    setSelectedFiles(e.files);
    setSelectedCount(e.files.length);
  };

  const onClear = () => {
    setSelectedFiles([]);
    setSelectedCount(0);
  };

  const uploadChunked = async (file) => {
    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    setProgress(0);

    try {
      // Init
      const initRes = await axios.post(`${baseUrl}/filesystem/chunked-upload/init`, {
        fileName: file.name,
        totalChunks,
        currentPath,
      });
      const { uploadId } = initRes.data;

      //console.log(`Upload ID: ${uploadId}`);
      // Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);
        formData.append('chunk', chunk);

        await axios.post(`${baseUrl}/filesystem/chunked-upload/chunk`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      // Complete
      await axios.post(`${baseUrl}/filesystem/chunked-upload/complete`, {
        uploadId,
        fileName: file.name,
        currentPath,
        totalChunks,
      });

      toast.current.show({
        severity: "success",
        summary: "Upload Complete",
        detail: file.name,
      });
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Upload Failed",
        detail: err.response?.data?.error || "Error occurred",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleCustomUpload = async (files) => {
    setUploading(true);
    for (const file of files) {
      await uploadChunked(file);
    }
    setUploading(false);
    setSelectedFiles([]);
    setSelectedCount(0);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Chunked Upload (large files)"
        visible={uploaderDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!uploaderDlg) return;
          setUploaderDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          {uploading && <ProgressBar value={progress} />}
          <FileUpload
            name="files"
            multiple={true}
            accept="*"
            maxFileSize={5000 * 1024 * 1024} // 5GB
            chooseLabel="Browse"
            uploadLabel={
              selectedCount > 0 ? `Upload (${selectedCount})` : "Upload"
            }
            cancelLabel="Cancel"
            customUpload={true}
            uploadHandler={(e) => handleCustomUpload(e.files)}
            onSelect={onSelect}
            onClear={onClear}
            disabled={uploading}
            emptyTemplate={
              <p className="m-0">Drag and drop files here to upload (chunked for large files).</p>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

export default UploadChunkComponent;
