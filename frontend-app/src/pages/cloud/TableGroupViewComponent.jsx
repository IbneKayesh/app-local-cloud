import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TableGroupViewComponent = ({
  filteredSortedContents,
  handleItemRowClick,
  name_body,
  size_body,
  mtime_body,
  selectedItem,
  setSelectedItem,
}) => {
  return (
    <>
      <DataTable
        value={filteredSortedContents}
        tableStyle={{ minWidth: "50rem" }}
        onRowClick={(e) => {
          handleItemRowClick(e);
        }}
        size="small"
        rowGroupMode="subheader"
        groupRowsBy="group"
        sortMode="single"
        rowGroupHeaderTemplate={(data) => {
          const groupName = data.group;
          const groupCount = filteredSortedContents.filter(item => item.group === groupName).length;
          return <span>{groupName} ({groupCount})</span>;
        }}
        removableSort
        dataKey="name"
        selectionMode={"radiobutton"}
        selection={selectedItem}
        onSelectionChange={(e) => setSelectedItem(e.value)}
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
    </>
  );
};

export default TableGroupViewComponent;
