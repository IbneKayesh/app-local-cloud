import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const CompressComponent = ({
  compressDlg,
  setCompressDlg,
  handleCompressBtnClick,
  selectedItem,
}) => {
  return (
    <>
      <Dialog
        header="Compress ?"
        visible={compressDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!compressDlg) return;
          setCompressDlg(false);
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
              icon="pi pi-check"
              style={{ marginLeft: "0.5rem" }}
              onClick={handleCompressBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default CompressComponent;
