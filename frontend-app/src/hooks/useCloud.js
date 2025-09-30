import { useEffect } from "react";
import { useState } from "react";
import path from "path";
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

  const [recentContents, setRecentContents] = useState([]);

  const [renameDlg, setRenameDlg] = useState(false);
  const [renameFromData, setRenameFromData] = useState({});
  const [renameItem, setRenameItem] = useState(null);

  const [deleteDlg, setDeleteDlg] = useState(false);
  const [deleteFromData, setDeleteFromData] = useState({});

  const [newFolderDlg, setNewFolderDlg] = useState(false);
  const [newFolderFromData, setNewFolderFromData] = useState({});

  const [uploaderDlg, setUploaderDlg] = useState(false);

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
  };

  const loadPath = async (path) => {
    if (!baseUrl) return;
    setLoading(true);
    setError(null);
    setCurrentPath(path);
    setCurrentPathContents([]);

    setCurrentPath(path);

    //console.log("path " + path);

    updateBreadcrumbs(path);
    addRecentFolder(path);

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

  const updateBreadcrumbs = (fullPath) => {
    const parts = fullPath.split("\\").filter(Boolean); // Split by backslash and remove empty strings
    const breadcrumbs = [];

    let accumulatedPath = parts[0]; // Start with drive letter, e.g., 'D:'

    const drivePath = accumulatedPath;
    breadcrumbs.push({
      label: accumulatedPath,
      command: () => loadPath(drivePath),
    });

    for (let i = 1; i < parts.length; i++) {
      accumulatedPath += "\\" + parts[i];
      const path = accumulatedPath;
      breadcrumbs.push({
        label: parts[i],
        command: () => loadPath(path),
      });
    }

    //console.log("breadcrumbs " + JSON.stringify(breadcrumbs));
    //console.log("accumulatedPath " + accumulatedPath);

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

  const onBtnItemDownloadClick = (rowData) => {
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

      console.log("Uploading file to path:", currentPath);

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
        setUploaderDlg(false);
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

  return {
    loading,
    error,
    drives,
    refetch: fetchDrives,
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
  };
};
export default useCloud;
