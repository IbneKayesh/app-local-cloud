import React from "react";
import { Menubar } from "primereact/menubar";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <main style={{ flex: 1, padding: "1px" }}>{children}</main>
      <footer
        style={{
          textAlign: "center",
          padding: "10px",
          marginTop: "5px",
        }}
      >
        Local Cloud ©{new Date().getFullYear()} Created with Sand Grain Digital
      </footer>
    </div>
  );
};

export default Layout;
