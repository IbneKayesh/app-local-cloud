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
  };

  const handleBtnRecentBtnClick = (e) => {
    loadPath(e);
  };

  const onBtnItemDownloadClick = (rowData) => {
    console.log("rowData " + JSON.stringify(rowData));

    const selectedPath = `${currentPath}\\${rowData.name}`;

    console.log("selectedPath " + selectedPath);
  };

  return {
    drives,
    loading,
    error,
    refetch: fetchDrives,
    handleDriveBtnClick,
    currentPathContents,
    handleItemRowClick,
    handleBtnRecentBtnClick,

    breadCrumbHome,
    breadCrumbItems,
    recentContents,
    onBtnItemDownloadClick,
  };
};
export default useCloud;
