module.exports = {
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/github",
        "@semantic-release/changelog",
        "@semantic-release/npm",
        ["@semantic-release/release-notes-generator", {
            "parserOpts": {
                "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
            },
            "writerOpts": {
                "commitsSort": ["subject", "scope"]
            }
        }],
        ["@semantic-release/git", {
            "assets": ["dist/", "package.json", "CHANGELOG.md"],
            "message": "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}"
        }]
    ],
    branches: [
        'master',
        {
            name: 'staging',
            prerelease: 'rc'
        }
    ]
};
