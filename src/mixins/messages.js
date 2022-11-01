const ORGANIZATION = {
    ORGANIZATION_NAME_EMPTY: "Please enter Organization name",
    INVALID_ORG_NAME: "Enter valid Organization name",
    DOMAIN_NAME_EMPTY: "Please enter Domain name",
    INVALID_DOMAIN_NAME: "Enter valid Domain name"
}

const SCHEMA = {
    PROTECTED_TERM: "is protected term you can't use it",
    NO_SPACE: "There should not be space in attribute name",
    NAME_CAMELCASE: "Name should be camelCase",
    EMPTY_SCHEMA_NAME: "Please enter Schema name",
    INVALID_SCHEMA_NAME: " Enter valid Schema name",
    EMPTY_SCHEMA_ATTRIBUTE: "Atleast one attribute is required",
    EMPTY_SCHEMA_ATTRIBUTE_NAME: "Please provide attribute name",
    INVALID_ATTRIBUTE_NAME: "Enter valid attribute name",
    EMPTY_ATTRIBUTE_TYPE: "Please select attribute type",
    INVALID_FORMAT: "Enter a valid format value"
}

const CREDENTIAL = {
    EMPTY_ISSUER_DID: "Please enter Issuer DID",
    EMPTY_HOLDER_DID: "Please enter Subject Did",
    SELECT_SCHEMA: "Please select schema",
    INVALID_DID: "Please enter a valid did"
}

const PRESENTATION = {
    NAME_LIMIT_EXCEED: "Name should be less than 30 characters",
    REASON_LIMIT_EXCEED: "Reason should be less than 105 characters",
    ISSUER_DID_EMPTY: "Please enter Issuer DID",
    REASON: "Please enter reason for creating template",
    CALLBACK_URL: "Please enter callback url",
    INVALID_URL: "Please enter a valid url"
}
module.exports = {
    ORGANIZATION,
    SCHEMA,
    CREDENTIAL,
    PRESENTATION
}