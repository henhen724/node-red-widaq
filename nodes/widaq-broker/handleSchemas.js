const { buildSchema } = require("graphql");

const assembleSchema = (typesObj) => {
    const topics = Object.keys(typesObj);
    var typeDefs = "";
    var subscription = "type Subscription {\n";
    for (const topic in topics) {
        if (typesObj[topic]) {
            typeDefs += typesObj[topic] + "\n";
            subscription += `\t${topic}:${topic}\n`;
        }
    }
    subscription += "\t__widaq_state__:String\n}\n"

    return typeDefs + subscription + "schema {\n\tsubscription: Subscription\n}";
}

const handleSchemas = async (node) => {
    await new Promise(res => setTimeout(res, 0)); // Make sure all nodes are defined before this runs.
    node.outSchema = assembleSchema(node.outTypes);
    try {
        node.outSchemaObj = buildSchema(node.outSchema);
    } catch (error) {
        node.error("Incorrect type syntax.");
        node.error(error);
        node.error(`Full out schema for reference\n${node.outSchema}`);
    }
    node.inSchema = assembleSchema(node.inTypes);
    try {
        node.inSchemaObj = buildSchema(node.inSchema);
    } catch (error) {
        node.error("Incorrect type syntax.");
        node.error(error);
        node.error(`\nFull in schema for reference\n${node.inSchema}`);
    }
}
module.exports = handleSchemas;