import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteComponent = ({
  deleteDlg,
  setDeleteDlg,
  deleteFromData,
  handleDeleteBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Are you sure you want to delete ?"
        visible={deleteDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!deleteDlg) return;
          setDeleteDlg(false);
        }}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            {deleteFromData.isDirectory ? "Folder " : "File "}
            {(deleteFromData.isDirectory ? "📁 " : "📄 ") + deleteFromData.name}
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label="Done"
              severity="danger"
              icon="pi pi-check"
              style={{ marginLeft: "0.5rem" }}
              onClick={handleDeleteBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default DeleteComponent;
