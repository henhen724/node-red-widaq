const { getOneExtIP } = require("./getExtIPs");
const getState = (node) => {
    return {
        ip: getOneExtIP(),
        schema: node.schema,

    }
}

module.exports = getState;