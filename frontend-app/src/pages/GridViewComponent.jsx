import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";

//internal imports
import { truncateFileName } from "@/utils/sanitize";

const GridViewComponent = ({
  filteredSortedContents,
  handleItemRowClick,
  size_body,
  mtime_body,
  selectedItem,
  setSelectedItem,
}) => {
  const headerContent = (item) => (
    <div className="py-2">
      <RadioButton
        inputId={item.name}
        name="selectedItem"
        onChange={() =>
          setSelectedItem(
            selectedItem && selectedItem.name === item.name ? null : item
          )
        }
        checked={selectedItem && selectedItem.name === item.name}
      />
    </div>
  );
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "0.2rem",
        }}
      >
        {filteredSortedContents.map((item) => (
          <Card key={item.name} header={headerContent(item)}>
            <div
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => {
                handleItemRowClick({ data: item });
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>
                {item.isDirectory ? "📁" : "📄"}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  marginBottom: "0.25rem",
                  wordBreak: "break-word",
                }}
                title={item.name}
              >
                {truncateFileName(item.name)}
              </div>
              <div style={{ fontSize: "0.8rem" }}>Size: {size_body(item)}</div>
              <div style={{ fontSize: "0.8rem" }}>
                Modified: {mtime_body(item)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default GridViewComponent;
