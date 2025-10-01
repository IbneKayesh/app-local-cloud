import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const MoveComponent = ({ moveDirs, handleItemRowClick, handleMoveBtnClick }) => {
  const actionTemplate = (rowData) => {
    return (
      <Button
        label="Move"
        severity="help"
        style={{ margin: "0.5rem" }}
        onClick={() => handleMoveBtnClick(rowData)}
        icon="pi pi-arrow-right"
        iconPos="right"
      />
    );
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={moveDirs}
          tableStyle={{ minWidth: "20rem" }}
          onRowClick={(e) => {
            handleItemRowClick(e);
          }}
          size="small"
        >
          <Column field="label" header="Name"></Column>
          <Column header="" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
};

export default MoveComponent;
