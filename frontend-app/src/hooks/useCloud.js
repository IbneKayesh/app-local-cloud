import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { getApiBaseUrl } from "../utils/api";

const useCloud = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [currentPath, setCurrentPath] = useState(null);
  const [currentPathContents, setCurrentPathContents] = useState([]);

  const breadCrumbHome = { icon: "pi pi-home", url: "/" };
  const [breadCrumbItems, setBreadCrumbItems] = useState([]);
  const [pathCounts, setPathCounts] = useState({});

  const [diskStorageView, setDiskStorageView] = useState(false);
  const [recentContents, setRecentContents] = useState([]);

  const [renameDlg, setRenameDlg] = useState(false);
  const [renameFromData, setRenameFromData] = useState({});
  const [renameItem, setRenameItem] = useState(null);

  const [deleteDlg, setDeleteDlg] = useState(false);
  const [deleteFromData, setDeleteFromData] = useState({});

  const [newFolderDlg, setNewFolderDlg] = useState(false);
  const [newFolderFromData, setNewFolderFromData] = useState({});

  const [uploaderDlg, setUploaderDlg] = useState(false);

  const [moveDlg, setMoveDlg] = useState(false);
  const [moveFromData, setMoveFromData] = useState({});

  const [preview, setPreview] = useState(null);

  //item view mode
  const [itemViewMode, setItemViewMode] = useState("table"); // 'table', 'grid', 'grouped'
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(1); // 1 asc, -1 desc
  const [groupBy, setGroupBy] = useState("type"); // 'type', 'extension', 'date'

  //detail
  const [showDetail, setShowDetail] = useState(false);

  //recent
  const [showRecent, setShowRecent] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getApiBaseUrl().then(setBaseUrl);
  }, []);

  useEffect(() => {
    if (baseUrl) {
      fetchDrives();
    }
  }, [baseUrl]);

  const fetchDrives = async () => {
    if (!baseUrl) return;
    setLoading(true);
    setError(null);
    setDrives([]);

    try {
      const res = await fetch(`${baseUrl}/filesystem/drives`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDrives(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDriveBtnClick = (e, path) => {
    //console.log("path " + JSON.stringify(path));

    loadPath(path.path);
    setDiskStorageView(false);
  };

  const loadPath = async (path) => {
    if (!baseUrl) return;
    setLoading(true);
    setError(null);

    setCurrentPath(path);
    setCurrentPathContents([]);

    setCurrentPath(path);

    //console.log("path " + path);

    addRecentFolder(path);

    setSelectedItem(null);

    try {
      const res = await fetch(
        `${baseUrl}/filesystem/list?path=${encodeURIComponent(path)}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      //console.log("data " + JSON.stringify(data));

      setCurrentPathContents(data.items);

      // ✅ Store item count for this path
      setPathCounts((prev) => ({
        ...prev,
        [normalizePath(path)]: data.items.length,
      }));

      //update breadcrumb path
      updateBreadcrumbs(path, data.items.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizePath = (path) => {
    return path.replace(/\\\\+/g, "\\"); // Replace double or more backslashes with single
  };

  const addRecentFolder = (fullPath) => {
    const cleanPath = normalizePath(fullPath);

    setRecentContents((prev) => {
      const index = prev.findIndex(
        (item) => normalizePath(item.path) === cleanPath
      );
      let newRecent;

      if (index !== -1) {
        // If found, increment count and move to front
        newRecent = [
          {
            path: cleanPath,
            label: cleanPath.split(/\\|\//).pop() || cleanPath,
            count: prev[index].count + 1,
          },
          ...prev.slice(0, index),
          ...prev.slice(index + 1),
        ];
      } else {
        // Not found, add new with count 1
        newRecent = [
          {
            path: cleanPath,
            label: cleanPath.split(/\\|\//).pop() || cleanPath,
            count: 1,
          },
          ...prev,
        ];
      }

      if (newRecent.length > 15) newRecent.pop();
      return newRecent;
    });
  };

  const updateBreadcrumbs = (fullPath, counts) => {
    // Normalize fullPath by removing trailing backslash
    fullPath = fullPath.replace(/\\$/, "");

    const parts = fullPath.split("\\").filter(Boolean); // Split by backslash and remove empty strings
    const breadcrumbs = [];

    let accumulatedPath = parts[0]; // Start with drive letter, e.g., 'D:'
    const drivePath = accumulatedPath;
    const driveCount = pathCounts[normalizePath(drivePath + "\\")];

    breadcrumbs.push({
      label: `${accumulatedPath}  (${driveCount ? driveCount : counts})`,
      command: () => loadPath(drivePath + "\\"),
    });

    for (let i = 1; i < parts.length; i++) {
      accumulatedPath += "\\" + parts[i];
      const path = accumulatedPath;

      const count = pathCounts[normalizePath(path)];

      breadcrumbs.push({
        label: `${parts[i]} (${count ? count : counts})`,
        command: () => loadPath(path),
      });
    }
    setBreadCrumbItems(breadcrumbs);
  };

  const handleItemRowClick = (e) => {
    //console.log("path " + JSON.stringify(e.data));
    const selectedPath = `${currentPath}\\${e.data.name}`;

    if (e.data.isDirectory) {
      loadPath(selectedPath);
    }
    //  else {
    //   const url = `${baseUrl}/filesystem/download?path=${encodeURIComponent(
    //     `${currentPath}\\${e.data.name}`
    //   )}`;
    //   window.open(url, "_blank");
    // }
  };

  const handleBtnRecentBtnClick = (e) => {
    loadPath(e);
  };

  const handleBtnItemDownloadClick = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    //const selectedPath = `${currentPath}\\${rowData.name}`;
    //console.log("selectedPath " + selectedPath);

    const url = rowData.isDirectory
      ? `${baseUrl}/filesystem/download-folder?path=${encodeURIComponent(
          `${currentPath}\\${rowData.name}`
        )}`
      : `${baseUrl}/filesystem/download?path=${encodeURIComponent(
          `${currentPath}\\${rowData.name}`
        )}`;
    window.open(url, "_blank");
  };

  const handleRenameDlgClick = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    setRenameDlg(true);
    setRenameItem(rowData);
    setRenameFromData({ newName: rowData.name });
    //`${currentPath}\\${rowData.name}`
  };

  const handleRenameBtnClick = async () => {
    //console.log("test");

    if (!renameFromData.newName || renameFromData.newName === renameItem.name)
      return;

    //console.log("test1");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/filesystem/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `${currentPath}\\${renameItem.name}`,
          newName: renameFromData.newName,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setRenameDlg(false);
        loadPath(currentPath); // Refresh the current path
      } else {
        setError("Rename failed: " + data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDlgClick = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    setDeleteDlg(true);
    setDeleteFromData(rowData);
  };

  const handleDeleteBtnClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/filesystem/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `${currentPath}\\${deleteFromData.name}`,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setDeleteDlg(false);
        loadPath(currentPath); // Refresh the current path
      } else {
        setError("Rename failed: " + data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewFolderDlgClick = () => {
    setNewFolderDlg(true);
    setNewFolderFromData({});
  };

  const handleNewFolderBtnClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/filesystem/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `${currentPath}`,
          name: `${newFolderFromData.name}`,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setNewFolderDlg(false);
        loadPath(currentPath); // Refresh the current path
      } else {
        setError("Rename failed: " + data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploaderDlgClick = () => {
    setUploaderDlg(true);
  };

  const handleUploaderBtnClick = async (files) => {
    setLoading(true);
    setError(null);

    if (!files || files.length === 0) {
      setError("No file selected.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", files[0]); // assuming single file

      //console.log("Uploading file to path:", currentPath);

      const res = await fetch(
        `${baseUrl}/filesystem/upload?currentPath=${encodeURIComponent(
          currentPath
        )}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(`Upload failed: ${errorResponse.message}`);
      }

      const data = await res.json();

      if (data.success) {
        //setUploaderDlg(false);
        loadPath(currentPath); // Refresh the current path
      } else {
        setError("Upload failed: " + data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDlgClick = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    setMoveDlg(true);
    setMoveFromData(rowData);
  };

  const handleMoveBtnClick = async (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));

    //return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/filesystem/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: moveFromData.path,
          destination: `${rowData.path}/${moveFromData.name}`,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // console.log("rowData " + JSON.stringify(rowData));
      const data = await res.json();
      if (data.success) {
        setMoveDlg(false);
        loadPath(currentPath); // Refresh the current path
      } else {
        setError("Move failed: " + data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBtnSetPreviewClick = (rowData) => {
    if (!rowData?.path) {
      console.error("Invalid file path for preview:", rowData);
      setPreview(null);
      return;
    }

    const previewUrl = `${baseUrl}/filesystem/preview?path=${encodeURIComponent(
      rowData.path
    )}`;

    // ✅ Set preview with rowData + url
    setPreview({
      ...rowData,
      url: previewUrl,
    });
  };

  const handleSearchDlgClick = () => {};

  //View mode
  const viewModeItems = [
    {
      label: "Group",
      icon: "pi pi-list",
      command: () => {
        setItemViewMode("grouped");
      },
    },
    {
      label: "Grid",
      icon: "pi pi-th-large",
      command: () => {
        setItemViewMode("grid");
      },
    },
  ];

  // Filter and sort currentPathContents based on searchTerm, sortField, sortOrder
  const filteredSortedContents = useMemo(() => {
    return currentPathContents
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((item) => {
        let group = "";
        if (groupBy === "type") {
          group = item.isDirectory ? "Folders" : "Files";
        } else if (groupBy === "extension") {
          group = item.isDirectory
            ? "Folders"
            : item.name.split(".").pop()?.toUpperCase() || "No Extension";
        } else if (groupBy === "date") {
          const d = new Date(item.mtime);
          group = d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
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

        if (sortField === "isDirectory") {
          aValue = aValue ? 0 : 1;
          bValue = bValue ? 0 : 1;
        }

        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });
  }, [currentPathContents, searchTerm, sortField, sortOrder, groupBy]);

  return {
    loading,
    error,
    baseUrl,
    currentPath,
    drives,
    refetch: fetchDrives,
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
  };
};
export default useCloud;
