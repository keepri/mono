import assert from "node:assert/strict";
import { generateInvoiceHTML, validateInvoiceData } from "./html.js";

const data = {
    number: "T-1",
    issue_date: "2026-09-22",
    due_date: "2026-10-22",
    currency: "RON",
    tax_rate: 19,
    supplier: { name: "S", cif: "RO1" },
    client: { name: "C" },
    items: [{ description: "x", qty: 1, unit_price: 100 }],
};

assert.deepEqual(validateInvoiceData(data, "en"), []);
assert.equal(generateInvoiceHTML(data).includes("119,00 RON"), true);
assert.equal(generateInvoiceHTML(data).includes("TVA (19%)"), true);
assert.throws(() => generateInvoiceHTML({ ...data, number: "" }));
