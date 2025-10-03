import React from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toolbar } from "primereact/toolbar";

const ToolbarComponent = () => {
  const startContent = (
    <React.Fragment>
      <Button icon="pi pi-upload" className="mr-2" />
      <Button icon="pi pi-plus" className="mr-2" />
      <Button icon="pi pi-undo" className="mr-2" />
      <Button icon="pi pi-window-minimize" className="mr-2" />
    </React.Fragment>
  );

  const centerContent = (
    <div className="p-inputgroup flex-1">
      <InputText placeholder="Search" />
      <Button icon="pi pi-search" />
    </div>
  );

  const endContent = (
    <React.Fragment>
      <Button icon="pi pi-table" className="mr-2" />
      <Button icon="pi pi-list" className="mr-2" />
      <Button icon="pi pi-th-large" />
    </React.Fragment>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} center={centerContent} end={endContent} />
    </div>
  );
};
export default ToolbarComponent;
