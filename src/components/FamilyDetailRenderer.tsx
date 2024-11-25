import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { TPerson } from '../types/Person';
import { TFamily } from '../types/Family';
import { PersonForm } from './PersonForm';
import { ColDef, GridApi } from 'ag-grid-community';

export function FamilyDetailRenderer({
  data,
  gridApi,
}: {
  data: TFamily;
  gridApi: GridApi;
}) {
  const [members, setMembers] = useState<TPerson[]>(data.members);

  function updateFamily(updatedMembers: TPerson[]) {
    const updatedFamily = {
      ...data,
      members: updatedMembers,
      memberCount: updatedMembers.length, // Update derived state
    };

    setMembers(updatedMembers);

    // Update the parent grid's row data via transaction
    gridApi.applyTransaction({
      update: [updatedFamily],
    });
  }

  const addMember = (newMember: TPerson) => {
    // This is a bug we should prevent adding duplicate names
    // if (members.some((member) => member.name === newMember.name)) {
    //   alert('A family member with this name already exists.');
    //   return;
    // }

    const updatedMembers = [...members, newMember];
    updateFamily(updatedMembers);
  };

  const removeMember = (memberId: number) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    updateFamily(updatedMembers);
  };

  const columnDefs: ColDef[] = [
    {
      field: 'relation',
      colId: 'relation',
      headerName: 'Relation',
      editable: true,
      flex: 1,
    },
    {
      field: 'name',
      colId: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
    },
    { field: 'age', colId: 'age', headerName: 'Age', editable: true, flex: 1 },
    {
      headerName: 'Actions',
      colId: 'actions',
      cellRenderer: (params: { data: TPerson }) => (
        <button
          onClick={() => removeMember(params.data.id)}
          style={{ cursor: 'pointer', color: 'white' }}
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <div>
      <div
        className='ag-theme-alpine'
        style={{ height: '225px', width: '100%' }}
      >
        <div style={{ margin: '10px' }}>
          <PersonForm
            family={data}
            onAdd={(newMember) => {
              const nextId = members.length
                ? Math.max(...members.map((m) => m.id)) + 1
                : 1;
              addMember({ ...newMember, id: nextId });
            }}
          />
        </div>
        <AgGridReact
          rowData={members}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true }}
          gridOptions={{
            getRowId: (params: { data: TPerson }) => params.data.id.toString(),
          }}
        />
      </div>
    </div>
  );
}
