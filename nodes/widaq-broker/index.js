const getState = require("../../lib/getState");
const pty = require("node-pty");

const mqttListners = require("./mqttListners");
const httpListners = require("./httpListners");
const handleSchemas = require("./handleSchemas");
module.exports = function (RED) {
    function WiDAQBroker(config) {
        // Get all cofig varibles into the state of the node
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;
        this.topicsObj = {};
        this.inTypes = {};
        this.outTypes = {};
        this.inTypes = {};
        handleSchemas(this);
        mqttListners(this);
        httpListners(RED, this);
    }
    RED.nodes.registerType("widaq-broker", WiDAQBroker, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}