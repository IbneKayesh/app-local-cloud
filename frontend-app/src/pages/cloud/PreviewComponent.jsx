import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog } from "primereact/dialog";
//internal imports
import { getFileType } from "@/utils/sanitize";

const PreviewComponent = ({ preview, handleBtnSetPreviewClick }) => {
  const abortControllerRef = useRef(null);
  const [textContent, setTextContent] = useState("");

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

  if (!preview) return null;

  const type = getFileType(preview.name);

  // Optional: For text files, you might need to fetch the content asynchronously.
  // I left `textContent` undefined since you didn't provide how it's loaded.
  // You may want to pass `textContent` as a prop or fetch it inside a useEffect.

  const renderPreviewContent = () => {
    switch (type) {
      case "image":
      case "svg":
        return (
          <img
            src={preview.url}
            alt={preview.name}
            style={{ maxWidth: "100%" }}
          />
        );
      case "video":
        return (
          <video src={preview.url} controls style={{ maxWidth: "100%" }} />
        );
      case "audio":
        return <audio src={preview.url} controls />;
      case "pdf":
        return (
          <iframe
            src={preview.url}
            width="100%"
            height="500px"
            title={preview.name}
          />
        );
      case "text":
        // Assuming you have textContent loaded somehow
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
      default:
        return <p>Preview not available</p>;
    }
  };

  return (
    <Dialog
      header={preview?.name}
      visible={!!preview}
      onHide={() => handleBtnSetPreviewClick(null)}
      style={{ minWidth: "10vw" }}
    >
      {renderPreviewContent()}
    </Dialog>
  );
};

export default PreviewComponent;
