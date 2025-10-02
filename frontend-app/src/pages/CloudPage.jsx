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
import FileUploaderComponent from "./FileUploaderComponent";
import MoveComponent from "./MoveComponent";
import RenameComponent from "./RenameComponent";
import DeleteComponent from "./DeleteComponent";
import NewFolderComponent from "./NewFolderComponent";
import UploadComponent from "./UploadComponent";
import TableViewComponent from "./TableViewComponent";
import GridViewComponent from "./GridViewComponent";
import TableGroupViewComponent from "./TableGroupViewComponent";
import TreeSidebarComponent from "./TreeSidebarComponent";
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
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', 'grouped'
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState(1); // 1 asc, -1 desc
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState('type'); // 'type', 'extension', 'date'
  const [showTreeSidebar, setShowTreeSidebar] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

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
        severity={fileType === "other" ? "primary" : "info"}
      />
    );
  };

  // Filter and sort currentPathContents based on searchTerm, sortField, sortOrder
  const filteredSortedContents = useMemo(() => {
    return currentPathContents
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item) => {
        let group = '';
        if (groupBy === 'type') {
          group = item.isDirectory ? 'Folders' : 'Files';
        } else if (groupBy === 'extension') {
          group = item.isDirectory ? 'Folders' : (item.name.split('.').pop()?.toUpperCase() || 'No Extension');
        } else if (groupBy === 'date') {
          const d = new Date(item.mtime);
          group = d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        return { ...item, group };
      })
      .sort((a, b) => {
        // First sort by group
        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;

        // Then by sortField
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'isDirectory') {
          aValue = aValue ? 0 : 1;
          bValue = bValue ? 0 : 1;
        }

        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });
  }, [currentPathContents, searchTerm, sortField, sortOrder, groupBy]);

  const truncateName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    const parts = name.split('.');
    const ext = parts.pop();
    const base = parts.join('.');
    if (base.length <= maxLength - ext.length - 3) return name;
    return base.slice(0, maxLength - ext.length - 3) + '...' + ext;
  };

  const treeData = useMemo(() => {
    if (breadCrumbItems.length === 0) return [];
    const root = breadCrumbItems[0];
    let current = { key: root.label, label: root.label, data: root, icon: 'pi pi-hdd', children: [], expanded: true };
    const tree = [current];
    for (let i = 1; i < breadCrumbItems.length; i++) {
      const item = breadCrumbItems[i];
      const child = { key: item.label, label: item.label, data: item, icon: 'pi pi-folder', children: [], expanded: true };
      current.children.push(child);
      current = child;
    }
    return tree;
  }, [breadCrumbItems]);


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {showTreeSidebar && <TreeSidebarComponent treeData={treeData} onNodeSelect={(key) => {

        // Find the node in treeData

        const findNode = (nodes, k) => {

          for (const node of nodes) {

            if (node.key === k) return node;

            const found = findNode(node.children, k);

            if (found) return found;

          }

          return null;

        };

        const node = findNode(treeData, key);

        if (node && node.data.path) {

          handleBtnRecentBtnClick(node.data.path);

        }

      }} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
        <Button
          label={showTreeSidebar ? "Hide Tree" : "Show Tree"}
          severity="secondary"
          icon="pi pi-bars"
          style={{ margin: "0.5rem" }}
          onClick={() => setShowTreeSidebar(!showTreeSidebar)}
        />
        <Button
          label="Table View"
          severity={viewMode === 'table' ? 'success' : 'secondary'}
          icon="pi pi-table"
          style={{ margin: "0.5rem" }}
          onClick={() => setViewMode('table')}
        />
        <Button
          label="Grid View"
          severity={viewMode === 'grid' ? 'success' : 'secondary'}
          icon="pi pi-th-large"
          style={{ margin: "0.5rem" }}
          onClick={() => setViewMode('grid')}
        />
        <Button
          label="Grouped Table"
          severity={viewMode === 'grouped' ? 'success' : 'secondary'}
          icon="pi pi-list"
          style={{ margin: "0.5rem" }}
          onClick={() => setViewMode('grouped')}
        />
        <InputText
          placeholder="Search files/folders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: "0.5rem", width: "200px" }}
          clearable
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
        {viewMode === 'table' && (
          <TableViewComponent
            filteredSortedContents={filteredSortedContents}
            handleItemRowClick={handleItemRowClick}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(e) => {
              setSortField(e.sortField);
              setSortOrder(e.sortOrder);
            }}
            name_body={name_body}
            size_body={size_body}
            mtime_body={mtime_body}
            actionTemplate={actionTemplate}
            handleSelectItem={handleSelectItem}
          />
        )}
        {viewMode === 'grid' && (
          <GridViewComponent
            filteredSortedContents={filteredSortedContents}
            handleItemRowClick={handleItemRowClick}
            size_body={size_body}
            mtime_body={mtime_body}
            actionTemplate={actionTemplate}
            truncateName={truncateName}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleSelectItem={handleSelectItem}
          />
        )}
        {viewMode === 'grouped' && (
          <TableGroupViewComponent
            filteredSortedContents={filteredSortedContents}
            handleItemRowClick={handleItemRowClick}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(e) => {
              setSortField(e.sortField);
              setSortOrder(e.sortOrder);
            }}
            name_body={name_body}
            size_body={size_body}
            mtime_body={mtime_body}
            actionTemplate={actionTemplate}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            handleSelectItem={handleSelectItem}
          />
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
      </div>
      <DetailsPaneComponent selectedItem={selectedItem} size_body={size_body} mtime_body={mtime_body} />
    </div>
  );
};

export default CloudPage;
