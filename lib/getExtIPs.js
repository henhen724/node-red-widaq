const { networkInterfaces } = require('os');
// TODO: Test which network node-red servers http request to.
const getExpIPs = () => {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }

                results[name].push(net.address);
            }
        }
    }

    return results;
}

const firstIP = (obj) => obj[Object.keys(obj)[0]][0];

const getOneExtIP = () => firstIP(getExpIPs());

module.exports = { getExpIPs, getOneExtIP };