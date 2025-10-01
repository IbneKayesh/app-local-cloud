import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";


const RenameComponent = ({
  renameDlg,
  setRenameDlg,
  renameFromData,
  setRenameFromData,
  handleRenameBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Rename ?"
        visible={renameDlg}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!renameDlg) return;
          setRenameDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <InputText
              value={renameFromData.newName}
              onChange={(e) =>
                setRenameFromData({
                  ...renameFromData,
                  newName: e.target.value,
                })
              }
              placeholder="Enter name"
              className="w-full"
              autoComplete="false"
            />
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label="Done"
              severity="primary"
              icon="pi pi-check"
              style={{ marginLeft: "0.5rem" }}
              onClick={handleRenameBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default RenameComponent;
