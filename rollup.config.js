import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const libraryName = 'subjx';

const { NODE_ENV = 'production', LIVE_MODE = 'disable' } = process.env;
const liveMode = LIVE_MODE === 'enable';

const production = NODE_ENV === 'production';
const development = NODE_ENV === 'development';

const banner = `/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2025
* Karen Sarksyan
* nichollascarter@gmail.com
*/`;

const input = './src/js/bundle.ts';
const umdInput = './src/js/index.umd.ts';
const dir = 'dist';
const extensions = ['.js', '.ts'];

let libraryFileName = libraryName;

if (development) {
    libraryFileName += '.dev';
}

const plugins = [
    css({
        minify: true,
        output: 'style/subjx.css'
    }),
    resolve({ extensions })
];

const babelPlugins = (target) => ([
    babel({
        exclude: 'node_modules/**',
        extensions,
        presets: ['@babel/preset-env'],
        babelHelpers: 'bundled',
        envName: target
    })
]);

const umdPlugins = [
    ...babelPlugins('cjs'),
    production && terser({
        compress: {
            evaluate: false,
            join_vars: false
        }
    })
];

const bundleConfigs = [
    ...(production ? [{
        input,
        output: [{
            dir,
            entryFileNames: `js/${libraryName}.esm.js`,
            format: 'esm',
            exports: 'named',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins('esm'),
            terser()
        ]
    }] : []),
    {
        input,
        output: [{
            dir,
            entryFileNames: `js/${libraryFileName}.common.js`,
            format: 'cjs',
            exports: 'named',
            banner
        }],
        plugins: [
            ...plugins,
            ...babelPlugins('cjs'),
            production && terser()
        ]
    },
    {
        input: umdInput,
        output: [{
            name: libraryName,
            dir,
            entryFileNames: `js/${libraryFileName}.js`,
            format: 'umd',
            exports: 'default',
            banner
        }],
        plugins: [
            ...plugins,
            ...umdPlugins
        ]
    }
];

export default [
    ...(
        liveMode
            ? [{
                input: umdInput,
                output: [{
                    name: libraryName,
                    file: `dev/${libraryName}.js`,
                    format: 'umd',
                    exports: 'default',
                    banner
                }],
                plugins: [
                    css({
                        output: 'subjx.css'
                    }),
                    resolve({ extensions }),
                    babel({
                        exclude: 'node_modules/**',
                        extensions,
                        presets: ['@babel/preset-env'],
                        babelHelpers: 'runtime',
                        plugins: [
                            ['@babel/plugin-transform-runtime', {
                                helpers: true,
                                regenerator: true
                            }]
                        ],
                        envName: 'cjs',
                    }),
                    serve(['public', 'dev']),
                    livereload('public', 'dev')
                ]
            }]
            : bundleConfigs
    )
];