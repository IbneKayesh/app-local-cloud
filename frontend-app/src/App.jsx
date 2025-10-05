import React, { useState } from "react";
import { PrimeReactProvider } from "primereact/api";

import Layout from "./Layout";
import CloudPage from "./pages/cloud/CloudPage";
import SettingsPage from "./pages/settings/SettingsPage";

const App = () => {
  const [selectedKey, setSelectedKey] = useState("");

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <CloudPage setSelectedKey={setSelectedKey} />;
      case "2":
        return <SettingsPage setSelectedKey={setSelectedKey} />;
      default:
        return <CloudPage setSelectedKey={setSelectedKey} />;
    }
  };

  return (
    <PrimeReactProvider>
      <Layout>{renderContent()}</Layout>
    </PrimeReactProvider>
  );
};

export default App;
