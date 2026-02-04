<?php
/**
 * Shared test utilities for the WordPress monorepo.
 *
 * This file contains common test helpers, base classes, and utilities
 * that can be used across themes and plugins.
 */

namespace Bcgov\WordPressMonorepo\Tests;

/**
 * Base test case for WordPress tests.
 */
class TestCase extends \WP_UnitTestCase {
    /**
     * Set up before each test.
     */
    public function setUp(): void {
        parent::setUp();
        // Common setup code here
    }

    /**
     * Tear down after each test.
     */
    public function tearDown(): void {
        // Common teardown code here
        parent::tearDown();
    }
}

/**
 * Helper functions for test data.
 */
class TestHelpers {
    /**
     * Create a test user.
     */
    public static function createTestUser($role = 'subscriber') {
        return wp_create_user('testuser', 'password', 'test@example.com');
    }

    /**
     * Clean up test data.
     */
    public static function cleanupTestData() {
        // Cleanup code
    }
}