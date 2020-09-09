const httpListners = require("../nodes/widaq-broker/httpListners");
const http = require("http");
const request = require("supertest");
const express = require("express");
const fs = require("fs");
const { getExtIPs } = require("../lib/getExtIPs");
const app = express();
const server = http.Server(app);

describe("HTTP and WS tests", () => {
    beforeAll(done => {
        server.listen(1880, () => {
            httpListners(app, server, { log: console.log });
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
