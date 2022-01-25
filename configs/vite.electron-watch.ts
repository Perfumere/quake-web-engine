import { resolve } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';

export default defineConfig({
    mode: 'development',
    root: resolve(__dirname, '../src/electron'),
    build: {
        emptyOutDir: true,
        minify: false,
        outDir: '../../build/electron',
        lib: {
            entry: 'main.ts',
            formats: ['cjs']
        },
        rollupOptions: {
            external: [
                'electron',
                'electron-nightly',
                ...builtinModules
            ],
            output: {
                entryFileNames: '[name].cjs',
            }
        }
    }
});
