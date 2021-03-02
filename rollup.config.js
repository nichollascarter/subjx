
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
const liveMode = LIVE_MODE === 'enable';
const prod = NODE_ENV === 'production';
const libraryName = 'subjx';

const banner = `/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2021
* Karen Sarksyan
* nichollascarter@gmail.com
*/`;

const input = './src/js/index.js';
let libraryFileName = libraryName;

if (!prod) {
    libraryFileName += '.dev';
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
    resolve()
];

const uglifyPlugin = () => (
    uglify({
        compress:
        {
            evaluate: false
        },
        output: {
            preamble: banner
        }
    })
);

const uglifyESMPlugin = () => terser();

const babelPlugins = [
    babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
    })
];

const umdPlugins = [
    ...babelPlugins,
    prod && uglifyPlugin()
];

export default [
    ...(prod ? [{
        input,
        output: [{
            file: `dist/js/${libraryName}.esm.js`,
            format: 'esm',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins
        ]
    }] : []),
    {
        input,
        output: [{
            file: `dist/js/${libraryFileName}.common.js`,
            format: 'cjs',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins,
            prod && uglifyESMPlugin()
        ]
    },
    {
        input,
        output: [{
            name: libraryName,
            file: `dist/js/${libraryFileName}.js`,
            format: 'umd',
            banner
        }],
        plugins: [
            ...plugins,
            ...umdPlugins
        ]
    },
    ...(
        liveMode
            ? [{
                input,
                output: [{
                    name: libraryName,
                    file: `public/${libraryFileName}.js`,
                    format: 'umd',
                    banner
                }],
                plugins: [
                    ...plugins,
                    serve(['public', 'dist']),
                    livereload('dist'),
                    ...umdPlugins
                ]
            }]
            : []
    )
];