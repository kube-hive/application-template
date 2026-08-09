import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('page renders the compute form', async ({ page }) => {
	await expect(page.locator('[data-slot="card-title"]')).toHaveText('Compute');
	await expect(page.getByLabel('Number A')).toBeVisible();
	await expect(page.getByLabel('Number B')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Compute' })).toBeVisible();
});

test('computes sum of two positive numbers', async ({ page }) => {
	await page.getByLabel('Number A').fill('3');
	await page.getByLabel('Number B').fill('5');
	await page.getByRole('button', { name: 'Compute' }).click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(page.getByText('8')).toBeVisible();
});

test('computes sum with negative numbers', async ({ page }) => {
	await page.getByLabel('Number A').fill('-10');
	await page.getByLabel('Number B').fill('4');
	await page.getByRole('button', { name: 'Compute' }).click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(page.getByText('-6')).toBeVisible();
});
