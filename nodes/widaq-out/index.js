module.exports = function (RED) {
    function WiDAQOut(config) {
        RED.nodes.createNode(this, config);

        this.server = RED.nodes.getNode(config.server);
        this.topic = config.topic;
        this.qos = config.qos;
        this.retain = config.retain;
        this.shouldValidate = !!config.shouldValidate;
        this.useType = !!config.useType;
        this.server.schema.out[this.topic] = this.useType ? this.typeDef : null;
        if (this.server) {
            this.status({ fill: "green", shape: "dot", text: "connected" })
            const node = this;
            node.on('input', (msg) => {
                if (typeof msg.payload !== 'object' || msg.payload === null) {
                    node.error(`All widaq messages must be objects; however, the following message is not:\n\n${msg.payload}`);
                } else {
                    node.server.client.publish(node.topic, JSON.stringify(msg.payload), { qos: msg.qos ? msg.qos : node.qos, retain: msg.retain ? msg.retain : node.retain });
                }
            });
        } else {
            this.error(`Widaq nodes cannot function without having a widaq server.`);
            this.status({ fill: "red", shape: "ring", text: "disconnected" });
        }
    }
    RED.nodes.registerType("widaq-out", WiDAQOut);
}