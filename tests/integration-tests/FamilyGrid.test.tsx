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
    }) => {});

    test('Should prevent adding a family with a duplicate name (case-insensitive)', async ({
      page,
    }) => {});

    test('Should delete selected families using the "Delete Selected Families" button', async ({
      page,
    }) => {});

    test('Should reset the grid to the initial state using the "Reset Changes" button', async ({
      page,
    }) => {});
  });

  // Tests for Parent Grid
  test.describe('Parent Grid (Family Grid)', () => {
    test('Should load the initial grid with families and members correctly', async ({
      page,
    }) => {});

    test('Should display family names and the correct number of members', async ({
      page,
    }) => {});

    test('Should not allow direct editing of family names or member counts', async ({
      page,
    }) => {});

    test('Should expand a family row to display the detail grid', async ({
      page,
    }) => {});
  });

  // Tests for Sub Grid
  test.describe('Sub Grid (Family Detail Grid)', () => {
    test('Should display the correct members for a family', async ({
      page,
    }) => {});

    test('Should add a new member with valid input', async ({ page }) => {});

    test('Should append the family name to the new member name automatically', async ({
      page,
    }) => {});

    test('Should prevent adding a duplicate member name (case-insensitive)', async ({
      page,
    }) => {});

    test('Should prevent adding a member with missing fields', async ({
      page,
    }) => {});

    test('Should remove a member using the "Remove" button', async ({
      page,
    }) => {});

    test('Should update the parent grid "No. of Members" column after adding/removing members', async ({
      page,
    }) => {});

    test('Should not allow direct editing of member fields in the detail grid', async ({
      page,
    }) => {});
  });
});
