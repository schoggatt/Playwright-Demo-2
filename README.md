# FamilyTS

## Overview

This grid implementation provides a **master-detail** interface for managing families and their members. The parent grid (master) tracks families and their derived data (e.g., number of members), while the detail grid (subgrid) allows adding, editing, and removing family members.

---

## Features

### 1. **Page Elements**

- Displays a the following UI elements:
  - **Family Name Input**: You can input the name of the new family to be added.
  - **Add Family**: Adds an empty family to the grid with the name provided in the **Family Name Input**.
  - **Delete Selected Families**: Removes the selected families from the grid.
  - **Reset Changes**: This button resets the grid to the initial state of the DB discarding changes.

### 2. **Family Grid (Parent Grid)**

- Displays a list of families with the following columns:
  - **Family Name**: The name of the family.
  - **No. of Members**: The number of members in each family, dynamically updated when members are added or removed.
- Supports:
  - **Row Selection**: Multiple families can be selected using checkboxes.
  - **Expandable Rows**: Clicking a caret expands a row to show the detail grid for that family.

### 3. **Family Detail Grid (Sub Grid)**

- Allows managing members for each family with the following columns:
  - **Relation**: The relation of the member to the family (e.g., Parent, Child).
  - **Name**: The full name of the family member.
  - **Age**: The age of the family member.
  - **Actions**: Includes a "Remove" button to delete the member.
- Features:
  - **Add Member Form**: A form below the detail grid lets users add new members.
    - Automatically appends the family name to the entered first name.
    - Prevents duplicate names within the same family.
  - **Dynamic Updates**: Adding or removing members updates the parent grid's "No. of Members" column without collapsing the detail grid.

### 4. **Real-Time Updates**

- Changes in the detail grid (add/remove members) are reflected in the parent grid dynamically.
- The detail grid remains open and does not flicker or collapse on updates.

---

## Restrictions

1. **Unique Member Names:**

   - A member's full name must be unique within the family and should not be case sensitive (i.e. 'johnson' should not be allowed if there is a 'Johnson'). Attempting to add a duplicate name will display an error.

2. **Unique Family Names:**

   - A family's name must be unique and not case sensitive (i.e. 'sam' should not be allowed if there is a 'Sam' in the same family). Attempting to add a duplicate name will display an error.

3. **Empty Families:**

   - A family must have at least a single member to save the grid data. Attempting to add a duplicate name will display an error.

4. **Parent Grid Updates:**

   - The "No. of Members" column in the parent grid updates dynamically as members are added or removed.

5. **Read-Only Parent Grid:**

   - The parent grid data (e.g., family name, number of members) cannot be directly edited by the user.

6. **Read-Only Sub Grid:**

   - The sub grid data (e.g., relation, name, age) cannot be directly edited by the user.

7. **New Person Non-Nullable Family Name:**

   - The new family input must have a non-null name to create the family. Failure will display an alert.

8. **New Family Non-Nullable Name:**
   - The form must have all its input provided (e.g. relation, name, age). Otherwise, it will display a error alert.

---

## User Interaction Guidelines

1. **Expanding Rows:**

   - Clicking the caret in a family row expands the detail grid.
   - Users can view and manage members within the expanded detail grid.

2. **Adding Members:**

   - Fill in the "First Name," "Relation," and "Age" fields in the add member form.
   - Click the "Add Member" button to add the member to the grid.

3. **Removing Members:**

   - Click the "Remove" button in the "Actions" column for a specific member to delete them.

4. **Dynamic Updates:**

   - The parent grid’s "No. of Members" column updates immediately when members are added or removed.

5. **API Sync:**
   - Users must explicitly save changes (e.g., via a "Save" button that extracts `rowData`).

---
