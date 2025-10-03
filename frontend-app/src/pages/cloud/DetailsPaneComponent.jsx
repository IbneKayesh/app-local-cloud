import { memo } from "react";
import { Button } from "primereact/button";

const DetailsPaneComponent = ({
  selectedItem,
  size_body,
  mtime_body,
  setShowDetail,
}) => {
  const headerContent = (
    <div className="p-4 border-bottom-1 border-gray-200 bg-white">
      <div className="flex align-items-center justify-content-between">
        <div>
          <h3 className="m-0 text-lg font-semibold text-800">Details</h3>
          <p className="text-sm text-500 mt-1 mb-0">
            {selectedItem ? selectedItem.name : "Information about selected items"}
          </p>
        </div>
        <Button
          tooltip="Close"
          icon="pi pi-window-maximize"
          size="small"
          onClick={() => setShowDetail(false)}
        />
      </div>
    </div>
  );

  const bodyContent = selectedItem ? (
    <div className="text-center surface-card border-round shadow-sm p-5 w-full">
      {[
        { label: "Type", value: selectedItem.isDirectory ? "Folder" : "File" },
        { label: "Size", value: size_body(selectedItem) },
        { label: "Modified", value: mtime_body(selectedItem) },
        ...(!selectedItem.isDirectory ? [{ label: "Extension", value: selectedItem.name.split(".").pop() }] : []),
      ].map(({ label, value }) => (
        <p key={label}>
          <strong>{label}:</strong> {value}
        </p>
      ))}
    </div>
  ) : (
    <div className="text-center surface-card border-round shadow-sm p-5 w-full">
      <div className="inline-flex align-items-center justify-content-center border-circle bg-blue-100 text-blue-500 mb-3 w-4rem h-4rem">
        <i className="pi pi-info-circle text-3xl"></i>
      </div>
      <p className="text-lg font-medium text-700 mb-2">No item selected</p>
      <p className="text-sm text-500">Select a file or folder to view details</p>
    </div>
  );

  return (
    <div className="h-full flex flex-column modern-fade-in surface-card shadow-md border-left-1 border-gray-200">
      {headerContent}
      <div className="flex-1 flex align-items-center justify-content-center p-5 bg-surface-50">
        {bodyContent}
      </div>
    </div>
  );
};

export default memo(DetailsPaneComponent);
