import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	tsconfig: 'tsconfig.build.json',
	outDir: 'dist',
});
