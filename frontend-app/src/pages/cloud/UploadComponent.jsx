import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";

//internal components

const UploadComponent = ({
  uploaderDlg,
  setUploaderDlg,
  baseUrl,
  currentPath,
}) => {
  const toast = useRef(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const onUpload = (e) => {
    const uploadedNames = e.files.map((f) => f.name).join(", ");
    const count = e.files.length;
    toast.current.show({
      severity: "success",
      summary: `Upload Complete (${count} file${count > 1 ? "s" : ""})`,
      detail: uploadedNames,
    });
    // loadPath(currentPath);
    setSelectedCount(0);
  };

  const onError = (e) => {
    toast.current.show({
      severity: "error",
      summary: "Upload Failed",
      detail: e.xhr?.response || "Error occurred",
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Upload"
        visible={uploaderDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!uploaderDlg) return;
          setUploaderDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <FileUpload
            name="files"
            url={`${baseUrl}/filesystem/uploads?currentPath=${encodeURIComponent(
              currentPath
            )}`}
            multiple={true}
            accept="*"
            maxFileSize={5000 * 1024 * 1024} // 5GB
            chooseLabel="Browse"
            uploadLabel={
              selectedCount > 0 ? `Upload (${selectedCount})` : "Upload"
            }
            cancelLabel="Cancel"
            onSelect={(e) => setSelectedCount(e.files.length)}
            onClear={() => setSelectedCount(0)}
            onUpload={onUpload}
            onError={onError}
            emptyTemplate={
              <p className="m-0">Drag and drop files here to upload.</p>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

export default UploadComponent;
