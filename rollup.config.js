
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

// eslint-disable-next-line no-undef
const { NODE_ENV = 'production', LIVE_MODE = 'disable' } = process.env;
const liveMode = LIVE_MODE || 'disable';
const prod = NODE_ENV === 'production';
let libraryName = 'subjx';

const banner = `/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2021
* Karen Sarksyan
* nichollascarter@gmail.com
*/`;

if (!prod) {
    libraryName += '.dev';
}

const plugins = [
    postcss({
        minimize: true,
        extract: 'dist/style/subjx.css'
    }),
    eslint({
        exclude: 'node_modules/**',
        throwOnError: prod
    }),
    resolve(),
    ...(!prod && (liveMode === 'enable')
        ? [
            serve(['public', 'dist']),
            livereload('dist')
        ]
        : []
    )
];

const uglifyPlugin = () => {
    return uglify({
        compress:
        {
            evaluate: false
        },
        output: {
            preamble: banner
        }
    });
};

const uglifyESMPlugin = () => {
    return terser();
};

export default [
    {
        input: './src/js/index.js',
        output: [{
            file: `dist/js/${libraryName}.esm.js`,
            format: 'esm',
            banner
        },
        {
            file: `dist/js/${libraryName}.common.js`,
            format: 'cjs',
            banner
        }],
        plugins: [
            ...plugins,
            prod && uglifyESMPlugin()
        ]
    },
    {
        input: './src/js/index.js',
        output: [{
            name: 'subjx',
            file: `dist/js/${libraryName}.js`,
            format: 'umd',
            banner
        }],
        plugins: [
            ...plugins,
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-env']
            }),
            prod && uglifyPlugin()
        ]
    }
];