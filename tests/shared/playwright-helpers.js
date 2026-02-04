/**
 * Shared Playwright test utilities for the WordPress monorepo.
 *
 * Common helpers for e2e tests across themes and plugins.
 */

import { expect } from '@playwright/test';

/**
 * Common page interactions.
 */
export class PageHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a page and wait for load.
   */
  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if element is visible.
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Take a screenshot with timestamp.
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }
}

/**
 * WordPress-specific helpers.
 */
export class WordPressHelpers extends PageHelpers {
  /**
   * Log in to WordPress admin.
   */
  async login(username = 'admin', password = 'password') {
    await this.goto('/wp-admin');
    await this.page.fill('#user_login', username);
    await this.page.fill('#user_pass', password);
    await this.page.click('#wp-submit');
    await expect(this.page).toHaveURL(/\/wp-admin/);
  }

  /**
   * Activate a theme.
   */
  async activateTheme(themeSlug) {
    await this.goto('/wp-admin/themes.php');
    await this.page.click(`[data-slug="${themeSlug}"] .activate`);
    await expect(this.page.locator('.notice-success')).toBeVisible();
  }
}