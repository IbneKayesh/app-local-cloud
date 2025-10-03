import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const SearchComponent = ({
  searchDlg,
  setSearchDlg,
  searchFromData,
  setSearchFromData,
  handleSearchBtnClick,
}) => {
  return (
    <>
      <Dialog
        header="Search ?"
        visible={searchDlg}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!searchDlg) return;
          setSearchDlg(false);
        }}
        position={"top"}
      >
        <div className="card">
          <div className="flex flex-wrap align-items-center mb-3 gap-2">
            <InputText
              value={searchFromData.searchText}
              onChange={(e) =>
                setSearchFromData({
                  ...searchFromData,
                  searchText: e.target.value,
                })
              }
              placeholder="Enter file/folder name"
              className="w-full"
              autoComplete="false"
            />
          </div>
          <div className="flex flex-wrap align-items-right gap-2">
            <Button
              label="Go"
              severity="primary"
              icon="pi pi-search"
              style={{ marginLeft: "0.5rem" }}
              onClick={handleSearchBtnClick}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default SearchComponent;
