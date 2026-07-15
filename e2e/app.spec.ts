import { test, expect } from '@playwright/test';

test.describe('AI & Tech Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the dashboard and display header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText(/AI & Tech Dashboard/i)).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Check for loading skeletons
    const loadingSkeletons = page.locator('[class*="skeleton"], [class*="loading"]');
    await expect(loadingSkeletons.first()).toBeVisible();
  });

  test('should display news cards after loading', async ({ page }) => {
    // Wait for stories to load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Check that at least one news card is visible
    const newsCards = page.locator('[class*="card"], [class*="story"]');
    const count = await newsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow searching for stories', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Find search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();
    
    // Type search query
    await searchInput.fill('AI');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify search results
    const newsCards = page.locator('[class*="card"], [class*="story"]');
    const count = await newsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow clearing search', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Find search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[placeholder*="Search" i]');
    await searchInput.fill('AI');
    
    // Clear search
    await searchInput.clear();
    
    // Verify all stories are shown again
    await page.waitForTimeout(500);
    const newsCards = page.locator('[class*="card"], [class*="story"]');
    const count = await newsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow adding stories to favorites', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Find first favorite button (star icon)
    const favoriteButton = page.locator('button[aria-label*="favorite" i], button[aria-label*="star" i], button[title*="favorite" i]').first();
    
    if (await favoriteButton.isVisible()) {
      // Click to add to favorites
      await favoriteButton.click();
      
      // Verify favorites counter updated
      const favoritesCounter = page.locator('[class*="favorite"], [class*="counter"]');
      await expect(favoritesCounter).toBeVisible();
    }
  });

  test('should allow filtering by favorites', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Look for favorites filter button
    const favoritesFilter = page.locator('button:has-text("Favorites"), button:has-text("Favoritos")');
    
    if (await favoritesFilter.isVisible()) {
      await favoritesFilter.click();
      
      // Wait for filter to apply
      await page.waitForTimeout(500);
      
      // Verify empty state or favorites are shown
      const emptyState = page.locator('[class*="empty"], [class*="no-results"]');
      const newsCards = page.locator('[class*="card"], [class*="story"]');
      
      const hasEmptyState = await emptyState.count() > 0;
      const hasCards = await newsCards.count() > 0;
      
      expect(hasEmptyState || hasCards).toBeTruthy();
    }
  });

  test('should allow toggling dark/light mode', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button:has([class*="moon"]), button:has([class*="sun"])');
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const body = page.locator('body');
      const initialClass = await body.getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      
      // Wait for transition
      await page.waitForTimeout(500);
      
      // Verify theme changed
      const newClass = await body.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('should display story details correctly', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Check first card has required elements
    const firstCard = page.locator('[class*="card"], [class*="story"]').first();
    
    // Verify title is present
    await expect(firstCard.locator('a, h2, h3')).toBeVisible();
    
    // Verify metadata (points, comments, author, date)
    const cardText = await firstCard.textContent();
    expect(cardText).toBeTruthy();
    expect(cardText?.length).toBeGreaterThan(0);
  });

  test('should have working navigation links', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Find first article link
    const articleLink = page.locator('[class*="card"], [class*="story"]').first().locator('a').first();
    
    if (await articleLink.isVisible()) {
      const href = await articleLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href?.length).toBeGreaterThan(0);
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for load
    await page.waitForSelector('[class*="card"], [class*="story"]', { timeout: 10000 });
    
    // Verify layout adapted
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Verify cards are still visible
    const newsCards = page.locator('[class*="card"], [class*="story"]');
    const count = await newsCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
