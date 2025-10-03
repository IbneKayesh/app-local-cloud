import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dialog } from "primereact/dialog";

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
import DriveComponent from "./DriveComponent";
import ToolbarComponent from "./ToolbarComponent";

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
    diskStorageView,
    setDiskStorageView,
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
      {diskStorageView && (
        <DriveComponent
          drives={drives}
          handleDriveBtnClick={handleDriveBtnClick}
        />
      )}

      <ToolbarComponent
        diskStorageView={diskStorageView}
        setDiskStorageView={setDiskStorageView}
        handleUploaderDlgClick={handleUploaderDlgClick}
        handleNewFolderDlgClick={handleNewFolderDlgClick}
        itemViewMode={itemViewMode}
        setItemViewMode={setItemViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchDlgClick={handleSearchDlgClick}
        showRecent={showRecent}
        setShowRecent={setShowRecent}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

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
                tooltip="Quick View"
                icon="pi pi-eye"
                size="small"
                disabled={fileType === "other"}
                onClick={() => handleBtnSetPreviewClick(selectedItem)}
              />
              <Button
                tooltip="Download"
                icon="pi pi-download"
                size="small"
                onClick={() => handleBtnItemDownloadClick(selectedItem)}
              />
              <Button
                tooltip="Rename"
                icon="pi pi-pencil"
                size="small"
                onClick={() => handleRenameDlgClick(selectedItem)}
              />
              <Button
                tooltip="Move"
                icon="pi pi-arrows-alt"
                size="small"
                onClick={() => handleMoveDlgClick(selectedItem)}
              />
              <Button
                tooltip="Delete"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDeleteDlgClick(selectedItem)}
              />
            </div>
          );
        })()}

      <BreadCrumb model={breadCrumbItems} home={breadCrumbHome} />
      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <strong>Loading.... </strong>
        </div>
      ) : (
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
                setShowDetail={setShowDetail}
              />
            </div>
          )}
        </div>
      )}
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
