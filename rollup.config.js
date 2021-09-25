import path from 'path';
import fs from 'fs-extra';
import config from './package.json';
import copy from 'rollup-plugin-copy';
import { terser as minify } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
//import reload from 'rollup-plugin-livereload'

import FrontendClassic from './src/frontend/classic/rollup.config.ts';
import FrontendJS from './src/frontend/sample-js/rollup.config.ts';
import FrontendReact from './src/frontend/sample-react/rollup.config.ts';
import FrontendSvelte from './src/frontend/sample-svelte/rollup.config.ts';
import FrontendVue from './src/frontend/sample-vue/rollup.config.ts';

const outputDirectory = 'build.web';

const isDevelopment = process.env.ROLLUP_WATCH === 'true';
const isProduction = !isDevelopment;

/*
function launch(options) {
    return {
        name: 'plugin-name',
        load() { ... },
        resolveId() { ... },
        generateBundle() { ... },
    };
}
*/

(function buildWebsiteIndex() {
    const directory = path.join('src', 'engine', 'websites');
    const entries = fs.readdirSync(directory);
    const content = entries
        .filter(entry => /^[a-zA-Z0-9]+\.ts$/.test(entry))
        .map(file => path.basename(file, '.ts'))
        .map(name => `export { default as ${name} } from './${name}';`)
        .join('\n');
    fs.writeFileSync(path.join(directory, '_index.ts'), '// AUTO-GENERATED\n' + content);
})();

const configApp = {
    input: {
        'index': 'src/index.ts'
    },
    output: [
        {
            dir: outputDirectory,
            format: 'es',
            sourcemap: true
        }
    ],
    external: [
        ...Object.keys(config.dependencies || {})
    ],
    plugins: [
        copy({
            targets: [
                { src: 'src/*.html', dest: outputDirectory },
                { src: 'src/img/**/*', dest: outputDirectory + '/img' }
            ]
        }),
        typescript(),
        isProduction && minify(),
        isDevelopment && serve({
            contentBase: outputDirectory,
            port: 5000
        })/*,
        reload({
            watch: outputDirectory
        }),*/
        //isDevelopment && launch({})
    ],
    preserveEntrySignatures: 'strict'
};

export default [
    configApp,
    FrontendClassic,
    //FrontendJS,
    //FrontendReact,
    //FrontendSvelte,
    //FrontendVue
];