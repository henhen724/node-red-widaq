const httpListners = require("../nodes/widaq-broker/httpListners");
const http = require("http");
const request = require("supertest");
const express = require("express");
const app = express();
const server = http.Server(app);

describe("HTTP and WS tests", () => {
    beforeAll(done => {
        server.listen(1880, () => {
            httpListners({ error: console.error }, app);
            done();
        })
    });

    afterAll(done => {
        app.close();
        server.listen ? server.close(done) : done();
    });

    test("test 404 serving", async () => {
        expect.assertions(1);
        const response = await request(app).get("/widaq");
        expect(response.statusCode).toBe(404);
        return;
    });
    test("test ssh serving", async () => {
        expect.assertions(1);
        const response = await request(app).get("/widaq/ssh");
        expect(response.statusCode).toBe(200);
        return;
    })
})
