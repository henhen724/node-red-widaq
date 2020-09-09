const pty = require("node-pty");
const socketIO = require("socket.io");
const cookie = require("cookies");
const Iron = require("@hapi/iron");

const TOKEN_NAME = 'wi_daq_token';

const socketListners = (server, node) => {
    // Setup socket.io WebSocket server for SSH connection
    node.ioServer = socketIO.listen(server);
    // node.ioServer.use(async (socket, next) => {
    //     const cookiesStr = socket.handshake.headers.cookie;
    //     const cookies = cookie.parse(cookiesStr);
    //     if (!cookies[TOKEN_NAME]) next(new Error("not signed into widaq"));
    //     const session = await Iron.unseal(cookies[TOKEN_NAME], node.TOKEN_SECRET, Iron.defaults);
    //     const expiresAt = session.createdAt + session.maxAge * 1000

    //     if (Date.now() < expiresAt) {
    //         next();
    //     } else {
    //         next(new Error("widaq sign in expired"));
    //     }
    // });
    node.ioServer.on('connection', (socket) => {
        const shell = process.platform === "win32" ? "powershell.exe" : "bash";
        const term = pty.spawn(shell, [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env,
        });
        term.onData((data) => {
            socket.emit('output', data);
        });
        socket.on('input', (data) => {
            term.write(data);
        });
        socket.on("disconnect", () => {
            term.destroy();
        });
    });
}

module.exports = socketListners;