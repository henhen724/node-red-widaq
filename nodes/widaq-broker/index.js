const mqttListners = require("./mqttListners");
const httpListners = require("./httpListners");
const socketListners = require("./socketListner");
const formatSchema = require("../../lib/formatSchema");
const getState = require("../../lib/getState");
module.exports = function (RED) {
    function WiDAQBroker(config) {
        // Get all cofig varibles into the state of the node
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;
        this.topicsObj = {};
        this.schema = { in: {}, out: {} };
        mqttListners(this);
        httpListners(RED.httpNode);
        socketListners(RED.server, this);
        new Promise(res => setTimeout(res, 0)).then(() => {
            // After all other nodes have declared
            formatSchema(this.error, this.schema);
            node.client.publish("__widaq_state__", JSON.stringify(getState(this)));
            node.client.on("message", (topic, message) => {
                if (topic === "__widaq_req_state__")
                    node.client.publish("__widaq_state__", JSON.stringify(getState(this)));
            })
        })
    }
    RED.nodes.registerType("widaq-broker", WiDAQBroker, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}