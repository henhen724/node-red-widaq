const mqttListners = require("./mqttListners");
const httpListners = require("./httpListners");
const socketListners = require("./socketListner");
const formatSchema = require("../../lib/formatSchema");
const getInfo = require("../../lib/getInfo");
module.exports = function (RED) {
    function WiDAQBroker(config) {
        // Get all cofig varibles into the state of the node
        RED.nodes.createNode(this, config);
        this.host = config.host;
        this.port = config.port;
        this.topicsObj = { __widaq_req_info__: { qos: 0 }, __public_key__: { qos: 0 } };
        this.public_key = null;
        this.schema = { in: {}, out: {} };
        mqttListners(this);
        httpListners(this, RED.httpNode);
        socketListners(this, RED.server);
        const node = this
        new Promise(res => setTimeout(res, 0)).then(() => {
            // After all other nodes have declared
            formatSchema(node.error, node.schema);
            node.client.publish("__widaq_info__", JSON.stringify(getInfo(this, RED.server)));
            node.client.on("message", (topic, message) => {
                switch (topic) {
                    case "__widaq_req_info__":
                        node.client.publish("__widaq_info__", JSON.stringify(getInfo(this, RED.server)));
                    case "__public_key__":
                        this.public_key = message.toString();
                }
            })
        });
        node.on('close', () => {
            node.client.publish("__widaq_disconnect__", JSON.stringify(getInfo(this, RED.server)));
        })
    }
    RED.nodes.registerType("widaq-broker", WiDAQBroker, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}