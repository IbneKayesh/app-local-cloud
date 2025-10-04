import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";

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
import PreviewComponent from "./PreviewComponent";
import SearchComponent from "./SearchComponent";
import CompressComponent from "./CompressComponent";

const CloudPage = ({ setSelectedKey }) => {
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
    searchDlg,
    setSearchDlg,
    searchFromData,
    setSearchFromData,
    handleSearchDlgClick,
    handleSearchBtnClick,
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

    //compress
    compressDlg,
    setCompressDlg,
    handleCompressDlgClick,
    handleCompressBtnClick,    
    handleUnCompressDlgClick,
  } = useCloud();

  //console.log("drives " + JSON.stringify(drives));

  const name_body = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    return (rowData.isDirectory ? "📁 " : "📄 ") + rowData.name;
  };

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
        setSelectedKey={setSelectedKey}
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
                severity="help"
                disabled={fileType === "other"}
                onClick={() => handleBtnSetPreviewClick(selectedItem)}
              />
              <Button
                tooltip="Share"
                icon="pi pi-share-alt"
                size="small"
                severity="help"
                onClick={() => {
                  //need to implement
                }}
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
                onClick={() => {
                  //need to implement
                }}
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

      <PreviewComponent
        preview={preview}
        handleBtnSetPreviewClick={handleBtnSetPreviewClick}
      />

      <MoveComponent
        moveDlg={moveDlg}
        setMoveDlg={setMoveDlg}
        moveDirs={recentContents}
        handleItemRowClick={handleMoveBtnClick}
        handleMoveBtnClick={handleMoveBtnClick}
      />

      <SearchComponent
        searchDlg={searchDlg}
        setSearchDlg={setSearchDlg}
        searchFromData={searchFromData}
        setSearchFromData={setSearchFromData}
        handleSearchBtnClick={handleSearchBtnClick}
      />

      <CompressComponent
        compressDlg={compressDlg}
        setCompressDlg={setCompressDlg}
        handleCompressBtnClick={handleCompressBtnClick}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default CloudPage;
