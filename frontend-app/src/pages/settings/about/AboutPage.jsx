import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";

const AboutPage = () => {
  return (
    <Card title="About">
      <div className="p-fluid">
        <div className="p-field">
          <strong>Name:</strong> Local Cloud
        </div>
        <Divider />
        <div className="p-field">
          <strong>Version:</strong> 1.0.0  (01-Oct-2025)
        </div>
        <Divider />
        <div className="p-field">
          <strong>Backend:</strong> Node JS
        </div>
        <Divider />
        <div className="p-field">
          <strong>Frontend:</strong> React, Primereact UI
        </div>
        <Divider />
        <div className="p-field">
          <strong>Developer:</strong> ibnekayesh91@gmail.com
        </div>
        <Divider />
        <Panel header="License" toggleable collapsed>
          <div className="p-fluid">
            <div className="p-field">
              <strong>Personal Use License</strong>
            </div>
            <Divider />
            <div className="p-field">
              <p>Copyright (c) [2025] [Sand Grain Digital]</p>
              <p>This software is licensed for <strong>personal use only</strong>.</p>
            </div>
            <Divider />
            <div className="p-field">
              <strong>You are permitted to:</strong>
              <ul>
                <li>Use this software for your own personal, non-commercial purposes.</li>
              </ul>
            </div>
            <Divider />
            <div className="p-field">
              <strong>You are <em>not permitted</em> to:</strong>
              <ul>
                <li>Use this software for any commercial purpose.</li>
                <li>Modify, reverse-engineer, or create derivative works based on this software.</li>
                <li>Distribute, sublicense, sell, or share this software in any form.</li>
              </ul>
            </div>
            <Divider />
            <div className="p-field">
              <p>This software is provided "as is", without warranty of any kind, express or implied. The copyright holder shall not be held liable for any damages arising from its use.</p>
              <p>By using this software, you agree to the terms of this license.</p>
            </div>
          </div>10
        </Panel>
      </div>
    </Card>
  );
};

export default AboutPage;