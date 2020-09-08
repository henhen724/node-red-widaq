const formatSchema = require("../lib/formatSchema");

test('converts string to type', () => {
    expect(formatSchema(console.error, { in: { "topic": { text: "string" } }, out: {} })).toEqual({ in: { "topic": { text: { type: "string" } } }, out: {} });
});

test('accepts description', () => {
    expect(formatSchema(console.error, { in: { "topic": { text: { type: "string", description: "some text" } } }, out: {} })).toEqual({ in: { "topic": { text: { type: "string", description: "some text" } } }, out: {} });
});

test('accepts required', () => {
    expect(formatSchema(console.error, { in: { "topic": { text: { type: "string", required: true } } }, out: {} })).toEqual({ in: { "topic": { text: { type: "string", required: true } } }, out: {} });
});

test('Description error message', () => {
    let consoleOutput = [];
    const mockedError = output => consoleOutput.push(output);
    expect(formatSchema(mockedError, { in: { "topic": { text: { type: "string", description: true } } }, out: {} })).toEqual({ in: { "topic": { type: "object", required: false } }, out: {} });
    expect(consoleOutput).toEqual(['widaq-in topic topic has the following schema error.\ntext.description:Descriptions must be a string, not boolean.']);
});

test('Required error message', () => {
    let consoleOutput = [];
    const mockedError = output => consoleOutput.push(output);
    expect(formatSchema(mockedError, { in: { "topic": { text: { type: "string", required: "some text" } } }, out: {} })).toEqual({ in: { "topic": { type: "object", required: false } }, out: {} });
    expect(consoleOutput).toEqual(['widaq-in topic topic has the following schema error.\ntext.required:Required must be a boolean, not string.']);
});
