import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema/*',
    out: './drizzle',
    driver: 'better-sqlite',
} satisfies Config;