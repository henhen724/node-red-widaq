const pty = require("node-pty");
const socketIO = require("socket.io");
const cookie = require("cookies");
const Iron = require("@hapi/iron");

const TOKEN_NAME = 'wi_daq_token';

const httpListners = (app) => {
    app.get("/widaq/ssh", (req, res) => {
        res.sendFile("./pages/terminal.html", { root: __dirname });
    });
    app.get("/widaq*", (req, res) => {
        res.status(404).sendFile("./pages/404.html", { root: __dirname });
    });
}

module.exports = httpListners