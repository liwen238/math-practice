import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should navigate between pages using navigation bar', async ({ page }) => {
    // Start at home
    await expect(page.getByText('Math Practice Cards')).toBeVisible();
    
    // Navigate to Statistics
    await page.getByRole('link', { name: 'Statistics' }).click();
    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
    
    // Navigate to Review Wrong
    await page.getByRole('link', { name: 'Review Wrong' }).click();
    await expect(page.getByText('Review Wrong Questions')).toBeVisible();
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByText('Math Practice Cards')).toBeVisible();
  });

  test('should highlight active navigation link', async ({ page }) => {
    // Home should be active initially
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toHaveClass(/active/);
    
    // Navigate to stats
    await page.getByRole('link', { name: 'Statistics' }).click();
    
    // Stats link should be active
    const statsLink = page.getByRole('link', { name: 'Statistics' });
    await expect(statsLink).toHaveClass(/active/);
    
    // Home link should not be active
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('should not show navigation on session page', async ({ page }) => {
    // Setup a session
    await page.getByText('7-8').click();
    await page.getByText('+').click();
    await page.getByRole('button', { name: 'Start Session' }).click();
    
    // Navigation should not be visible
    await expect(page.getByRole('link', { name: 'Home' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Statistics' })).not.toBeVisible();
  });
});

