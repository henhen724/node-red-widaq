const getExpIPs = require('../lib/getExtIPs');

test("Check IP formatting", () => {
    const IPs = getExpIPs();
    for (const key in IPs)
        for (var i = 0; i < IPs[key].length; i++)
            expect(IPs[key][i]).toMatch(/(\d{1,3}\.){3}\d{1,3}/);
})