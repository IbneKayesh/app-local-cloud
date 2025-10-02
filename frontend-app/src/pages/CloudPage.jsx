import { useState, useEffect, useRef } from "react";
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
import NewFolderComponent from "./NewFolderComponent";
import UploadComponent from "./UploadComponent";

const CloudPage = () => {
  const {
    loading,
    error,
    drives,
    baseUrl,
    currentPath,
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

    //preview
    preview,
    handleBtnSetPreviewClick,

    //search
    handleSearchDlgClick,
  } = useCloud();

  const abortControllerRef = useRef(null);

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
          {preview.textContent || "Loading..."}
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
      abortControllerRef.current = new AbortController();
      fetch(preview.url, { signal: abortControllerRef.current.signal })
        .then((res) => res.text())
        .then((text) => {
          preview.textContent = text;
          // Force re-render by updating preview state
          handleBtnSetPreviewClick({ ...preview });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            preview.textContent = "Error loading text content";
            handleBtnSetPreviewClick({ ...preview });
          }
        });
    } else {
      abortControllerRef.current = null;
    }
  }, [preview]);

  const size_body = (rowData) => {
    return rowData.isDirectory ? "-" : formatBytes(rowData.size);
  };

  const mtime_body = (rowData) => {
    return formatLocalDateTime(rowData.mtime);
  };

  const actionTemplate = (rowData) => {
    const fileType = getFileType(rowData.name);
    const menuItems = [
      ...(fileType !== "other"
        ? [
            {
              label: "Download",
              icon: "pi pi-download",
              command: () => onBtnItemDownloadClick(rowData),
            },
          ]
        : []),
      {
        label: "Rename",
        icon: "pi pi-pencil",
        command: () => handleRenameDlgClick(rowData),
      },
      {
        label: "Move",
        icon: "pi pi-arrows-alt",
        command: () => handleMoveDlgClick(rowData),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => handleDeleteDlgClick(rowData),
      },
    ];

    return (
      <SplitButton
        label=""
        icon={fileType === "other" ? "pi pi-download" : "pi pi-eye"}
        onClick={() =>
          fileType === "other"
            ? onBtnItemDownloadClick(rowData)
            : handleBtnSetPreviewClick(rowData)
        }
        model={menuItems}
        severity={fileType === "other" ? "primary" : "success"}
      />
    );
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
        label="Search"
        severity="primary"
        icon="pi pi-search"
        style={{ margin: "0.5rem" }}
        onClick={(e) => {
          handleSearchDlgClick(e);
        }}
      />
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
