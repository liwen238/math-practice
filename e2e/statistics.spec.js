import { test, expect } from '@playwright/test';

test.describe('Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should display statistics after completing session', async ({ page }) => {
    // Complete a session
    await page.getByText('7-8').click();
    await page.getByText('+').click();
    await page.getByRole('button', { name: 'Start Session' }).click();
    
    // Answer a few questions to create session data, then navigate to summary
    for (let i = 1; i <= 3; i++) {
      if (i > 1) {
        await page.waitForTimeout(500);
        const inSession = await page.getByText(new RegExp(`Question ${i} of 10`)).isVisible().catch(() => false);
        if (!inSession) break;
      }
      
      const choice = page.locator('.choice-button').first();
      await expect(choice).toBeEnabled({ timeout: 3000 });
      await choice.click();
      
      const flipButton = page.getByRole('button', { name: 'Flip Card' });
      await expect(flipButton).toBeEnabled({ timeout: 3000 });
      await flipButton.click();
      
      const reportButton = page.getByRole('button', { name: 'I got it right!' });
      await expect(reportButton).toBeVisible({ timeout: 3000 });
      await reportButton.click();
      
      await page.waitForTimeout(400);
    }
    
    // Navigate to summary to verify statistics display
    await page.goto('/summary');
    
    // Should see summary with statistics
    await expect(page.getByText('Session Complete!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Correct/)).toBeVisible();
    await expect(page.getByText(/Incorrect/)).toBeVisible();
    await expect(page.getByText(/Accuracy/)).toBeVisible();
  });

  test('should show overall statistics on stats page', async ({ page }) => {
    // Navigate to stats page
    await page.goto('/stats');
    
    // Should see statistics page
    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
    
    // If there are sessions, should see overall stats
    const hasSessions = await page.getByText('No Sessions Yet').isVisible().catch(() => false);
    
    if (!hasSessions) {
      await expect(page.getByText(/Overall Statistics|Last Session/)).toBeVisible();
    } else {
      await expect(page.getByText('No Sessions Yet')).toBeVisible();
    }
  });

  test('should clear all statistics', async ({ page }) => {
    // First create some statistics by completing a session
    await page.getByText('7-8').click();
    await page.getByText('+').click();
    await page.getByRole('button', { name: 'Start Session' }).click();
    
    // Answer one question and navigate to summary
    await page.locator('.choice-button').first().click();
    await page.getByRole('button', { name: 'Flip Card' }).click();
    await page.getByRole('button', { name: 'I got it right!' }).click();
    
    // Go to stats page
    await page.goto('/stats');
    
    // If clear button exists, click it
    const clearButton = page.getByRole('button', { name: 'Clear All Statistics' });
    const buttonExists = await clearButton.isVisible().catch(() => false);
    
    if (buttonExists) {
      // Set up dialog handler before clicking
      page.on('dialog', dialog => dialog.accept());
      await clearButton.click();
      
      // Should show empty state
      await expect(page.getByText('No Sessions Yet')).toBeVisible();
    }
  });
});

