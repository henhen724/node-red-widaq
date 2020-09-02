const { buildSchema } = require("graphql/utilities");

// This checks that our schema is valid graphql language
const verifySchema = (v) => {
    try {
        const schema = buildSchema(v);
        const type = schema.getInputType();
        return !!type;
    } catch (e) {
        return false;
    }
}

module.exports = verifySchema;