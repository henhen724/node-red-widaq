module.exports = function (RED) {
    function WiDAQOut(config) {
        RED.nodes.createNode(this, config);

        this.server = RED.nodes.getNode(config.server);
        this.topic = config.topic;
        this.qos = config.qos;
        this.retain = config.retain;

        if (this.server && this.topic) {
            const node = this;
            node.on('input', (msg) => {
                if (typeof msg.payload !== 'object' || msg.payload === null) {
                    node.error(`All widaq messages must be objects; however, the following message is not:\n\n${msg.payload}`);
                } else {
                    node.server.client.publish(node.topic, JSON.stringify(msg.payload), { qos: node.qos, retain: node.retain });
                }
            });
        } else {
            this.error(`widaq nodes cannot function without having a widaq server.`);
        }
    }
    RED.nodes.registerType("widaq-out", WiDAQOut);
}