import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const UncompressComponent = ({
  loading,
  unCompressDlg,
  setUnCompressDlg,
  handleUnCompressBtnClick,
  selectedItem,
}) => {
  return (
    <>
      <Dialog
        header="Uncompress ?"
        visible={unCompressDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!unCompressDlg) return;
          setUnCompressDlg(false);
        }}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            {selectedItem?.isDirectory ? "Folder " : "File "}
            {(selectedItem?.isDirectory ? "📁 " : "📄 ") + selectedItem?.name}
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label={loading ? "Uncompressing..." : "Done"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
              disabled={loading}
              onClick={handleUnCompressBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default UncompressComponent;
