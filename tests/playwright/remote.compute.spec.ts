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

test('computes sum with zero', async ({ page }) => {
	await page.getByLabel('Number A').fill('0');
	await page.getByLabel('Number B').fill('7');
	await page.getByRole('button', { name: 'Compute' }).click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(page.getByText('7')).toBeVisible();
});

test('computes sum with both negative numbers', async ({ page }) => {
	await page.getByLabel('Number A').fill('-3');
	await page.getByLabel('Number B').fill('-7');
	await page.getByRole('button', { name: 'Compute' }).click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(page.getByText('-10')).toBeVisible();
});

test('shows validation errors for empty inputs', async ({ page }) => {
	await page.getByRole('button', { name: 'Compute' }).click();

	const errors = page.getByRole('alert');
	await expect(errors).toHaveCount(2);
	await expect(errors.first()).toContainText('expected number');
});

test('button shows pending state during submission', async ({ page }) => {
	await page.getByLabel('Number A').fill('1');
	await page.getByLabel('Number B').fill('2');

	const button = page.getByRole('button', { name: 'Compute' });
	await button.click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(button).toHaveText('Compute');
	await expect(button).toBeEnabled();
});

test('result updates on new submission', async ({ page }) => {
	await page.getByLabel('Number A').fill('2');
	await page.getByLabel('Number B').fill('3');
	await page.getByRole('button', { name: 'Compute' }).click();
	await expect(page.getByText('5')).toBeVisible();

	await page.getByLabel('Number A').fill('10');
	await page.getByLabel('Number B').fill('20');
	await page.getByRole('button', { name: 'Compute' }).click();

	await expect(page.getByText('Result:')).toBeVisible();
	await expect(page.getByText('30')).toBeVisible();
});
