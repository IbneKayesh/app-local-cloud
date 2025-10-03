import React from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";

const DriveComponent = ({ drives, handleDriveBtnClick }) => {
  return (
    <div className="grid">
      {drives.map((d) => {
        const used = d.used || 0;
        const total = d.total || 100;
        const percentUsed = Math.round((used / total) * 100);

        return (
          <div key={d.letter} className="col-12 sm:col-4 md:col-2 lg:col-2">
            <Card
              className="cursor-pointer hover:shadow-4"
              onClick={(e) => handleDriveBtnClick(e, d)}
              title={
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-inbox" size={20} />
                  <span>{`Local Disk (${d.letter})`}</span>
                </div>
              }
            >
              <div className="mb-2">
                <small>{`${used} GB used of ${total} GB`}</small>
              </div>
              <ProgressBar
                value={percentUsed}
                showValue={false}
                style={{ height: "8px" }}
              />
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default DriveComponent;
