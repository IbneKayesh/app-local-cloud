import React from "react";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";

const DriveComponent = ({ drives, handleDriveBtnClick }) => {
  const getProgressColor = (usedPercent) => {
    if (usedPercent < 50) return "#22c55e"; // green
    if (usedPercent < 80) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div className="p-2 flex gap-3 overflow-x-auto whitespace-nowrap">
      {drives.filter(d => d.enabled).map((d) => {
        const clickable = d.enabled;

        return (
          <div
            key={d.letter}
            className="inline-block"
            style={{ minWidth: "250px", flexShrink: 0 }}
          >
            <Card
              pt={{
                body: {
                  className: "p-2 !px-0 !py-0",
                },
                content: {
                  className: "p-1 !px-0 !py-0",
                },
              }}
              className={`shadow-none rounded-sm transition-all duration-200 ${
                clickable
                  ? "hover:shadow-4 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={clickable ? (e) => handleDriveBtnClick(e, d) : undefined}
              style={{
                minHeight: "50px",
                padding: "0.15rem",
              }}
            >
              <div className="flex justify-between align-items-center mb-2">
                <div className="flex align-items-center gap-2 text-sm font-medium">
                  <i className="pi pi-inbox text-xl text-primary" />
                  <span>Local Disk {d.letter}</span>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-2">
                <span>
                  {d.used} ({d.usedPercent.toFixed(1)}%) used
                </span>
              </div>

              <ProgressBar
                value={d.usedPercent}
                showValue={false}
                color={getProgressColor(d.usedPercent)}
                style={{ height: "15px", borderRadius: "2px" }}
              />
              <div className="text-center text-gray-500 text-xs mt-1">
                <span>
                  {d.free} free of {d.limit}
                </span>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default DriveComponent;
