const mqttListners = require("./mqttListners");
const httpListners = require("./httpListners");
const formatSchema = require("../../lib/formatSchema");
module.exports = function (RED) {
    function WiDAQBroker(config) {
        // Get all cofig varibles into the state of the node
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;
        this.topicsObj = {};
        this.schema = { in: {}, out: {} };
        mqttListners(this);
        httpListners(RED, this);
        new Promise(res => setTimeout(res, 0)).then(() => {
            // After all other nodes have declared
            formatSchema(this, this.schema);
        })
    }
    RED.nodes.registerType("widaq-broker", WiDAQBroker, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}