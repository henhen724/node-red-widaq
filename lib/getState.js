const getExtIPs = require("./getExtIPs");
const getState = (RED, widaqBroker) => {
    const expIPs = getExtIPs();
    return {
        ip: expIPs[Object.keys(expIPs)[0]][0]
    }
}

module.exports = getState;