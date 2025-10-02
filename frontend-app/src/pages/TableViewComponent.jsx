import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TableViewComponent = ({ filteredSortedContents, handleItemRowClick, sortField, sortOrder, onSort, name_body, size_body, mtime_body, actionTemplate, handleSelectItem }) => {
  return (
    <DataTable
      value={filteredSortedContents}
      tableStyle={{ minWidth: "50rem" }}
      onRowClick={(e) => {
        handleItemRowClick(e);
        handleSelectItem(e.data);
      }}
      size="small"
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={(e) => {
        onSort(e);
      }}
      removableSort
    >
      <Column field="name" header="Name" body={name_body} sortable></Column>
      <Column field="size" header="Size" body={size_body} sortable></Column>
      <Column
        field="mtime"
        header="Modified"
        body={mtime_body}
        sortable
      ></Column>
      <Column header="" body={actionTemplate}></Column>
    </DataTable>
  );
};

export default TableViewComponent;
