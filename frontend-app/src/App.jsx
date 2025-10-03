import React, { useState } from "react";
import { PrimeReactProvider } from "primereact/api";

import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import CloudPage from "./pages/cloud/CloudPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <CloudPage />;
      case "2":
        return <AboutPage />;
      case "0":
      default:
        return <HomePage />;
    }
  };

  const menuItems = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => setSelectedKey("0"),
    },
    {
      label: "Cloud",
      icon: "pi pi-cloud",
      command: () => setSelectedKey("1"),
    },
    {
      label: "About",
      icon: "pi pi-user",
      command: () => setSelectedKey("2"),
    },
  ];

  return (
    <PrimeReactProvider>
      {/* <Layout menuItems={menuItems}>
        {renderContent()}
      </Layout> */}

      <Layout>{renderContent()}</Layout>
    </PrimeReactProvider>
  );
};

export default App;
