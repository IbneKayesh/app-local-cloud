import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputIcon } from "primereact/inputicon";
import { BreadCrumb } from "primereact/breadcrumb";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { useState } from "react";
import { Tree } from "primereact/tree";

//internal imports
import useCloud from "@/hooks/useCloud";
import {
  formatBytes,
  formatLocalDateTime,
  getFileType,
} from "@/utils/sanitize";
import FileUploaderComponent from "./FileUploaderComponent";
import MoveComponent from "./MoveComponent";
import RenameComponent from "./RenameComponent";
import DeleteComponent from "./DeleteComponent";

const CloudPage = () => {
  const {
    loading,
    error,
    drives,
    handleDriveBtnClick,
    currentPathContents,
    handleItemRowClick,
    handleBtnRecentBtnClick,
    breadCrumbHome,
    breadCrumbItems,
    recentContents,
    onBtnItemDownloadClick,
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

    //move
    handleMoveDlgClick,
    moveDlg,
    setMoveDlg,
    setMoveFromData,
    handleMoveBtnClick,
  } = useCloud();

  const [preview, setPreview] = useState(null);

  //console.log("drives " + JSON.stringify(drives));

  const name_body = (rowData) => {
    const fileType = getFileType(rowData.name);

    //console.log("fileType " + fileType);

    //console.log("rowData " + JSON.stringify(rowData));

    return (rowData.isDirectory ? "📁 " : "📄 ") + rowData.name;
  };

  const previewBody = (rowData) => (
    <Button
      icon="pi pi-eye"
      className="p-button-rounded p-button-text"
      onClick={() => setPreview(rowData)}
    />
  );

  const renderPreview = () => {
    if (!preview) return null;

    const type = getFileType(preview.name);

    if (type === "image")
      return (
        <img
          src={preview.path}
          alt={preview.name}
          style={{ maxWidth: "100%" }}
        />
      );
    if (type === "video")
      return (
        <video
          src={
            "http://192.168.0.129:8085/api/filesystem/download?path=D%3A%5C%5CSamsung%20M14%5Cvideo_20250928_161221.mp4"
          }
          controls
          style={{ maxWidth: "100%" }}
        />
      );
    if (type === "audio") return <audio src={preview.path} controls />;
    if (type === "pdf")
      return (
        <iframe
          src={preview.path}
          width="100%"
          height="500px"
          title={preview.name}
        />
      );

    return <p>Preview not available</p>;
  };

  const name_body_new = (rowData) => {
    return (
      <span>
        {rowData.isDirectory ? (
          <InputIcon className="pi pi-folder" />
        ) : (
          <InputIcon className="pi pi-file" />
        )}{" "}
        {rowData.name}
      </span>
    );
  };

  const size_body = (rowData) => {
    return rowData.isDirectory ? "-" : formatBytes(rowData.size);
  };

  const mtime_body = (rowData) => {
    return formatLocalDateTime(rowData.mtime);
  };

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Rename",
        icon: "pi pi-pencil",
        command: () => {
          handleRenameDlgClick(rowData);
        },
      },
    ]; //assign to user only master item and un assigned items

    menuItems.push({
      label: "Move",
      icon: "pi pi-arrows-alt",
      command: () => {
        handleMoveDlgClick(rowData);
      },
    });

    menuItems.push({
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        handleDeleteDlgClick(rowData);
      },
    });

    //console.log("rowData", rowData);

    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          label=""
          icon="pi pi-download"
          onClick={() => onBtnItemDownloadClick(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const onUpload = (event) => {
    console.log("Upload complete:", event.files);
  };

  return (
    <>
      {drives.map((d) => (
        <Button
          key={d.letter}
          label={d.letter}
          severity="help"
          style={{ margin: "0.5rem" }}
          onClick={(e) => {
            handleDriveBtnClick(e, d);
          }}
        />
      ))}
      <Button
        label="Upload"
        severity="primary"
        icon="pi pi-upload"
        style={{ margin: "0.5rem" }}
        onClick={(e) => {
          handleUploaderDlgClick(e);
        }}
      />
      <Button
        label="Create new Folder"
        severity="primary"
        icon="pi pi-plus"
        style={{ margin: "0.5rem" }}
        onClick={(e) => {
          handleNewFolderDlgClick(e);
        }}
      />
      <br />
      {recentContents.map((item) => (
        <Button
          key={item.path}
          label={`${item.label}`}
          title={item.path}
          onClick={() => handleBtnRecentBtnClick(item.path)}
          style={{ margin: "0.5rem" }}
          size="small"
          badge={item.count}
          severity="secondary"
        />
      ))}

      <BreadCrumb model={breadCrumbItems} home={breadCrumbHome} />
      <DataTable
        value={currentPathContents}
        tableStyle={{ minWidth: "50rem" }}
        onRowClick={(e) => {
          handleItemRowClick(e);
        }}
        size="small"
      >
        <Column field="name" header="Name" body={name_body} sortable></Column>
        <Column field="size" header="Size" body={size_body} sortable></Column>
        <Column
          field="mtime"
          header="Modified"
          body={mtime_body}
          sortable
        ></Column>
        <Column header="" body={actionTemplate}></Column>

        <Column
          body={previewBody}
          header="Preview"
          style={{ width: "100px" }}
        />
      </DataTable>

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

      <Dialog
        header="Create new Folder"
        visible={newFolderDlg}
        style={{ width: "20vw" }}
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

      <Dialog
        header="Upload"
        visible={uploaderDlg}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!uploaderDlg) return;
          setUploaderDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <FileUpload
            name="file"
            customUpload
            uploadHandler={(event) => handleUploaderBtnClick(event.files)}
            multiple={false}
            accept="*"
            maxFileSize={5000 * 1024 * 1024} // 5000 MB
            chooseLabel="Select File"
            uploadLabel="Upload"
            cancelLabel="Cancel"
            emptyTemplate={
              <p className="m-0">Drag and drop files to here to upload.</p>
            }
          />
          {/* 
            <FileUploaderComponent uploadUrl  currentPath loadPath/> */}

          {loading && "Uploading ...."}
        </div>
      </Dialog>

      <Dialog
        header={preview?.name}
        visible={!!preview}
        onHide={() => setPreview(null)}
        style={{ width: "50vw" }}
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
