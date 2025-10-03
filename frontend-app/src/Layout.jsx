import React from "react";
import { Menubar } from 'primereact/menubar';

const Layout = ({ children, menuItems }) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menubar model={menuItems} />
      <main style={{ flex: 1, padding: '1px', overflow: 'auto' }}>
        <div style={{
          padding: 5,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {children}
        </div>
      </main>
      <footer style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f5f5f5', borderTop: '1px solid #d9d9d9' }}>
        Local Cloud ©{new Date().getFullYear()} Created with Sand Grain Digital
      </footer>
    </div>
  );
};

export default Layout;
