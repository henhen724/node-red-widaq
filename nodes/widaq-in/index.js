module.exports = function (RED) {
    function WiDAQIn(config) {
        RED.nodes.createNode(this, config);

        this.server = RED.nodes.getNode(config.server);
        this.topic = config.topic;
        this.qos = config.qos ? config.qos : 0;
        this.shouldValidate = !!config.shouldValidate;
        this.useType = !!config.useType;
        this.server.inTypes[this.topic] = this.useType ? this.typeDef : null;
        if (this.server) {
            this.server.topicsObj[this.topic] = { qos: this.qos };
            const node = this;
            this.server.client.on("message", (msgTopic, message, packet) => {
                if (msgTopic === node.topic) {
                    var msgObj = { error: "Message failed to parse.", message };
                    try {
                        msgObj = JSON.parse(message);
                    } catch (error) {
                        node.error(`An error occured while trying to JSON.parse the following message for topic ${msgTopic}:\n\n${message}\n\nSee full trace:\n`);
                        node.error(error);
                    }
                    node.send({ payload: msgObj, topic: msgTopic, qos: node.qos, retain: packet.retain });
                }
            })
        } else {
            this.error(`widaq nodes cannot function without having a widaq server.`);
        }
    }
    RED.nodes.registerType("widaq-in", WiDAQIn);
}