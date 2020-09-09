const checkTypeList = (list, testType) => list.find(type => type === testType)
const typeStrings = ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"];
const checkTypeString = (testType) => checkTypeList(typeStrings, testType);

const descriptionTypes = ["string", "undefined"];
const checkDescriptionType = (testType) => checkTypeList(descriptionTypes, testType);

const requiredTypes = ["boolean", "undefined"];
const checkRequiredType = (testType) => checkTypeList(requiredTypes, testType);

const formatDescriptionObj = (schema) => {
    switch (typeof schema) {
        case "string":
            if (!checkTypeString(schema))
                return { error: true, message: `Base types can only be bigint, boolean, function, number, object, string, symbol, or undefined. ${schema} is not one of those.` };
            else
                return { schema: { type: schema } };
        case "object":
            if (!checkTypeString(typeof schema.type)) {
                return { error: true, message: `Base types can only be bigint, boolean, function, number, object, string, symbol, or undefined. ${schema} is not one of those.`, path: "type" };
            }
            if (!checkDescriptionType(typeof schema.description)) {
                return { error: true, message: `Descriptions must be a string, not ${typeof schema.description}.`, path: "description" };
            }
            if (!checkRequiredType(typeof schema.required)) {
                return { error: true, message: `Required must be a boolean, not ${typeof schema.required}.`, path: "required" };
            }
            return { schema };
        default:
            return { error: true, message: `Type definitions cannot be ${typeof schema} they must be strings or objects.` };
    }
}

const formatSchemaObj = (schema) => {
    var formatedSchema = {};
    if (schema === null) {
        return { schema: { type: "object", required: false } };
    } else if (typeof schema !== "object" || schema.type) {
        return formatDescriptionObj(schema);
    } else if (Array.isArray(schema)) {
        if (schema.length === 0)
            return { error: true, message: "Array types cannot be empty." };
        else if (schema.length > 1)
            return { error: true, message: "Array types must only have one array member that being their type definition." };
        else
            return formatSchemaObj(schema[0]);
    } else {
        for (const key in schema) {
            const rslt = formatSchemaObj(schema[key]);
            if (rslt.error) {
                rslt.path = rslt.path ? `${key}.${rslt.path}` : key;
                return rslt;
            }
            formatedSchema[key] = rslt.schema;
        }
        return { schema: formatedSchema };
    }
}
const formatSchema = (log, schema) => {
    for (const topic in schema.in) {
        const rslt = formatSchemaObj(schema.in[topic]);
        if (rslt.error) {
            log(`widaq-in topic ${topic} has the following schema error.\n${rslt.path}:${rslt.message}`);
            schema.in[topic] = { type: "object", required: false };
        } else {
            schema.in[topic] = rslt.schema;
        }
    }
    for (const topic in schema.out) {
        const rslt = formatSchemaObj(schema.out[topic]);
        if (rslt.error) {
            log(`widaq-out topic ${topic} has the following schema error.\n${rslt.path}:${rslt.message}`);
            schema.out[topic] = { type: "object", required: false };
        } else {
            schema.out[topic] = rslt.schema;
        }
    }
    return schema;
}

module.exports = formatSchema;