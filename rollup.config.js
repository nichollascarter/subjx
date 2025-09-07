import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';
import eslint from '@rollup/plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

// eslint-disable-next-line no-undef
const { NODE_ENV = 'production', LIVE_MODE = 'disable' } = process.env;
const liveMode = LIVE_MODE === 'enable';
const prod = NODE_ENV === 'production';
const libraryName = 'subjx';

const banner = `/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2025
* Karen Sarksyan
* nichollascarter@gmail.com
*/`;

const input = './src/js/index.js';
const dir = 'dist';

let libraryFileName = libraryName;

if (!prod) {
    libraryFileName += '.dev';
}

const plugins = [
    css({
        minify: true,
        output: 'style/subjx.css'
    }),
    eslint({
        exclude: ['node_modules/**', '**.css'],
        throwOnError: prod
    }),
    resolve()
];

const uglifyUMDPlugin = () => (
    terser({
        compress: {
            evaluate: false,
            join_vars: false
        }
    })
);

const babelPlugins = (target) => ([
    babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env'],
        babelHelpers: liveMode ? 'runtime' : 'bundled',
        plugins: liveMode ? [
            ['@babel/plugin-transform-runtime', {
                helpers: true,
                regenerator: true
            }]
        ] : [],
        envName: target
    })
]);

const umdPlugins = [
    ...babelPlugins('cjs'),
    prod && uglifyUMDPlugin()
];

export default [
    ...(prod ? [{
        input,
        output: [{
            dir,
            entryFileNames: `js/${libraryName}.esm.js`,
            format: 'esm',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins('esm'),
            prod && terser()
        ]
    }] : []),
    {
        input,
        output: [{
            dir,
            entryFileNames: `js/${libraryFileName}.common.js`,
            format: 'cjs',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins('cjs'),
            prod && terser()
        ]
    },
    {
        input,
        output: [{
            name: libraryName,
            dir,
            entryFileNames: `js/${libraryFileName}.js`,
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