import {defineConfig} from '@playwright/test';
import { config as baseConfig } from '@wordpress-monorepo/e2e';

const config = defineConfig({
    ...baseConfig,
});

export default config;
