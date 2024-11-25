/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
// import { families } from '../../src/mocks/Family';

test.describe('FamilyTS Grid Tests', () => {
  test.beforeEach(async ({ page }) => {
    // This is a note about how you could mock the API response
    // page.route('http://localhost:3001/families', async (route) => {
    //   const request = route.request();
    //   const method = await request.method();
    //   const postData = await request.postDataJSON();

    //   await route.fulfill({
    //     status: 200,
    //     contentType: 'application/json',
    //     body: JSON.stringify(families),
    //   });
    // });

    await page.goto('http://localhost:3000');
  });

  // Tests for Page Elements
  test.describe('Page Elements', () => {
    test('Should allow adding a new family with a valid name', async ({
      page,
    }) => {
      const allDataRows = await page.locator(
        '.ag-center-cols-container .ag-row'
      );
      await expect(allDataRows).toHaveCount(10);

      const addFamilyInput = await page.getByPlaceholder(
        'Enter Family Last Name'
      );

      await addFamilyInput.fill('Long');
      await page.getByRole('button', { name: 'Add Family' }).click();

      const firstDataRow = await page
        .locator('.ag-center-cols-container .ag-row')
        .first();
      await expect(firstDataRow).toBeVisible();

      await expect(allDataRows).toHaveCount(11);
      await expect(page.locator('.ag-center-cols-container')).toContainText(
        'Long'
      );
    });

    test('Should prevent adding a family with a duplicate name (case-insensitive)', async ({
      page,
    }) => {
      const allDataRows = await page.locator(
        '.ag-center-cols-container .ag-row'
      );
      await expect(allDataRows).toHaveCount(10);

      const addFamilyInput = await page.getByPlaceholder(
        'Enter Family Last Name'
      );

      await addFamilyInput.fill('lee');

      await page.getByRole('button', { name: 'Add Family' }).click();

      await expect(allDataRows).toHaveCount(10);
    });

    test('Should delete selected families using the "Delete Selected Families" button', async ({
      page,
    }) => {
      const rowCheckboxes = page.locator(
        '.ag-center-cols-container .ag-row .ag-checkbox-input'
      );

      await expect(rowCheckboxes).toHaveCount(10);

      await rowCheckboxes.nth(0).click();
      await rowCheckboxes.nth(1).click();

      await expect(rowCheckboxes.nth(0)).toBeChecked();
      await expect(rowCheckboxes.nth(1)).toBeChecked();

      page
        .getByRole('button', {
          name: 'Delete Selected Families',
        })
        .click();

      const allDataRows = page.locator('.ag-center-cols-container .ag-row');
      await expect(allDataRows).toHaveCount(8);
    });

    test('Should reset the grid to the initial state using the "Reset Changes" button', async ({
      page,
    }) => {
      const rowCheckboxes = page.locator(
        '.ag-center-cols-container .ag-row .ag-checkbox-input'
      );

      await expect(rowCheckboxes).toHaveCount(10);

      await rowCheckboxes.nth(0).click();
      await rowCheckboxes.nth(1).click();

      await expect(rowCheckboxes.nth(0)).toBeChecked();
      await expect(rowCheckboxes.nth(1)).toBeChecked();

      page
        .getByRole('button', {
          name: 'Delete Selected Families',
        })
        .click();

      const allDataRows = page.locator('.ag-center-cols-container .ag-row');
      await expect(allDataRows).toHaveCount(8);

      page.getByRole('button', { name: 'Reset Changes' }).click();

      await expect(allDataRows).toHaveCount(10);
    });
  });

  // Tests for Parent Grid
  test.describe('Parent Grid (Family Grid)', () => {
    test('Should load the initial grid with families and members correctly', async ({
      page,
    }) => {
      const allDataRows = await page.locator(
        '.ag-center-cols-container .ag-row'
      );
      await expect(allDataRows).toHaveCount(10);
    });

    test('Should display family names and the correct number of members', async ({
      page,
    }) => {
      const firstRow = page
        .locator('.ag-center-cols-container .ag-row')
        .first();

      const familyNameCell = firstRow.locator('[col-id="name"]');
      await expect(familyNameCell).toHaveText('Smith Family');

      const membersCountCell = firstRow.locator('[col-id="memberCount"]');
      await expect(membersCountCell).toHaveText('4');
    });

    test('Should not allow direct editing of family names or member counts', async ({
      page,
    }) => {
      const firstRow = page
        .locator('.ag-center-cols-container .ag-row')
        .first();

      const familyNameCell = firstRow.locator('[col-id="name"]');

      await familyNameCell.dblclick();

      const familyNameInput = familyNameCell.locator('input');
      await expect(familyNameInput).not.toBeVisible();

      const memberCountCell = firstRow.locator('[col-id="memberCount"]');

      await memberCountCell.dblclick();

      const memberCountInput = memberCountCell.locator('input');
      await expect(memberCountInput).not.toBeVisible();
    });

    test('Should expand a family row to display the detail grid', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();
    });
  });

  // Tests for Sub Grid
  test.describe('Sub Grid (Family Detail Grid)', () => {
    test('Should display the correct members for a family', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      const firstRow = await subGridRows.first();

      const relationCell = firstRow.locator('[col-id="relation"]');
      await expect(relationCell).toHaveText('Father');

      const nameCell = firstRow.locator('[col-id="name"]');
      await expect(nameCell).toHaveText('John Smith');

      const ageCell = firstRow.locator('[col-id="age"]');
      await expect(ageCell).toHaveText('40');
    });

    test('Should add a new member with valid input', async ({ page }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      await page.getByPlaceholder('First Name').fill('Erica');
      await page.getByPlaceholder('Relation').fill('Daughter');
      await page.getByPlaceholder('Age').fill('8');

      await page.getByRole('button', { name: 'Add Member' }).click();

      await expect(subGridRows).toHaveCount(5);

      const newRow = subGridRows.last();
      await expect(newRow.locator('[col-id="name"]')).toContainText('Erica');
      await expect(newRow.locator('[col-id="relation"]')).toContainText(
        'Daughter'
      );
      await expect(newRow.locator('[col-id="age"]')).toContainText('8');
    });

    test('Should append the family name to the new member name automatically', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      await page.getByPlaceholder('First Name').fill('Erica');
      await page.getByPlaceholder('Relation').fill('Daughter');
      await page.getByPlaceholder('Age').fill('8');

      await page.getByRole('button', { name: 'Add Member' }).click();

      await expect(subGridRows).toHaveCount(5);

      const newRow = subGridRows.last();
      await expect(newRow.locator('[col-id="name"]')).toContainText(
        'Erica Smith'
      );
      await expect(newRow.locator('[col-id="relation"]')).toContainText(
        'Daughter'
      );
      await expect(newRow.locator('[col-id="age"]')).toContainText('8');
    });

    test('Should prevent adding a duplicate member name (case-insensitive)', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      await page.getByPlaceholder('First Name').fill('john');
      await page.getByPlaceholder('Relation').fill('Son');
      await page.getByPlaceholder('Age').fill('13');

      await page.getByRole('button', { name: 'Add Member' }).click();

      await expect(subGridRows).toHaveCount(4);
    });

    test('Should prevent adding a member with missing fields', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      await page.getByPlaceholder('First Name').fill('Derek');
      await page.getByPlaceholder('Age').fill('13');

      await page.getByRole('button', { name: 'Add Member' }).click();

      await expect(subGridRows).toHaveCount(4);
    });

    test('Should remove a member using the "Remove" button', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      const firstRow = await subGridRows.first();

      await firstRow.getByRole('button', { name: 'Remove' }).click();

      await expect(subGridRows).toHaveCount(3);
    });

    test('Should update the parent grid "No. of Members" column after adding/removing members', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      await page.getByPlaceholder('First Name').fill('Erica');
      await page.getByPlaceholder('Relation').fill('Daughter');
      await page.getByPlaceholder('Age').fill('8');

      await page.getByRole('button', { name: 'Add Member' }).click();

      await expect(subGridRows).toHaveCount(5);

      const firstRow = page
        .locator('.ag-center-cols-container .ag-row')
        .first();

      const membersCountCell = firstRow.locator('[col-id="memberCount"]');
      await expect(membersCountCell).toHaveText('5');
    });

    test('Should not allow direct editing of member fields in the detail grid', async ({
      page,
    }) => {
      await page.locator('.ag-row .ag-group-contracted').first().click();

      const subGrid = page.locator('.ag-row-level-1');
      await expect(subGrid).toBeVisible();

      const subGridRows = await page.locator(
        '.ag-row-level-1 .ag-center-cols-container .ag-row'
      );
      await expect(subGridRows).toHaveCount(4);

      const firstRow = await subGridRows.first();

      const relationCell = firstRow.locator('[col-id="relation"]');
      await relationCell.dblclick();
      const relationInput = relationCell.locator('input');
      await expect(relationInput).not.toBeVisible();

      const nameCell = firstRow.locator('[col-id="name"]');
      await nameCell.dblclick();
      const nameInput = nameCell.locator('input');
      await expect(nameInput).not.toBeVisible();

      const ageCell = firstRow.locator('[col-id="age"]');
      await ageCell.dblclick();
      const ageInput = ageCell.locator('input');
      await expect(ageInput).not.toBeVisible();
    });
  });
});
