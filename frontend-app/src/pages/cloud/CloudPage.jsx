import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";

//internal imports
import useCloud from "@/hooks/useCloud";
import { formatBytes, formatLocalDateTime } from "@/utils/sanitize";
import ActionComponent from "./ActionComponent";
import MoveComponent from "./MoveComponent";
import RenameComponent from "./RenameComponent";
import DeleteBinComponent from "./DeleteBinComponent";
import DeleteComponent from "./DeleteComponent";
import NewFolderComponent from "./NewFolderComponent";
import UploadComponent from "./UploadComponent";
import TableViewComponent from "./TableViewComponent";
import GridViewComponent from "./GridViewComponent";
import TableGroupViewComponent from "./TableGroupViewComponent";
import DetailsPaneComponent from "./DetailsPaneComponent";
import DriveComponent from "./DriveComponent";
import ToolbarComponent from "./ToolbarComponent";
import PreviewComponent from "./PreviewComponent";
import SearchComponent from "./SearchComponent";
import CompressComponent from "./CompressComponent";
import UncompressComponent from "./UncompressComponent";

const CloudPage = ({ setSelectedKey }) => {
  const {
    loading,
    error,
    drives,
    baseUrl,
    currentPath,
    handleDriveBtnClick,
    currentPathContents,
    filteredSortedContents,
    handleItemRowClick,
    handleBtnRecentBtnClick,
    breadCrumbHome,
    breadCrumbItems,
    diskStorageView,
    setDiskStorageView,
    recentContents,
    handleBtnItemDownloadClick,
    handleRefreshDlgClick,

    //rename
    handleRenameDlgClick,
    renameDlg,
    setRenameDlg,
    renameFromData,
    setRenameFromData,
    handleRenameBtnClick,

    //delete bin
    handleDeleteBinDlgClick,
    deleteBinDlg,
    setDeleteBinDlg,
    handleDeleteBinBtnClick,

    //delete
    handleDeleteDlgClick,
    deleteDlg,
    setDeleteDlg,
    handleDeleteBtnClick,

    //new folder
    handleNewFolderDlgClick,
    newFolderDlg,
    setNewFolderDlg,
    newFolderFromData,
    setNewFolderFromData,
    handleNewFolderBtnClick,

    //uploader
    handleUploaderDlgClick,
    uploaderDlg,
    setUploaderDlg,
    handleUploaderBtnClick,

    //selected item
    selectedItem,
    setSelectedItem,

    //move
    handleMoveDlgClick,
    moveDlg,
    setMoveDlg,
    setMoveFromData,
    handleMoveBtnClick,

    //preview
    preview,
    handleBtnSetPreviewClick,

    //search
    searchDlg,
    setSearchDlg,
    searchFromData,
    setSearchFromData,
    handleSearchDlgClick,
    handleSearchBtnClick,
    searchTerm,
    setSearchTerm,

    //sort order
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    groupBy,
    setGroupBy,

    //item view mode
    itemViewMode,
    setItemViewMode,
    viewModeItems,

    //detail
    showDetail,
    setShowDetail,

    //recent
    showRecent,
    setShowRecent,

    //compress
    compressDlg,
    setCompressDlg,
    handleCompressDlgClick,
    handleCompressBtnClick,
    unCompressDlg,
    setUnCompressDlg,
    handleUnCompressDlgClick,
    handleUnCompressBtnClick,
  } = useCloud();

  //console.log("drives " + JSON.stringify(drives));

  const catalog = ["3g2","3ga","3gp","7z","aa","aac","ac","accdb","accdt","adn","ai","aif","aifc","aiff","ait","amr","ani","apk","app","applescript","asax","asc","ascx","asf","ash","ashx","asmx","asp","aspx","asx","au","aup","avi","axd","aze","bak","bash","bat","bin","blank","bmp","bowerrc","bpg","browser","bz2","c","cab","cad","caf","cal","cd","cer","cfg","cfm","cfml","cgi","class","cmd","codekit","coffee","coffeelintignore","com","compile","conf","config","cpp","cptx","cr2","crdownload","crt","crypt","cs","csh","cson","csproj","css","csv","cue","dat","db","dbf","deb","dgn","dist","diz","dll","dmg","dng","doc","docb","docm","docx","dot","dotm","dotx","download","dpj","ds_store","dtd","dwg","dxf","editorconfig","el","enc","eot","eps","epub","eslintignore","exe","f4v","fax","fb2","fla","flac","flv","folder","gadget","gdp","gem","gif","gitattributes","gitignore","go","gpg","gz","h","handlebars","hbs","heic","hs","hsl","htm","html","ibooks","icns","ico","ics","idx","iff","ifo","image","img","in","indd","inf","ini","iso","j2","jar","java","jpe","jpeg","jpg","js","json","jsp","jsx","key","kf8","kmk","ksh","kup","less","lex","licx","lisp","lit","lnk","lock","log","lua","m","m2v","m3u","m3u8","m4","m4a","m4r","m4v","map","master","mc","md","mdb","mdf","me","mi","mid","midi","mk","mkv","mm","mo","mobi","mod","mov","mp2","mp3","mp4","mpa","mpd","mpe","mpeg","mpg","mpga","mpp","mpt","msi","msu","nef","nes","nfo","nix","npmignore","odb","ods","odt","ogg","ogv","ost","otf","ott","ova","ovf","p12","p7b","pages","part","pcd","pdb","pdf","pem","pfx","pgp","ph","phar","php","pkg","pl","plist","pm","png","po","pom","pot","potx","pps","ppsx","ppt","pptm","pptx","prop","ps","ps1","psd","psp","pst","pub","py","pyc","qt","ra","ram","rar","raw","rb","rdf","resx","retry","rm","rom","rpm","rsa","rss","rtf","ru","rub","sass","scss","sdf","sed","sh","sitemap","skin","sldm","sldx","sln","sol","sql","sqlite","step","stl","svg","swd","swf","swift","sys","tar","tcsh","tex","tfignore","tga","tgz","tif","tiff","tmp","torrent","ts","tsv","ttf","twig","txt","udf","vb","vbproj","vbs","vcd","vcs","vdi","vdx","vmdk","vob","vscodeignore","vsd","vss","vst","vsx","vtx","war","wav","wbk","webinfo","webm","webp","wma","wmf","wmv","woff","woff2","wps","wsf","xaml","xcf","xlm","xls","xlsm","xlsx","xlt","xltm","xltx","xml","xpi","xps","xrb","xsd","xsl","xspf","xz","yaml","yml","z","zip","zsh"];

  const name_body = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    const ext = rowData.name.split(".").pop().toLowerCase();
    let icon;
    if (rowData.isDirectory) {
      icon = 'folder';
    } else if (catalog.includes(ext)) {
      icon = ext;
    } else {
      icon = 'txt';
    }
    return (
      <div className="flex align-items-center gap-1">
        <img src={`/icons/vivid/${icon}.svg`} alt={rowData.name} style={{ width: '20px', height: '20px' }} />
        {rowData.name}
      </div>
    );
  };

  const rowClass = (rowData) => {
    //console.log("rowData " + JSON.stringify(rowData));
    return {
      "bg-primary": rowData.name === "CloudRecycleBin",
    };
  };

  const size_body = (rowData) => {
    return rowData.isDirectory ? rowData.size : formatBytes(rowData.size);
  };

  const mtime_body = (rowData) => {
    return formatLocalDateTime(rowData.mtime);
  };

  return (
    <>
      {diskStorageView && (
        <DriveComponent
          drives={drives}
          handleDriveBtnClick={handleDriveBtnClick}
        />
      )}

      <ToolbarComponent
        diskStorageView={diskStorageView}
        setDiskStorageView={setDiskStorageView}
        handleRefreshDlgClick={handleRefreshDlgClick}
        handleUploaderDlgClick={handleUploaderDlgClick}
        handleNewFolderDlgClick={handleNewFolderDlgClick}
        itemViewMode={itemViewMode}
        setItemViewMode={setItemViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchDlgClick={handleSearchDlgClick}
        showRecent={showRecent}
        setShowRecent={setShowRecent}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setSelectedKey={setSelectedKey}
      />

      {showRecent && (
        <div className="card flex flex-wrap justify-content-center gap-1 my-1">
          {recentContents.map((item) => (
            <Button
              key={item.path}
              label={`${item.label}`}
              title={item.path}
              onClick={() => handleBtnRecentBtnClick(item.path)}
              size="small"
              badge={item.count}
              severity="secondary"
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <ActionComponent
          selectedItem={selectedItem}
          handleBtnSetPreviewClick={handleBtnSetPreviewClick}
          handleBtnItemDownloadClick={handleBtnItemDownloadClick}
          handleRenameDlgClick={handleRenameDlgClick}
          handleMoveDlgClick={handleMoveDlgClick}
          handleCompressDlgClick={handleCompressDlgClick}
          handleUnCompressDlgClick={handleUnCompressDlgClick}
          handleDeleteBinDlgClick={handleDeleteBinDlgClick}
          handleDeleteDlgClick={handleDeleteDlgClick}
        />
      )}

      <BreadCrumb model={breadCrumbItems} home={breadCrumbHome} />
      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <strong>Loading.... </strong>
        </div>
      ) : (
        <div className="grid">
          <div className={showDetail ? "col-8" : "col-12"}>
            {itemViewMode === "table" && (
              <TableViewComponent
                rowClass={rowClass}
                filteredSortedContents={filteredSortedContents}
                handleItemRowClick={handleItemRowClick}
                name_body={name_body}
                size_body={size_body}
                mtime_body={mtime_body}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}

            {itemViewMode === "grouped" && (
              <TableGroupViewComponent
                rowClass={rowClass}
                filteredSortedContents={filteredSortedContents}
                handleItemRowClick={handleItemRowClick}
                name_body={name_body}
                size_body={size_body}
                mtime_body={mtime_body}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}

            {itemViewMode === "grid" && (
              <GridViewComponent
                filteredSortedContents={filteredSortedContents}
                handleItemRowClick={handleItemRowClick}
                size_body={size_body}
                mtime_body={mtime_body}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}
          </div>

          {showDetail && (
            <div className="col-4">
              <DetailsPaneComponent
                selectedItem={selectedItem}
                size_body={size_body}
                mtime_body={mtime_body}
                setShowDetail={setShowDetail}
              />
            </div>
          )}
        </div>
      )}
      <RenameComponent
        renameDlg={renameDlg}
        setRenameDlg={setRenameDlg}
        renameFromData={renameFromData}
        setRenameFromData={setRenameFromData}
        handleRenameBtnClick={handleRenameBtnClick}
      />

      <DeleteBinComponent
        deleteBinDlg={deleteBinDlg}
        setDeleteBinDlg={setDeleteBinDlg}
        selectedItem={selectedItem}
        handleDeleteBinBtnClick={handleDeleteBinBtnClick}
      />

      <DeleteComponent
        deleteDlg={deleteDlg}
        setDeleteDlg={setDeleteDlg}
        selectedItem={selectedItem}
        handleDeleteBtnClick={handleDeleteBtnClick}
      />

      <NewFolderComponent
        newFolderDlg={newFolderDlg}
        setNewFolderDlg={setNewFolderDlg}
        newFolderFromData={newFolderFromData}
        setNewFolderFromData={setNewFolderFromData}
        handleNewFolderBtnClick={handleNewFolderBtnClick}
      />

      <UploadComponent
        uploaderDlg={uploaderDlg}
        setUploaderDlg={setUploaderDlg}
        baseUrl={baseUrl}
        currentPath={currentPath}
        handleRefreshDlgClick={handleRefreshDlgClick}
      />

      <PreviewComponent
        preview={preview}
        handleBtnSetPreviewClick={handleBtnSetPreviewClick}
      />

      <MoveComponent
        moveDlg={moveDlg}
        setMoveDlg={setMoveDlg}
        moveDirs={recentContents}
        handleItemRowClick={handleMoveBtnClick}
        handleMoveBtnClick={handleMoveBtnClick}
      />

      <SearchComponent
        searchDlg={searchDlg}
        setSearchDlg={setSearchDlg}
        searchFromData={searchFromData}
        setSearchFromData={setSearchFromData}
        handleSearchBtnClick={handleSearchBtnClick}
      />

      <CompressComponent
        loading={loading}
        compressDlg={compressDlg}
        setCompressDlg={setCompressDlg}
        handleCompressBtnClick={handleCompressBtnClick}
        selectedItem={selectedItem}
      />

      <UncompressComponent
        loading={loading}
        unCompressDlg={unCompressDlg}
        setUnCompressDlg={setUnCompressDlg}
        handleUnCompressBtnClick={handleUnCompressBtnClick}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default CloudPage;
