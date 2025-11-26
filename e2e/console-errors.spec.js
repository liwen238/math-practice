import { test, expect } from '@playwright/test';

test.describe('Console Errors Check', () => {
  test('should not have console errors on home page', async ({ page }) => {
    const errors = [];
    
    // Only listen for actual console errors (not warnings)
    page.on('console', msg => {
      // Only capture errors, ignore warnings and logs
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known non-critical errors
        if (!text.includes('React Router Future Flag')) {
          errors.push(text);
        }
      }
    });
    
    // Listen for page errors (JavaScript exceptions)
    page.on('pageerror', error => {
      const message = error.message;
      // Filter out known non-critical errors
      if (!message.includes('React Router Future Flag')) {
        errors.push(message);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Fail test if there are critical errors
    if (errors.length > 0) {
      throw new Error(`Console errors found: ${errors.join(', ')}`);
    }
    
    expect(errors.length).toBe(0);
  });

  test('should not have console errors during session', async ({ page }) => {
    const errors = [];
    
    // Only listen for actual console errors (not warnings)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out known non-critical errors
        if (!text.includes('React Router Future Flag')) {
          errors.push(text);
        }
      }
    });
    
    page.on('pageerror', error => {
      const message = error.message;
      // Filter out known non-critical errors
      if (!message.includes('React Router Future Flag')) {
        errors.push(message);
      }
    });
    
    await page.goto('/');
    await page.getByText('7-8').click();
    await page.getByText('+').click();
    await page.getByRole('button', { name: 'Start Session' }).click();
    
    await expect(page.getByText(/Question 1 of 10/)).toBeVisible();
    
    // Answer a question
    await page.locator('.choice-button').first().click();
    await page.getByRole('button', { name: 'Flip Card' }).click();
    await page.getByRole('button', { name: 'I got it right!' }).click();
    
    await page.waitForTimeout(500);
    
    // Fail test if there are critical errors
    if (errors.length > 0) {
      throw new Error(`Console errors during session: ${errors.join(', ')}`);
    }
    
    expect(errors.length).toBe(0);
  });
});

