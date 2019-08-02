module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false,
        "ecmaFeatures": {
            globalReturn: true,
            impliedStrict: true,
            arrowFunction: true
        }
    },
    "env": {
        "es6": true,
        "browser": true
    },
    "rules": {
        "indent": ["error", 4],
        "init-declarations": "off",
        "no-console": "warn",
        "no-inline-comments": "off",
        "no-irregular-whitespace": 'error',
        "semi": "error",
        "semi-spacing": "error",
        "padded-blocks": ["error", { "blocks": "never", "classes": "always", "switches": "always" }],
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
    }
};