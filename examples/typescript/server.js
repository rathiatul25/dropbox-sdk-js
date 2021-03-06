Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const path = require("path");
var rollup = require('rollup-endpoint');
var babel = require('rollup-plugin-babel');
var replace = require('rollup-plugin-replace');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
const app = express();
const port = process.env.PORT || 8081;
const env = process.env.NODE_ENV;
const plugins = [
    nodeResolve({
        jsnext: true
    }),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        plugins: ["external-helpers"],
        presets: [
            ["latest", {
                    "es2015": {
                        "modules": false
                    },
                    "es2016": false,
                    "es2017": false
                }]
        ],
        env: {
            "commonjs": {
                "plugins": [
                    ["transform-es2015-modules-commonjs", { "loose": true }]
                ]
            }
        }
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs()
];
app.get('/__build__/Dropbox-sdk.min.js', rollup.serve({
    entry: path.resolve(__dirname, '../../src/index.js'),
    plugins: plugins,
    generateOptions: {
        format: 'umd',
        moduleName: 'Dropbox'
    }
}));
app.get('/__build__/DropboxTeam-sdk.min.js', rollup.serve({
    entry: path.resolve(__dirname, '../../src/team/index.js'),
    plugins: plugins,
    generateOptions: {
        format: 'umd',
        moduleName: 'DropboxTeam'
    }
}));
fs.readdirSync(__dirname).forEach(function (file) {
    if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
        app.use(`/${file}`, express.static(path.resolve(__dirname, file)));
    }
});
app.use('/__dist__', express.static(path.resolve(__dirname, '../../dist')));
app.use('/', express.static(__dirname));
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});
//# sourceMappingURL=server.js.map
