import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputIcon } from "primereact/inputicon";
import { BreadCrumb } from "primereact/breadcrumb";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Tree } from "primereact/tree";
import { Card } from "primereact/card";

//internal imports
import useCloud from "@/hooks/useCloud";
import {
  formatBytes,
  formatLocalDateTime,
  getFileType,
} from "@/utils/sanitize";
import MoveComponent from "./MoveComponent";
import RenameComponent from "./RenameComponent";
import DeleteComponent from "./DeleteComponent";
import NewFolderComponent from "./NewFolderComponent";
import UploadComponent from "./UploadComponent";
import TableViewComponent from "./TableViewComponent";
import GridViewComponent from "./GridViewComponent";
import TableGroupViewComponent from "./TableGroupViewComponent";
import DetailsPaneComponent from "./DetailsPaneComponent";

const CloudPage = () => {
  const {
    loading,
    error,
    drives,
    baseUrl,
    currentPath,
    handleDriveBtnClick,
    currentPathContents,
    filteredSortedContents,
    handleItemRowClick,
    handleBtnRecentBtnClick,
    breadCrumbHome,
    breadCrumbItems,
    recentContents,
    handleBtnItemDownloadClick,
    //rename
    handleRenameDlgClick,
    renameDlg,
    setRenameDlg,
    renameFromData,
    setRenameFromData,
    handleRenameBtnClick,

    //delete
    handleDeleteDlgClick,
    deleteDlg,
    setDeleteDlg,
    deleteFromData,
    handleDeleteBtnClick,

    //new folder
    handleNewFolderDlgClick,
    newFolderDlg,
    setNewFolderDlg,
    newFolderFromData,
    setNewFolderFromData,
    handleNewFolderBtnClick,

    //uploader
    handleUploaderDlgClick,
    uploaderDlg,
    setUploaderDlg,
    handleUploaderBtnClick,

    //selected item
    selectedItem,
    setSelectedItem,

    //move
    handleMoveDlgClick,
    moveDlg,
    setMoveDlg,
    setMoveFromData,
    handleMoveBtnClick,

    //preview
    preview,
    handleBtnSetPreviewClick,

    //search
    handleSearchDlgClick,
    searchTerm,
    setSearchTerm,

    //sort order
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    groupBy,
    setGroupBy,

    //item view mode
    itemViewMode,
    setItemViewMode,
    viewModeItems,

    //detail
    showDetail,
    setShowDetail,

    //recent
    showRecent,
    setShowRecent,
  } = useCloud();

  const abortControllerRef = useRef(null);
  const [textContent, setTextContent] = useState("");

  //console.log("drives " + JSON.stringify(drives));

  const name_body = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    return (rowData.isDirectory ? "📁 " : "📄 ") + rowData.name;
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const renderPreview = () => {
    if (!preview) return null;

    //console.log("preview" + JSON.stringify(preview))

    const type = getFileType(preview.name);

    if (type === "image")
      return (
        <img
          src={preview.url}
          alt={preview.name}
          style={{ maxWidth: "100%" }}
        />
      );
    if (type === "video")
      return <video src={preview.url} controls style={{ maxWidth: "100%" }} />;
    if (type === "audio") return <audio src={preview.url} controls />;
    if (type === "pdf")
      return (
        <iframe
          src={preview.url}
          width="100%"
          height="500px"
          title={preview.name}
        />
      );
    if (type === "svg")
      return (
        <img
          src={preview.url}
          alt={preview.name}
          style={{ maxWidth: "100%" }}
        />
      );
    if (type === "text")
      return (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: "500px",
            overflow: "auto",
            backgroundColor: "#f4f4f4",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          {textContent || "Loading..."}
        </pre>
      );

    return <p>Preview not available</p>;
  };

  useEffect(() => {
    // Abort any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (preview && getFileType(preview.name) === "text") {
      setTextContent("Loading...");
      abortControllerRef.current = new AbortController();
      fetch(preview.url, { signal: abortControllerRef.current.signal })
        .then((res) => res.text())
        .then((text) => {
          setTextContent(text);
          // Removed handleBtnSetPreviewClick call to prevent infinite re-render
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setTextContent("Error loading text content");
          }
        });
    } else {
      setTextContent("");
      abortControllerRef.current = null;
    }
  }, [preview]);

  const size_body = (rowData) => {
    return rowData.isDirectory ? "-" : formatBytes(rowData.size);
  };

  const mtime_body = (rowData) => {
    return formatLocalDateTime(rowData.mtime);
  };

  return (
    <>
      {drives.map((d) => (
        <Button
          key={d.letter}
          label={d.letter}
          severity="help"
          style={{ margin: "0.2rem" }}
          onClick={(e) => {
            handleDriveBtnClick(e, d);
          }}
        />
      ))}
      <div className="card flex flex-wrap justify-content-center gap-1 my-1">
        <Button
          label="Upload"
          icon="pi pi-upload"
          size="small"
          onClick={(e) => {
            handleUploaderDlgClick(e);
          }}
        />
        <Button
          label="Create New Folder"
          icon="pi pi-folder"
          size="small"
          onClick={(e) => {
            handleNewFolderDlgClick(e);
          }}
        />
        <SplitButton
          icon="pi pi-table"
          size="small"
          onClick={() => setItemViewMode("table")}
          model={viewModeItems}
        />

        {itemViewMode === "grouped" && (
          <Button
            label={`Group by ${
              groupBy === "type"
                ? "Type"
                : groupBy === "extension"
                ? "Extension"
                : "Date"
            }`}
            severity="secondary"
            size="small"
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

        {itemViewMode === "grid" && (
          <>
            <Button
              label={`Sort by ${
                sortField === "name"
                  ? "Name"
                  : sortField === "size"
                  ? "Size"
                  : "Modified"
              }`}
              severity="secondary"
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
              label={sortOrder === 1 ? "Asc" : "Desc"}
              severity="secondary"
              size="small"
              onClick={() => setSortOrder(sortOrder === 1 ? -1 : 1)}
            />
          </>
        )}
        <Button
          icon="pi pi-search"
          size="small"
          onClick={(e) => {
            handleSearchDlgClick(e);
          }}
        />
        <InputText
          placeholder="Search files/folders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "200px" }}
          size="small"
          clearable
        />

        <Button
          icon={showRecent ? "pi pi-history" : "pi pi-clock"}
          size="small"
          onClick={() => setShowRecent(!showRecent)}
        />

        <Button
          icon={showDetail ? "pi pi-window-maximize" : "pi pi-window-minimize"}
          size="small"
          onClick={() => setShowDetail(!showDetail)}
        />
      </div>

      {showRecent && (
        <div className="card flex flex-wrap justify-content-center gap-1 my-1">
          {recentContents.map((item) => (
            <Button
              key={item.path}
              label={`${item.label}`}
              title={item.path}
              onClick={() => handleBtnRecentBtnClick(item.path)}
              size="small"
              badge={item.count}
              severity="secondary"
            />
          ))}
        </div>
      )}

      {selectedItem &&
        (() => {
          const fileType = getFileType(selectedItem.name);

          return (
            <div className="card flex flex-wrap justify-content-center gap-1 my-1">
              <Button
                label="View"
                icon="pi pi-eye"
                size="small"
                disabled={fileType === "other"}
                onClick={() => handleBtnSetPreviewClick(selectedItem)}
              />
              <Button
                label="Download"
                icon="pi pi-download"
                size="small"
                onClick={() => handleBtnItemDownloadClick(selectedItem)}
              />
              <Button
                label="Rename"
                icon="pi pi-pencil"
                size="small"
                onClick={() => handleRenameDlgClick(selectedItem)}
              />
              <Button
                label="Move"
                icon="pi pi-arrows-alt"
                size="small"
                onClick={() => handleMoveDlgClick(selectedItem)}
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDeleteDlgClick(selectedItem)}
              />
            </div>
          );
        })()}

      <BreadCrumb model={breadCrumbItems} home={breadCrumbHome} />
      <div className="grid">
        <div className={showDetail ? "col-8" : "col-12"}>
          {itemViewMode === "table" && (
            <TableViewComponent
              filteredSortedContents={filteredSortedContents}
              handleItemRowClick={handleItemRowClick}
              name_body={name_body}
              size_body={size_body}
              mtime_body={mtime_body}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          )}

          {itemViewMode === "grouped" && (
            <TableGroupViewComponent
              filteredSortedContents={filteredSortedContents}
              handleItemRowClick={handleItemRowClick}
              name_body={name_body}
              size_body={size_body}
              mtime_body={mtime_body}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          )}

          {itemViewMode === "grid" && (
            <GridViewComponent
              filteredSortedContents={filteredSortedContents}
              handleItemRowClick={handleItemRowClick}
              size_body={size_body}
              mtime_body={mtime_body}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          )}
        </div>

        {showDetail && (
          <div className="col-4">
            <DetailsPaneComponent
              selectedItem={selectedItem}
              size_body={size_body}
              mtime_body={mtime_body}
            />
          </div>
        )}
      </div>

      <RenameComponent
        renameDlg={renameDlg}
        setRenameDlg={setRenameDlg}
        renameFromData={renameFromData}
        setRenameFromData={setRenameFromData}
        handleRenameBtnClick={handleRenameBtnClick}
      />

      <DeleteComponent
        deleteDlg={deleteDlg}
        setDeleteDlg={setDeleteDlg}
        deleteFromData={deleteFromData}
        handleDeleteBtnClick={handleDeleteBtnClick}
      />

      <NewFolderComponent
        newFolderDlg={newFolderDlg}
        setNewFolderDlg={setNewFolderDlg}
        newFolderFromData={newFolderFromData}
        setNewFolderFromData={setNewFolderFromData}
        handleNewFolderBtnClick={handleNewFolderBtnClick}
      />

      <UploadComponent
        uploaderDlg={uploaderDlg}
        setUploaderDlg={setUploaderDlg}
        baseUrl={baseUrl}
        currentPath={currentPath}
      />

      <Dialog
        header={preview?.name}
        visible={!!preview}
        onHide={() => handleBtnSetPreviewClick(null)}
        style={{ minWidth: "10vw" }}
      >
        {renderPreview()}
      </Dialog>

      <MoveComponent
        moveDlg={moveDlg}
        setMoveDlg={setMoveDlg}
        moveDirs={recentContents}
        handleItemRowClick={handleMoveBtnClick}
        handleMoveBtnClick={handleMoveBtnClick}
      />
    </>
  );
};

export default CloudPage;
