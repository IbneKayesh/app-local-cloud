import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";

const UploadComponent = ({
  uploaderDlg,
  setUploaderDlg,
  handleUploaderBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Upload"
        visible={uploaderDlg}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!uploaderDlg) return;
          setUploaderDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <FileUpload
            name="file"
            customUpload
            uploadHandler={(event) => handleUploaderBtnClick(event.files)}
            multiple={false}
            accept="*"
            maxFileSize={5000 * 1024 * 1024} // 5000 MB
            chooseLabel="Select File"
            uploadLabel="Upload"
            cancelLabel="Cancel"
            emptyTemplate={
              <p className="m-0">Drag and drop files to here to upload.</p>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

export default UploadComponent;
