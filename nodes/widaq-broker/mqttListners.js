const mqtt = require("mqtt");

const mqttListners = (node) => {
    node.url = node.port ? `mqtt://${node.host}:${node.port}` : `mqtt://${node.host}`;
    node.client = mqtt.connect(node.url, { username: node.credentials.username, password: node.credentials.password });
    node.client.on('connect', () => {
        node.log("Successfully, connected to Wi DAQ MQTT server.");
        node.client.subscribe(node.topicsObj, function (err) {
            if (err) {
                node.error(err);
            }
        });
    });
    node.client.on('error', (error) => {
        node.error(`There was an issue connecting to the Wi DAQ MQTT server: ${error}`);
    });
}

module.exports = mqttListners