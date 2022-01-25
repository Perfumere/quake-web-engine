import { Plugin, defineConfig } from 'vite';
import { resolve } from 'path';

const wgslImported: Plugin = {
    name: 'vite-plugin-wgsl-imported',
    transform(code: string, id: string) {
        if (!id.endsWith('.wgsl')) {
            return null;
        }

        return `export default ${JSON.stringify(code)}`
    }
};

export default defineConfig({
    root: resolve(__dirname, '../src/application'),
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        }
    },
    build: {
        outDir: '../../build/application'
    },

    json: {
        stringify: false
    },

    plugins: [ wgslImported ]
});
