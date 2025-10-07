import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";

const GalaryViewComponent = ({
  filteredSortedContents,
  baseUrl,
  setItemViewMode,
}) => {
  const responsiveOptions = [
    { breakpoint: "1024px", numVisible: 5 },
    { breakpoint: "960px", numVisible: 4 },
    { breakpoint: "768px", numVisible: 3 },
    { breakpoint: "560px", numVisible: 1 },
  ];

  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
    "ico",
    "heic",
    "raw",
    "cr2",
    "nef",
  ];

  const videoExtensions = [
    "mp4",
    "avi",
    "mov",
    "mkv",
    "webm",
    "flv",
    "wmv",
    "m4v",
    "3gp",
    "mpg",
    "mpeg",
    "ogv",
    "vob",
  ];

  // Prepare media items
  const mediaItems = filteredSortedContents
    .filter((item) => {
      const ext = item.name.split(".").pop()?.toLowerCase();
      return (
        !item.isDirectory &&
        [...imageExtensions, ...videoExtensions].includes(ext)
      );
    })
    .map((item) => {
      const ext = item.name.split(".").pop()?.toLowerCase();
      const isVideo = videoExtensions.includes(ext);
      const fullUrl = `${baseUrl}/filesystem/preview?path=${encodeURIComponent(
        item.path
      )}`;
      return {
        src: fullUrl,
        alt: item.name,
        title: item.name,
        isVideo,
      };
    });

  // Template for the main gallery item
  const itemTemplate = (item) => {
    return item.isVideo ? (
      <video
        src={item.src}
        controls
        style={{ width: "100%", height: "auto", maxHeight: "500px" }}
      />
    ) : (
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "500px",
          objectFit: "contain",
        }}
      />
    );
  };

  // Template for the thumbnail
  const thumbnailTemplate = (item) => {
    return item.isVideo ? (
      <video
        src={item.src}
        muted
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
        }}
      />
    ) : (
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
        }}
      />
    );
  };

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-column align-items-center justify-content-center p-5">
        <h3 className="text-primary">
          No images or videos found in this directory.
        </h3>
        <br />
        <Button
          label="Table View"
          icon="pi pi-table"
          className="mr-2"
          size="small"
          onClick={() => setItemViewMode("table")}
          severity="success"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-content-center">
      <Galleria
        value={mediaItems}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
        responsiveOptions={responsiveOptions}
        circular
        showItemNavigators
        showThumbnails
        style={{
          minWidth: "400px",
          maxWidth: "800px",
          minHeight: "650px",
          backgroundColor: "#63516bff",
        }}
        className="p-3 rounded-lg shadow-md"
      />
    </div>
  );
};

export default GalaryViewComponent;
