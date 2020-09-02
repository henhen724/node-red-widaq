const mqtt = require("mqtt");
const getState = require("../../lib/getState");
const bodyParser = require("body-parser");
const { generateKeyPair } = require("crypto");
const pty = require("node-pty");
module.exports = function (RED) {
    function WiDAQBroker(config) {
        // Get all cofig varibles into the state of the node
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;
        this.topicsObj = {};

        //Generate a public and private keys to
        // generateKeyPair((public, private) => {
        //     this.publicKey = public;
        //     this.privateKey = private;
        // });
        // Connect to the Wi DAQ MQTT server
        this.url = this.port ? `mqtt://${this.host}:${this.port}` : `mqtt://${this.host}`;
        this.client = mqtt.connect(this.url, { username: this.credentials.username, password: this.credentials.password });
        const node = this
        this.client.on('connect', () => {
            this.log("Successfully, connected to Wi DAQ MQTT server.");
            node.client.subscribe(node.topicsObj, function (err) {
                if (err) {
                    node.error(err);
                }
            })
        });
        this.client.on('error', (error) => {
            this.error(`There was an issue connecting to the Wi DAQ MQTT server: ${error}`);
        });

        // Set internal Wi DAQ API routes for this computer
        RED.httpNode.use("/widaq*", bodyParser.json());
        // Setup socket.io WebSocket server for SSH connection
        this.ioServer = require("socket.io")(RED.server);
        this.ioServer.on('connection', (socket) => {
            const shell = process.platform === "win32" ? "powershell.exe" : "bash";
            const term = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env,
            });
            term.on('data', (data) => {
                socket.emit('output', data);
            });
            socket.on('input', (input) => {
                try {
                    const inputObj = JSON.parse(input);
                    term.write(inputObj.data + "\r\n");
                } catch (error) {
                    this.error
                }
            });
            socket.on("disconnect", () => {
                term.destroy();
                this.log("bye");
            });
        });
        // The http route to open the web ssh terminal
        RED.httpNode.get("/widaq/ssh", (req, res) => {
            res.sendFile("./pages/terminal.html", { root: __dirname });
        });
        RED.httpNode.get("/widaq*", (req, res) => {
            res.sendFile("./pages/404.html", { root: __dirname });
        });
    }
    RED.nodes.registerType("widaq-broker", WiDAQBroker, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}