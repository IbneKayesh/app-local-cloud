import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TableViewComponent = ({
  filteredSortedContents,
  handleItemRowClick,
  name_body,
  size_body,
  mtime_body,
  selectedItem,
  setSelectedItem,
}) => {
  return (
    <DataTable
      value={filteredSortedContents}
      scrollable
      scrollHeight="500px"
      onRowClick={(e) => {
        handleItemRowClick(e);
      }}
      size="small"
      removableSort
      dataKey="name"
      selectionMode={"radiobutton"}
      selection={selectedItem}
      onSelectionChange={(e) => setSelectedItem(e.value)}
      className="hover"
    >
      <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
      <Column field="name" header="Name" body={name_body} sortable></Column>
      <Column field="size" header="Size" body={size_body} sortable></Column>
      <Column
        field="mtime"
        header="Modified"
        body={mtime_body}
        sortable
      ></Column>
    </DataTable>
  );
};

export default TableViewComponent;
