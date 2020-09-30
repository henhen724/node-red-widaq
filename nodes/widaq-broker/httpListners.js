const getInfo = require("../../lib/getInfo");

const httpListners = (node, app) => {
    // API routes
    app.get("/widaq/info", (req, res) => {
        res.json(getInfo(node));
    });
    app.post("/widaq/error", (req, res) => {
        node.error(`${req.ip} sent the following error: ${req.body}`);
        res.status(202);
    });
    // HTML pages
    // Removed teporarly for testing security
    // app.get("/widaq/ssh", (req, res) => {
    //     res.sendFile("./pages/terminal.html", { root: __dirname });
    // });
    app.get("/widaq*", (req, res) => {
        res.status(404).sendFile("./pages/404.html", { root: __dirname });
    });
}

module.exports = httpListners