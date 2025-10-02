import { Tree } from "primereact/tree";

const TreeSidebarComponent = ({ treeData, onNodeSelect }) => {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc", height: "100%", overflowY: "auto", padding: "0.5rem" }}>
      <Tree
        value={treeData}
        onNodeSelect={(e) => onNodeSelect(e.node.key)}
        style={{ height: '100%', userSelect: "none" }}
      />
    </div>
  );
};

export default TreeSidebarComponent;
