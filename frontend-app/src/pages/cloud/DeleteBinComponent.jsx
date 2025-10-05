import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteBinComponent = ({
  deleteBinDlg,
  setDeleteBinDlg,
  selectedItem,
  handleDeleteBinBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Are you sure you want to move Recycle Bin ?"
        visible={deleteBinDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!deleteBinDlg) return;
          setDeleteBinDlg(false);
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
              onClick={handleDeleteBinBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default DeleteBinComponent;
