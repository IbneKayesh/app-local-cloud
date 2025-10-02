import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TableGroupViewComponent = ({ filteredSortedContents, handleItemRowClick, sortField, sortOrder, onSort, name_body, size_body, mtime_body, actionTemplate, groupBy, setGroupBy, handleSelectItem }) => {
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          label="Group by Type"
          severity={groupBy === "type" ? "success" : "secondary"}
          style={{ margin: "0.5rem" }}
          onClick={() => setGroupBy("type")}
        />
        <Button
          label="Group by Extension"
          severity={groupBy === "extension" ? "success" : "secondary"}
          style={{ margin: "0.5rem" }}
          onClick={() => setGroupBy("extension")}
        />
        <Button
          label="Group by Date"
          severity={groupBy === "date" ? "success" : "secondary"}
          style={{ margin: "0.5rem" }}
          onClick={() => setGroupBy("date")}
        />
      </div>
      <DataTable
        value={filteredSortedContents}
        tableStyle={{ minWidth: "50rem" }}
        onRowClick={(e) => {
          handleItemRowClick(e);
          handleSelectItem(e.data);
        }}
        size="small"
        rowGroupMode="subheader"
        groupRowsBy="group"
        sortMode="single"
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          onSort(e);
        }}
        rowGroupHeaderTemplate={(data) => <span>{data.group}</span>}
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
    </>
  );
};

export default TableGroupViewComponent;
