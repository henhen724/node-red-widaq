const { getExpIPs, getOneExtIP } = require('../lib/getExtIPs');

test("Check multiple IP formatting", () => {
    const IPs = getExpIPs();
    for (const key in IPs)
        for (var i = 0; i < IPs[key].length; i++)
            expect(IPs[key][i]).toMatch(/(\d{1,3}\.){3}\d{1,3}/);
});

test("Check one IP formatting", () => {
    const IP = getOneExtIP();
    expect(IP).toMatch(/(\d{1,3}\.){3}\d{1,3}/);
});