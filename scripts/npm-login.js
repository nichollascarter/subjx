//@ts-check

const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('request');
const npmLogin = require('npm-cli-login');
const { exec } = require('child_process');

const NPM_REGISTRY = 'http://localhost:4873';

const username = 'test';
const password = 'test';

const addUser = (name, password, registry) => {
    request.put({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: `${registry}/-/user/org.couchdb.user:${name}`,
        json: {
            name,
            password
        }
    }, (error, response, body) => {
        if (!!response && response.statusCode === 201 && !!body && 'ok' in body && 'token' in body && body.ok) {
            const npmrc = path.join(os.homedir(), '.npmrc');
            if (!fs.existsSync(npmrc)) {
                fs.closeSync(fs.openSync(npmrc, 'w'));
            }
            fs.appendFileSync(npmrc, `${registry.substring('http:'.length)}/:_authToken=${body.token}\n`);
            npmLogin(name, password, `${name}@${name}.${name}`, registry);

            exec(`npm --registry ${NPM_REGISTRY} publish`, (err) => {
                if (err) console.log(err);
            });
        } else {
            process.exit(1);
        }
    });
};

addUser(username, password, NPM_REGISTRY);