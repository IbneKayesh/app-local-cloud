import React, { useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

export default function FileUploaderComponent({ baseUrl, currentPath }) {
  const toast = useRef(null);

  const onUpload = (e) => {
    toast.current.show({
      severity: "success",
      summary: "Upload Complete",
      detail: e.files[0].name,
    });
    //loadPath(currentPath); // refresh list
  };

  const onError = (e) => {
    toast.current.show({
      severity: "error",
      summary: "Upload Failed",
      detail: e.xhr?.response || "Error occurred",
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <FileUpload
        name="file"
        url={`${baseUrl}/filesystem/upload?currentPath=${encodeURIComponent(
          currentPath
        )}`}
        multiple={false}
        accept="*"
        maxFileSize={5000 * 1024 * 1024} // 5GB
        chooseLabel="Select File"
        uploadLabel="Upload"
        cancelLabel="Cancel"
        onUpload={onUpload}
        onError={onError}
        emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
      />
    </div>
  );
}
