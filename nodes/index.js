module.exports = (RED) => {
    require("./widaq-broker/index")(RED);
    require("./widaq-in/index")(RED);
    require("./widaq-out/index")(RED);
}