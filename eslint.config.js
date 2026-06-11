import babelParser from '@babel/eslint-parser';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'dev/**', '**/*.css']
    },
    {
        files: ['src/**/*.js'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env']
                }
            },
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.jest
            }
        },
        rules: {
            'no-const-assign': 'error',
            'no-var': 'error',
            'no-useless-constructor': 'error',
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'init-declarations': 'off',
            'no-undef': 'warn',
            'no-console': 'warn',
            'no-inline-comments': 'off',
            'no-irregular-whitespace': 'error',
            'semi': 'error',
            'semi-spacing': 'error',
            'padded-blocks': ['error', { 'blocks': 'never', 'classes': 'always', 'switches': 'always' }],
            'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
            'comma-dangle': ['error', {
                'arrays': 'never',
                'objects': 'never',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never'
            }],
            'no-trailing-spaces': 'error'
        }
    }
];
