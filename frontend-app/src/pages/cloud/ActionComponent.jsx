import { Button } from "primereact/button";
import { getFileType } from "@/utils/sanitize";

const ActionComponent = ({
  selectedItem,
  handleBtnSetPreviewClick,
  handleBtnItemDownloadClick,
  handleRenameDlgClick,
  handleMoveDlgClick,
  handleCompressDlgClick,
  handleUnCompressDlgClick,
  handleDeleteBinDlgClick,
  handleDeleteDlgClick,
}) => {
  if (!selectedItem) return null;

  const fileType = getFileType(selectedItem.name);

  return (
    <div className="card flex flex-wrap justify-content-center gap-1 my-1">
      <Button
        tooltip="Quick View"
        icon="pi pi-eye"
        size="small"
        severity="help"
        disabled={fileType === "other"}
        onClick={() => handleBtnSetPreviewClick(selectedItem)}
      />
      <Button
        tooltip="Download"
        icon="pi pi-download"
        size="small"
        severity="help"
        onClick={() => handleBtnItemDownloadClick(selectedItem)}
      />
      <Button
        tooltip="Rename"
        icon="pi pi-pencil"
        size="small"
        severity="help"
        onClick={() => handleRenameDlgClick(selectedItem)}
      />
      <Button
        tooltip="Move"
        icon="pi pi-arrows-alt"
        size="small"
        severity="help"
        onClick={() => handleMoveDlgClick(selectedItem)}
      />
      <Button
        tooltip="Compress"
        icon="pi pi-folder"
        size="small"
        severity="help"
        onClick={() => handleCompressDlgClick(selectedItem)}
        disabled={!selectedItem.isDirectory}
      />
      <Button
        tooltip="Uncompress"
        icon="pi pi-folder-open"
        size="small"
        severity="help"
        onClick={() => handleUnCompressDlgClick(selectedItem)}
        disabled={fileType !== "zip"}
      />
      <Button
        tooltip="Move to Bin"
        icon="pi pi-trash"
        size="small"
        severity="help"
        onClick={() => handleDeleteBinDlgClick(selectedItem)}
      />
      <Button
        tooltip="Permanent Delete"
        icon="pi pi-trash"
        size="small"
        severity="danger"
        onClick={() => handleDeleteDlgClick(selectedItem)}
      />
    </div>
  );
};

export default ActionComponent;
