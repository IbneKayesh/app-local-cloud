import { TabView, TabPanel } from "primereact/tabview";
import React, { useState } from "react";
import { Button } from "primereact/button";
import AboutPage from "./about/AboutPage";
import UserPage from "./users/UserPage";

const SettingsPage = ({ setSelectedKey }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="card">
      <div className="flex mb-1 gap-2 justify-content-end">
        <Button
          onClick={() => setActiveIndex(0)}
          className="w-2rem h-2rem p-0"
          rounded
          outlined={activeIndex !== 0}
          label="1"
        />
        <Button
          onClick={() => setActiveIndex(1)}
          className="w-2rem h-2rem p-0"
          rounded
          outlined={activeIndex !== 1}
          label="2"
        />
        <Button
          onClick={() => setActiveIndex(2)}
          className="w-2rem h-2rem p-0"
          rounded
          outlined={activeIndex !== 2}
          label="3"
        />
        <Button
          onClick={() => setSelectedKey(1)}
          className="w-2rem h-2rem p-0"
          rounded
          icon="pi pi-cloud"
          tooltip="Cloud"
          tooltipOptions={{ position: "left" }}
          severity="info"
        />
      </div>
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Cloud" leftIcon="pi pi-cloud mr-2">
          Disk and Drives
          
        </TabPanel>
        <TabPanel header="Users" leftIcon="pi pi-users mr-2">
          <UserPage />
        </TabPanel>
        <TabPanel header="About" leftIcon="pi pi-at mr-2">
          <AboutPage />
        </TabPanel>
      </TabView>
    </div>
  );
};
export default SettingsPage;
