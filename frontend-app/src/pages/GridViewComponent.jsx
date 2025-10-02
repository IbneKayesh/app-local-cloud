import { Button } from "primereact/button";
import { Card } from "primereact/card";

const GridViewComponent = ({ filteredSortedContents, handleItemRowClick, size_body, mtime_body, actionTemplate, truncateName, sortField, setSortField, sortOrder, setSortOrder, handleSelectItem }) => {
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          label={`Sort by ${sortField === 'name' ? 'Name' : sortField === 'size' ? 'Size' : 'Modified'}`}
          severity="secondary"
          style={{ margin: "0.5rem" }}
          onClick={() => {
            const nextField = sortField === 'name' ? 'size' : sortField === 'size' ? 'mtime' : 'name';
            setSortField(nextField);
            setSortOrder(1);
          }}
        />
        <Button
          label={sortOrder === 1 ? 'Asc' : 'Desc'}
          severity="secondary"
          style={{ margin: "0.5rem" }}
          onClick={() => setSortOrder(sortOrder === 1 ? -1 : 1)}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.2rem' }}>
        {filteredSortedContents.map((item) => (
          <Card key={item.name} style={{ width: '150px', cursor: 'pointer', padding: '0.5rem' }} onClick={() => { handleItemRowClick({ data: item }); handleSelectItem(item); }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.isDirectory ? '📁' : '📄'}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem', wordBreak: 'break-word' }} title={item.name}>{truncateName(item.name)}</div>
              <div style={{ fontSize: '0.8rem' }}>Size: {size_body(item)}</div>
              <div style={{ fontSize: '0.8rem' }}>Modified: {mtime_body(item)}</div>
              <div style={{ marginTop: '0.25rem' }}>{actionTemplate(item)}</div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default GridViewComponent;
