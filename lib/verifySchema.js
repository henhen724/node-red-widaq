/******************************************************************************
 * This files is minified and added to widaq-in/index.html and widaq-out.html.*
 * This defines a schema linter for the schema definitions given.             *
 ******************************************************************************/
const typeStrings = ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"];
const checkTypeString = (type) => {
    if (!(schema in typeStrings))
        return { error: true, message: `Base types can only be "bigint", "boolean", "function", "number", "object", "string", "symbol", or "undefined". ${schema} is not one of those.`, path: "" };
    return {};
}
const verifyDescriptionObj = (schema) => {
    switch (typeof schema) {
        case "string":
            return checkTypeString(schema);
        case "object":
            const err = checkTypeString(schema.type);
            if (err.error) {
                err.path = "type";
                return err;
            }
            if (!(typeof schema.description in ["string", "undefinied"])) {
                return { error: true, message: `Descriptions must be a string, not ${typeof schema.description}.`, path: "description" };
            }
            return {};
        default:
            return { error: true, message: `Type definitions cannot ${typeof schema} they must be strings or objects.`, path: "" };
    }
}
const verifySchemaObj = (schema) => {
    if (typeof schema !== "object" || schema.type) {
        return verifyDescriptionObj(schema);
    } else if (Array.isArray(schema)) {
        if (schema.length === 0)
            return { error: true, message: "Array types cannot be empty.", path: "" };
        else if (schema.length > 1)
            return { error: true, message: "Array types must only have one array member that being their type definition.", path: "" };
        else
            return verifySchemaObj(schema[key]);
    } else {
        const keys = Object.keys(schema);
        for (const key in keys) {
            const rslt = verifySchemaObj(schema[key]);
            if (rslt.error) {
                rslt.path = `${key}.${rslt.path}`;
                return rslt;
            }
        }
    }
    return {};
}
const verifySchema = (schema) => {
    try {
        const schemaObj = JSON.parse(schema);
        return verifySchemaObj(schemaObj);
    } catch (err) {
        return { error: true, message: `Inproper JSON: ${err}`, path: "" };
    }
}