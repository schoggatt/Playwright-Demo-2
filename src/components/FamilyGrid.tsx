import { useEffect, useState } from 'react';
import { TFamily } from '../types/Family';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-enterprise';
import { getFamilies } from '../services/Family';
import { FamilyDetailRenderer } from './FamilyDetailRenderer';

export function FamilyGrid() {
  const [rowData, setRowData] = useState<TFamily[]>([]);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [newFamilyName, setNewFamilyName] = useState<string>('');

  useEffect(() => {
    getFamilies().then((data) => setRowData(data));
  }, []);

  const columnDefs: ColDef[] = [
    {
      field: 'name',
      colId: 'name',
      headerName: 'Family Name',
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'No. of Members',
      colId: 'memberCount',
      valueGetter: (params: { data: TFamily }) => {
        return params.data.members.length;
      },
    },
  ];

  function onGridReady(params: GridReadyEvent) {
    setGridApi(params.api);
  }

  function addNewFamily() {
    if (!newFamilyName.trim()) {
      alert('Please provide a valid family name.');
      return;
    }

    // Check for duplicate family name
    const duplicateFamily = rowData.some(
      (family) =>
        family.name.toLowerCase() ===
        `${newFamilyName.trim()} Family`.toLowerCase()
    );

    if (duplicateFamily) {
      alert('A family with this name already exists.');
      return;
    }

    const newId =
      rowData.length > 0 ? Math.max(...rowData.map((f) => f.id)) + 1 : 1;

    const newFamily: TFamily = {
      id: newId,
      name: `${newFamilyName} Family`,
      members: [],
    };

    setRowData([...rowData, newFamily]);
    setNewFamilyName('');
  }

  function deleteSelectedRows() {
    const selectedNodes = gridApi!.getSelectedNodes();
    const selectedIds = (selectedNodes || []).map(
      (node: { data: TFamily }) => node.data.id
    );

    const updatedRowData = rowData.filter(
      (family) => !selectedIds.includes(family.id)
    );
    setRowData(updatedRowData);
  }

  function resetChanges() {
    getFamilies().then((data) => setRowData(data));
  }

  async function saveChanges() {
    const updatedData: TFamily[] = [];
    gridApi!.forEachNode((node) => {
      return updatedData.push(node.data);
    });

    setRowData(updatedData);

    if (updatedData.some((family) => family.members.length === 0)) {
      alert(
        'Please add at least one member to each family or remove them before saving.'
      );
    }

    console.log('Saving changes:', updatedData);
  }

  return (
    <div
      className='ag-theme-alpine'
      style={{ height: '400px', width: '100em' }}
    >
      <input
        type='text'
        placeholder='Enter Family Last Name'
        value={newFamilyName}
        onChange={(e) => setNewFamilyName(e.target.value)}
        style={{ margin: '10px' }}
      />
      <button onClick={addNewFamily} style={{ margin: '10px' }}>
        Add Family
      </button>
      <button onClick={deleteSelectedRows} style={{ margin: '10px' }}>
        Delete Selected Families
      </button>
      <button onClick={resetChanges} style={{ margin: '10px' }}>
        Reset Changes
      </button>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        masterDetail={true}
        detailRowHeight={300}
        gridOptions={{
          getRowId: (params: { data: TFamily }) => params.data.id.toString(),
        }}
        detailCellRenderer={(params: { data: TFamily }) => (
          <FamilyDetailRenderer data={params.data} gridApi={gridApi!} />
        )}
        rowSelection={{
          mode: 'multiRow',
        }}
        onGridReady={onGridReady}
        defaultColDef={{
          flex: 1,
          resizable: true,
        }}
      />
      <button onClick={saveChanges} style={{ margin: '10px' }}>
        Save Changes
      </button>
    </div>
  );
}
