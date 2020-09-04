const bodyParser = require("body-parser");

const httpListners = (RED, node) => {
    // Set internal Wi DAQ API routes for node computer
    RED.httpNode.use("/widaq*", bodyParser.json());
    // Setup socket.io WebSocket server for SSH connection
    node.ioServer = require("socket.io")(RED.server);
    node.ioServer.on('connection', (socket) => {
        const shell = process.platform === "win32" ? "powershell.exe" : "bash";
        const term = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env,
        });
        term.on('data', (data) => {
            socket.emit('output', data);
        });
        socket.on('input', (input) => {
            try {
                const inputObj = JSON.parse(input);
                term.write(inputObj.data + "\r\n");
            } catch (error) {
                node.error
            }
        });
        socket.on("disconnect", () => {
            term.destroy();
            node.log("bye");
        });
    });
    RED.httpNode.get("/widaq/ssh", (req, res) => {
        res.sendFile("./pages/terminal.html", { root: __dirname });
    });
    RED.httpNode.get("/widaq*", (req, res) => {
        res.sendFile("./pages/404.html", { root: __dirname });
    });
}

module.exports = httpListners