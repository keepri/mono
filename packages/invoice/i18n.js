// @ts-nocheck
const messages = {
    en: {
        REQUIRED: (field) => `Missing ${field}`,
        REQUIRED_NON_EMPTY: (field) => `${field} cannot be empty`,
        MUST_BE_NUMBER: (field) => `${field} must be a number`,
        MUST_BE_STRING: (field) => `${field} must be a string`,
        INVALID_DATE: (field) => `${field} is not in a valid format`,
        DATE_BEFORE: (field1, field2) => `${field1} cannot be before ${field2}`,
        NEGATIVE_NOT_ALLOWED: (field) => `${field} cannot be negative for regular invoices`,
        OUT_OF_RANGE: (field, min, max) => `${field} must be between ${min} and ${max}`,
        INVALID_TYPE: (field, types) => `${field} must be ${types}`,
        MUTUALLY_EXCLUSIVE: (field1, field2) => `${field1} and ${field2} are mutually exclusive`,
        CANNOT_EXCEED: (field, limit) => `${field} cannot exceed ${limit}`,
        AT_LEAST_ONE_ITEM: "Invoice must contain at least one item",
    },
};

export function getMessage(locale, code, ...args) {
    const msg = messages[locale]?.[code] ?? messages.en[code];
    if (!msg) return code;
    return typeof msg === "function" ? msg(...args) : msg;
}
