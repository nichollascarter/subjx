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
        "browser": true,
        "jest": true
    },
    "rules": {
        "no-const-assign": "error",
        "no-var": "error",
        "no-useless-constructor": "error",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "init-declarations": "off",
        "no-undef": "warn",
        "no-console": "warn",
        "no-inline-comments": "off",
        "no-irregular-whitespace": 'error',
        "semi": "error",
        "semi-spacing": "error",
        "padded-blocks": ["error", { "blocks": "never", "classes": "always", "switches": "always" }],
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "never"
        }],
        "no-trailing-spaces": "error"
    }
};