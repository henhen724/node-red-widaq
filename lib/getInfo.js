const { getOneExtIP } = require("./getExtIPs");
const os = require("os");
const getInfo = (node, server) => {
    return {
        ip: getOneExtIP(),
        port: server.address().port,
        secure: false,
        name: os.hostname(),
        platform: os.platform(),
        osName: os.type(),
        deviceSchema: node.schema,
    }
}

module.exports = getInfo;