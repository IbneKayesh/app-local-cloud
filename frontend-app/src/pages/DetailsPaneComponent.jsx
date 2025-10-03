import { Card } from "primereact/card";

const DetailsPaneComponent = ({ selectedItem, size_body, mtime_body }) => {
  if (!selectedItem) {
    return (
      <div
        style={{
          width: "250px",
          padding: "1rem",
        }}
      >
        <p>Select an item to view details</p>
      </div>
    );
  }

  return (
    <Card title={selectedItem.name}>
      <p>
        <strong>Type:</strong> {selectedItem.isDirectory ? "Folder" : "File"}
      </p>
      <p>
        <strong>Size:</strong> {size_body(selectedItem)}
      </p>
      <p>
        <strong>Modified:</strong> {mtime_body(selectedItem)}
      </p>
      {selectedItem.isDirectory ? null : (
        <p>
          <strong>Extension:</strong> {selectedItem.name.split(".").pop()}
        </p>
      )}
    </Card>
  );
};

export default DetailsPaneComponent;
