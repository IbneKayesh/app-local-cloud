import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteComponent = ({
  deleteDlg,
  setDeleteDlg,
  selectedItem,
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
            {selectedItem?.isDirectory ? "Folder " : "File "}
            {(selectedItem?.isDirectory ? "📁 " : "📄 ") + selectedItem?.name}
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label="Done"
              severity="danger"
              icon="pi pi-check"
              onClick={handleDeleteBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default DeleteComponent;
