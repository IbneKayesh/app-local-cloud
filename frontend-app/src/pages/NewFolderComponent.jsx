import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const NewFolderComponent = ({
  newFolderDlg,
  setNewFolderDlg,
  newFolderFromData,
  setNewFolderFromData,
  handleNewFolderBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Create new Folder"
        visible={newFolderDlg}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!newFolderDlg) return;
          setNewFolderDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <InputText
              value={newFolderFromData.name}
              onChange={(e) =>
                setNewFolderFromData({
                  ...newFolderFromData,
                  name: e.target.value,
                })
              }
              placeholder="Enter folder name"
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
              onClick={handleNewFolderBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default NewFolderComponent;
