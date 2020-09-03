
const { execSync } = require("child_process");
const { exit } = require('process');
const path = require("path");
const https = require("https");
const fs = require("fs");

try {
    execSync("where npm").toString();
} catch (error) {
    throw new Error("Error: npm is not on the system path. Please add your instalation to the PATH or install npm.");
}

const npmList = execSync("npm list -g node-red").toString();
const lines = npmList.split("\n");
const instalations = []
for (var i = 0; i < lines.length; i++) {
    if (lines[i].includes("node-red"))
        instalations.push(i);
}
if (instalations.length === 0) {
    console.error("Node red is not installed globally.");
    exit(1);
} else if (instalations.length !== 1) {
    console.warn("Warning: Multiple node red instilations found.  Using first one.");
}

const nodeRedPath = lines[instalations[0] - 1];
console.log(`Found node-red folder: ${path.join(nodeRedPath, "/node_modules/node-red")}`);
const aceDir = path.join(nodeRedPath, "/node_modules/node-red/node_modules/@node-red/editor-client/public/vendor/ace");
process.chdir(aceDir);
console.log("Downloading mode-graphqlschema.js file...");
https.get("https://raw.githubusercontent.com/henhen724/node-red-widaq/master/config/mode-graphqlschema.js", res => {
    console.log("Responds Code: ", res.statusCode);
    if (res.statusCode !== 200) throw new Error(`The request to the raw github content site failed.`);
    res.setEncoding("utf-8");
    var fileText = "";
    res.on("data", chunk => {
        fileText += chunk;
    })
    res.on("close", () => {
        fs.writeFile("mode-graphqlschema.js", fileText, (err) => {
            if (err) throw err;
            else console.log("Installation complete.");
        })
    })
});