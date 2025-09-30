import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputIcon } from "primereact/inputicon";
import { BreadCrumb } from "primereact/breadcrumb";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

//internal imports
import useCloud from "@/hooks/useCloud";
import { formatBytes, formatLocalDateTime } from "@/utils/sanitize";

const CloudPage = () => {
  const {
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
  } = useCloud();

  //console.log("drives " + JSON.stringify(drives));

  const name_body = (rowData) => {
    return (rowData.isDirectory ? "📁 " : "📄 ") + rowData.name;
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
        label={"Upload"}
        severity="primary"
        icon="pi pi-upload"
        style={{ margin: "0.5rem" }}
        onClick={(e) => {
          handleDriveBtnClick(e);
        }}
      />
      <Button
        label={"Create new Folder"}
        severity="primary"
        icon="pi pi-plus"
        style={{ margin: "0.5rem" }}
        onClick={(e) => {
          handleDriveBtnClick(e);
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
        <Column header="#" body={actionTemplate}></Column>
      </DataTable>

      <Dialog
        header="Rename ?"
        visible={renameDlg}
        style={{ width: "20vw" }}
        onHide={() => {
          if (!renameDlg) return;
          setRenameDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <InputText
              value={renameFromData.newName}
              onChange={(e) =>
                setRenameFromData({
                  ...renameFromData,
                  newName: e.target.value,
                })
              }
              placeholder="Enter name"
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
              onClick={handleRenameBtnClick}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Are you sure you want to delete ?"
        visible={deleteDlg}
        style={{ width: "25vw" }}
        onHide={() => {
          if (!deleteDlg) return;
          setDeleteDlg(false);
        }}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            {deleteFromData.isDirectory ? "Folder " : "File "}
            {(deleteFromData.isDirectory ? "📁 " : "📄 ") + deleteFromData.name}
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label="Done"
              severity="danger"
              icon="pi pi-check"
              style={{ marginLeft: "0.5rem" }}
              onClick={handleDeleteBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CloudPage;
