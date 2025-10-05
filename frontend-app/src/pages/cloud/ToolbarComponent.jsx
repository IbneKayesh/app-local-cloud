import React from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toolbar } from "primereact/toolbar";

const ToolbarComponent = ({
  diskStorageView,
  setDiskStorageView,
  handleRefreshDlgClick,
  handleUploaderDlgClick,
  handleNewFolderDlgClick,
  itemViewMode,
  setItemViewMode,
  searchTerm,
  setSearchTerm,
  handleSearchDlgClick,
  showRecent,
  setShowRecent,
  showDetail,
  setShowDetail,
  groupBy,
  setGroupBy,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setSelectedKey,
}) => {
  const startContent = (
    <React.Fragment>
      <Button
        tooltip="Show Disk"
        icon={diskStorageView ? "pi pi-server" : "pi pi-eject"}
        className="mr-2"
        size="small"
        onClick={() => setDiskStorageView(!diskStorageView)}
      />
      <Button
        tooltip="Reload"
        icon="pi pi-refresh"
        className="mr-2"
        size="small"
        onClick={(e) => {
          handleRefreshDlgClick(e);
        }}
      />
      <Button
        tooltip="Upload"
        icon="pi pi-upload"
        className="mr-2"
        size="small"
        onClick={(e) => {
          handleUploaderDlgClick(e);
        }}
      />
      <Button
        tooltip="New Folder"
        icon="pi pi-plus"
        className="mr-2"
        size="small"
        onClick={(e) => {
          handleNewFolderDlgClick(e);
        }}
      />
      <Button
        tooltip="Recent History"
        icon={showRecent ? "pi pi-history" : "pi pi-clock"}
        className="mr-2"
        size="small"
        onClick={() => setShowRecent(!showRecent)}
      />
      <Button
        tooltip="Detail"
        icon={showDetail ? "pi pi-window-maximize" : "pi pi-window-minimize"}
        className="mr-2"
        size="small"
        onClick={() => setShowDetail(!showDetail)}
      />
    </React.Fragment>
  );

  const centerContent = (
    <React.Fragment>
      <div className="p-inputgroup flex-1 mr-2">
        <InputText
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          tooltip="Advance Search"
          icon="pi pi-search"
          onClick={(e) => {
            handleSearchDlgClick(e);
          }}
        />
      </div>
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Button
        tooltip="Table View"
        icon="pi pi-table"
        className="mr-2"
        size="small"
        onClick={() => setItemViewMode("table")}
      />
      <Button
        tooltip="Table Group View"
        icon="pi pi-list"
        className="mr-2"
        size="small"
        onClick={() => setItemViewMode("grouped")}
      />

      {itemViewMode === "grouped" && (
        <Button
          label={`${
            groupBy === "type"
              ? "Type"
              : groupBy === "extension"
              ? "Ext."
              : "Date"
          }`}
          icon="pi pi-objects-column"
          severity="secondary"
          className="mr-2"
          onClick={() => {
            const nextField =
              groupBy === "type"
                ? "extension"
                : groupBy === "extension"
                ? "date"
                : "type";
            setGroupBy(nextField);
          }}
        />
      )}
      <Button
        tooltip="Grid View"
        icon="pi pi-th-large"
        className="mr-2"
        size="small"
        onClick={() => setItemViewMode("grid")}
      />
      {itemViewMode === "grid" && (
        <>
          <Button
            label={`${
              sortField === "name"
                ? "Name"
                : sortField === "size"
                ? "Size"
                : "Modified"
            }`}
            icon="pi pi-sort-alt"
            severity="secondary"
            className="mr-2"
            size="small"
            onClick={() => {
              const nextField =
                sortField === "name"
                  ? "size"
                  : sortField === "size"
                  ? "mtime"
                  : "name";
              setSortField(nextField);
              setSortOrder(1);
            }}
          />
          <Button
            icon={
              sortOrder === 1
                ? "pi pi-sort-amount-up-alt"
                : "pi pi-sort-amount-down"
            }
            severity="secondary"
            className="mr-2"
            size="small"
            onClick={() => setSortOrder(sortOrder === 1 ? -1 : 1)}
          />
        </>
      )}
      <Button
        tooltip="Settings"
        tooltipOptions={{ position: "left" }}
        icon="pi pi-cog"
        size="small"
        severity="info"
        onClick={() => setSelectedKey("2")}
      />
    </React.Fragment>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} center={centerContent} end={endContent} />
    </div>
  );
};
export default ToolbarComponent;
