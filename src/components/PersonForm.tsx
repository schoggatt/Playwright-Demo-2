import { useState } from 'react';
import { TPerson } from '../types/Person';
import { TFamily } from '../types/Family';

export function PersonForm({
  family,
  onAdd,
}: {
  family: TFamily;
  onAdd: (member: TPerson) => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState<number | ''>('');

  const handleAddMember = () => {
    if (!firstName.trim() || !relation.trim() || !age) {
      alert('Please fill out all fields.');
      return;
    }

    const familyName = family.name.split(' ')[0]; // Extract the last name
    const fullName = `${firstName.trim()} ${familyName}`;

    // Check for duplicate names
    // if (family.members.some((member) => member.name === fullName)) {
    //   alert('A family member with this name already exists.');
    //   return;
    // }

    const newId = family.members.length
      ? Math.max(...family.members.map((m) => m.id)) + 1
      : family.id * 100 + 1;

    const newMember: TPerson = {
      id: newId,
      name: fullName,
      relation: relation.trim(),
      age: Number(age),
    };

    onAdd(newMember); // Pass the new member to the parent handler
    setFirstName('');
    setRelation('');
    setAge('');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginTop: '10px',
      }}
    >
      <input
        type='text'
        placeholder='First Name'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{ width: '150px' }}
      />
      <input
        type='text'
        placeholder='Relation'
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        style={{ width: '150px' }}
      />
      <input
        type='number'
        placeholder='Age'
        value={age}
        onChange={(e) =>
          setAge(e.target.value === '' ? '' : Number(e.target.value))
        }
        style={{ width: '80px' }}
      />
      <button
        onClick={handleAddMember}
        style={{ padding: '5px 10px', cursor: 'pointer' }}
      >
        Add Member
      </button>
    </div>
  );
}
