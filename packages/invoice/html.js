// @ts-nocheck
import Handlebars from "handlebars";
import { getMessage } from "./i18n.js";

const LOVABLE_TEMPLATE = "<!DOCTYPE html>\n<html lang=\"ro\">\n<head>\n  <meta charset=\"UTF-8\">\n  <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..700&display=swap\">\n  <style>{{{css}}}</style>\n</head>\n<body>\n  {{#if watermark}}\n  <div class=\"watermark\">{{watermark}}</div>\n  {{/if}}\n  <div class=\"header\">\n    <div class=\"header-left\">\n      {{#if logo}}\n      <img class=\"logo\" src=\"{{logo}}\" alt=\"Logo\">\n      {{/if}}\n    </div>\n    <div class=\"header-right\">\n      <h1>{{#if is_credit_note}}Factura Storno{{else if is_proforma}}Factura Proforma{{else}}Factura{{/if}}</h1>\n      <div class=\"invoice-meta\">\n        <div><strong>Numar factura:</strong> {{number}}</div>\n        <div><strong>Data emiterii:</strong> {{issue_date}}</div>\n        <div><strong>Scadenta:</strong> {{due_date}}</div>\n        {{#if payment_terms}}\n        <div><strong>Termen de plata:</strong> {{payment_terms}}</div>\n        {{/if}}\n        {{#if reference_invoice}}\n        <div><strong>Referinta factura:</strong> {{reference_invoice}}</div>\n        {{/if}}\n        {{#if po_number}}\n        <div><strong>Comanda:</strong> {{po_number}}</div>\n        {{/if}}\n        {{#if delivery_date}}\n        <div><strong>Data livrarii:</strong> {{delivery_date}}</div>\n        {{/if}}\n        {{#if efactura_reference}}\n        <div><strong>Ref. e-Factura:</strong> {{efactura_reference}}</div>\n        {{/if}}\n      </div>\n    </div>\n  </div>\n\n  <div class=\"parties\">\n    <div class=\"party\">\n      <div class=\"party-label\">Furnizor</div>\n      <div class=\"party-name\">{{supplier.name}}</div>\n      <div class=\"party-details\">\n        {{#if supplier.cif}}CIF: {{supplier.cif}}<br>{{/if}}\n        {{#if supplier.trade_registry}}Nr. reg. com.: {{supplier.trade_registry}}<br>{{/if}}\n        {{#if share_capital}}Capital social: {{share_capital}}<br>{{/if}}\n        {{#if supplier.address}}{{supplier.address}}<br>{{/if}}\n        {{#if supplier.iban}}IBAN: {{supplier.iban}}<br>{{/if}}\n        {{#if supplier.bank}}{{supplier.bank}}<br>{{/if}}\n        {{#if supplier.email}}{{supplier.email}}<br>{{/if}}\n        {{#if supplier.phone}}Tel: {{supplier.phone}}{{/if}}\n      </div>\n    </div>\n    <div class=\"party\">\n      <div class=\"party-label\">Beneficiar</div>\n      <div class=\"party-name\">{{client.name}}</div>\n      <div class=\"party-details\">\n        {{#if client.cif}}CIF: {{client.cif}}<br>{{/if}}\n        {{#if client.trade_registry}}Nr. reg. com.: {{client.trade_registry}}<br>{{/if}}\n        {{#if client.address}}{{client.address}}<br>{{/if}}\n        {{#if client.email}}{{client.email}}<br>{{/if}}\n        {{#if client.phone}}Tel: {{client.phone}}{{/if}}\n      </div>\n    </div>\n  </div>\n\n  <div class=\"amount-due\">\n    <div>\n      <div class=\"amount-due-label\">Suma de plata</div>\n      <div class=\"amount-due-due-date\">Scadenta: {{due_date}}</div>\n    </div>\n      <div class=\"amount-due-value\">{{total}}</div>\n  </div>\n\n  <table>\n    <thead>\n      <tr>\n        <th>Descriere</th>\n        <th>Cantitate</th>\n        <th>Pret unitar</th>\n        <th>TVA</th>\n        <th>Suma</th>\n      </tr>\n    </thead>\n    <tbody>\n      {{#each items}}\n      <tr>\n        <td>{{description}}</td>\n        <td>{{qty}}{{#if unit}}&nbsp;{{unit}}{{/if}}</td>\n        <td>{{unit_price}}</td>\n        \n        <td>{{amount}}</td>\n      </tr>\n      {{/each}}\n    </tbody>\n  </table>\n\n  {{#if vat_exemption}}\n  <div class=\"vat-exemption\">{{vat_exemption}}</div>\n  {{/if}}\n  {{#if reverse_charge}}\n  <div class=\"vat-exemption\">TVA inversa conform art. 331 din Legea 227/2015</div>\n  {{/if}}\n\n  <div class=\"summary\">\n    <div class=\"summary-table\">\n      <div class=\"summary-row\">\n        <span>Subtotal</span>\n        <span>{{subtotal}}</span>\n      </div>\n      {{#if discount}}\n      <div class=\"summary-row discount\">\n        <span>{{discount_label}}</span>\n        <span>{{discount}}</span>\n      </div>\n      {{/if}}\n      <div class=\"summary-row\">\n        <span>TVA ({{tax_rate}}%)</span>\n        <span>{{vat_amount}}</span>\n      </div>\n      <div class=\"summary-row total\">\n        <span>Total</span>\n        <span>{{total}}</span>\n      </div>\n    </div>\n  </div>\n\n  {{#if notes}}\n  <div class=\"notes\">\n    <div class=\"notes-title\">Observatii</div>\n    <div class=\"notes-content\">{{notes}}</div>\n  </div>\n  {{/if}}\n\n  {{#if issuer}}\n  <div class=\"issuer\">\n    <span class=\"issuer-label\">Intocmit de:</span>\n    <span class=\"issuer-name\">{{issuer}}</span>\n  </div>\n  {{/if}}\n\n</body>\n</html>\n";
// font: Inconsolata (OFL), same as site; loaded via Google Fonts in the standalone doc
// ponytail: page footer uses fixed positioning (works in all browsers)
const LOVABLE_CSS = "@page {\n  size: A4;\n  margin: 0;\n}\n\ntr, .summary, .notes, .issuer, .amount-due, .parties {\n  break-inside: avoid;\n}\nthead {\n  display: table-header-group;\n}\nhtml {\n  height: auto;\n}\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Inconsolata', monospace;\n  font-weight: 300;\n  color: #1D1934;\n  padding: 60px 60px 40px 60px;\n  background: white;\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 60px;\n}\n\n.header-left {\n  flex: 0 0 150px;\n}\n\n.header-right {\n  flex: 1;\n  text-align: right;\n}\n\n.logo {\n  max-height: 50px;\n  max-width: 150px;\n}\n\n.invoice-title {\n  text-align: right;\n}\n\n.invoice-title h1 {\n  font-size: 32px;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n\n.invoice-meta {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 4px 20px;\n  font-size: 14px;\n  line-height: 1.6;\n  color: #1D1934;\n  overflow-wrap: break-word;\n  word-break: break-all;\n}\n\n.invoice-meta strong {\n  color: #1D1934;\n  font-weight: 500;\n}\n\n.parties {\n  display: flex;\n  gap: 60px;\n  margin-bottom: 50px;\n}\n\n.party {\n  flex: 1;\n}\n\n.party-label {\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: #1D1934;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n\n.party-name {\n  font-size: 16px;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n\n.party-details {\n  font-size: 14px;\n  line-height: 1.6;\n  color: #1D1934;\n}\n\n.amount-due {\n  background: #F7F5F6;\n  padding: 24px 32px;\n  border-radius: 12px;\n  margin-bottom: 50px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.amount-due-label {\n  font-size: 14px;\n  color: #1D1934;\n  font-weight: 500;\n}\n\n.amount-due-value {\n  font-size: 36px;\n  font-weight: 500;\n}\n\n.amount-due-due-date {\n  font-size: 14px;\n  color: #1D1934;\n  margin-top: 4px;\n}\n\ntable {\n  width: 100%;\n  border-collapse: collapse;\n  margin-bottom: 40px;\n}\n\nthead th {\n  text-align: left;\n  padding: 12px 16px;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: #1D1934;\n  border-bottom: 1px solid #E5E5E5;\n  font-weight: 500;\n}\n\ntbody td {\n  padding: 16px;\n  font-size: 14px;\n  border-bottom: 1px solid #E5E5E5;\n}\n\ntbody td:nth-child(n+3) {\n  text-align: right;\n}\n\nthead th:nth-child(n+3) {\n  text-align: right;\n}\n\n.summary {\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 60px;\n}\n\n.summary-table {\n  width: 300px;\n}\n\n.summary-row {\n  display: flex;\n  justify-content: space-between;\n  padding: 8px 0;\n  font-size: 14px;\n}\n\n.summary-row.total {\n  font-size: 18px;\n  font-weight: 500;\n  border-top: 1px solid #E5E5E5;\n  margin-top: 8px;\n  padding-top: 16px;\n}\n\n.summary-row.total span:last-child {\n  font-weight: 500;\n}\n\n.summary-row.discount {\n  color: #C93B2B;\n}\n\n.summary-row.discount span:last-child {\n  color: #C93B2B;\n}\n\n.vat-exemption {\n  font-style: italic;\n  font-size: 11px;\n  color: #666;\n  margin: 10px 0;\n  padding: 8px;\n  background: #f9f9f9;\n  border-left: 2px solid #999;\n}\n\n.notes {\n  margin-top: 20px;\n  padding: 15px;\n  background-color: #f9f9f9;\n  border-left: 3px solid #333;\n  font-size: 11px;\n  line-height: 1.5;\n}\n\n.notes-title {\n  font-weight: 600;\n  margin-bottom: 8px;\n  color: #333;\n}\n\n.notes-content {\n  white-space: pre-wrap;\n  color: #555;\n}\n\n.issuer {\n  margin-top: 30px;\n  font-size: 12px;\n}\n\n.issuer-label {\n  color: #666;\n  margin-right: 10px;\n}\n\n.issuer-name {\n  font-weight: 500;\n  border-bottom: 1px solid #333;\n  padding-bottom: 2px;\n  min-width: 200px;\n  display: inline-block;\n}\n\n.watermark {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) rotate(-45deg);\n  font-size: 80px;\n  font-weight: 900;\n  color: rgba(0, 0, 0, 0.08);\n  text-transform: uppercase;\n  letter-spacing: 10px;\n  z-index: 999;\n  pointer-events: none;\n  white-space: nowrap;\n}\n\n";

const COMPILED_TEMPLATE = Handlebars.compile(LOVABLE_TEMPLATE);

function round2(num) {
    return Math.round(num * 100) / 100;
}

function requireNonEmpty(value, field, label, locale) {
    const errors = [];
    if (!value) errors.push({ field, message: getMessage(locale, "REQUIRED", label) });
    else if (typeof value === "string" && value.trim() === "") errors.push({ field, message: getMessage(locale, "REQUIRED_NON_EMPTY", label) });
    return errors;
}

function requireNumber(value, field, label, locale) {
    if (typeof value !== "number") {
        return [{ field, message: getMessage(locale, "MUST_BE_NUMBER", label) }];
    }
    return [];
}

function validateRequiredFields(data, locale) {
    const errors = [];

    errors.push(...requireNonEmpty(data.number, "number", "numarul facturii", locale));
    errors.push(...requireNonEmpty(data.issue_date, "issue_date", "data emiterii", locale));
    errors.push(...requireNonEmpty(data.due_date, "due_date", "data scadentei", locale));

    if (!data.currency) {
        errors.push({ field: "currency", message: getMessage(locale, "REQUIRED", "moneda (currency)") });
    } else if (typeof data.currency !== "string") {
        errors.push({ field: "currency", message: getMessage(locale, "MUST_BE_STRING", "Moneda (currency)") });
    }

    return errors;
}

function validateSupplier(supplier, locale) {
    const errors = [];

    if (!supplier) {
        errors.push({ field: "supplier", message: getMessage(locale, "REQUIRED", "datele furnizorului (supplier)") });
        return errors;
    }

    errors.push(...requireNonEmpty(supplier.name, "supplier.name", "numele furnizorului", locale));
    errors.push(...requireNonEmpty(supplier.cif, "supplier.cif", "CIF-ul furnizorului", locale));

    return errors;
}

function validateClient(client, locale) {
    const errors = [];

    if (!client) {
        errors.push({ field: "client", message: getMessage(locale, "REQUIRED", "datele beneficiarului (client)") });
        return errors;
    }

    errors.push(...requireNonEmpty(client.name, "client.name", "numele beneficiarului", locale));

    return errors;
}

function validateItems(items, invoiceType, locale) {
    const errors = [];
    const isCreditNote = invoiceType === "credit_note";

    if (!items || !Array.isArray(items)) {
        errors.push({ field: "items", message: getMessage(locale, "REQUIRED", "articolele (items trebuie sa fie un array)") });
        return errors;
    }

    if (items.length === 0) {
        errors.push({ field: "items", message: getMessage(locale, "AT_LEAST_ONE_ITEM") });
        return errors;
    }

    items.forEach((item, index) => {
        const prefix = `Articolul ${index + 1}`;

        errors.push(...requireNonEmpty(item.description, `items[${index}].description`, `${prefix}: descrierea (description)`, locale));

        if (item.qty == null) {
            errors.push({ field: `items[${index}].qty`, message: getMessage(locale, "REQUIRED", `${prefix}: cantitatea (qty)`) });
        } else {
            errors.push(...requireNumber(item.qty, `items[${index}].qty`, `${prefix}: cantitatea (qty)`, locale));
            if (!isCreditNote && item.qty < 0) {
                errors.push({ field: `items[${index}].qty`, message: getMessage(locale, "NEGATIVE_NOT_ALLOWED", `${prefix}: cantitatea (qty)`) });
            }
        }

        if (item.unit_price == null) {
            errors.push({ field: `items[${index}].unit_price`, message: getMessage(locale, "REQUIRED", `${prefix}: pretul unitar (unit_price)`) });
        } else {
            errors.push(...requireNumber(item.unit_price, `items[${index}].unit_price`, `${prefix}: pretul unitar (unit_price)`, locale));
            if (!isCreditNote && item.unit_price < 0) {
                errors.push({ field: `items[${index}].unit_price`, message: getMessage(locale, "NEGATIVE_NOT_ALLOWED", `${prefix}: pretul unitar (unit_price)`) });
            }
        }
    });

    return errors;
}

function validateTaxRate(data, locale) {
    const errors = [];

    if (data.tax_rate == null) {
        errors.push({ field: "tax_rate", message: getMessage(locale, "REQUIRED", "cota TVA (tax_rate)") });
        return errors;
    }

    errors.push(...requireNumber(data.tax_rate, "tax_rate", "cota TVA (tax_rate)", locale));
    if (data.tax_rate < 0 || data.tax_rate > 100) {
        errors.push({ field: "tax_rate", message: getMessage(locale, "OUT_OF_RANGE", "cota TVA (tax_rate)", 0, 100) });
    }

    return errors;
}

function validateDates(data, locale) {
    const errors = [];

    if (data.issue_date && isNaN(Date.parse(data.issue_date))) {
        errors.push({ field: "issue_date", message: getMessage(locale, "INVALID_DATE", "Data emiterii (issue_date)") });
    }
    if (data.due_date && isNaN(Date.parse(data.due_date))) {
        errors.push({ field: "due_date", message: getMessage(locale, "INVALID_DATE", "Data scadentei (due_date)") });
    }

    if (data.issue_date && data.due_date) {
        const issueDate = new Date(data.issue_date + "T00:00:00");
        const dueDate = new Date(data.due_date + "T00:00:00");
        if (!isNaN(issueDate.getTime()) && !isNaN(dueDate.getTime()) && dueDate < issueDate) {
            errors.push({ field: "due_date", message: getMessage(locale, "DATE_BEFORE", "Data scadentei (due_date)", "data emiterii (issue_date)") });
        }
    }

    return errors;
}

function validateDiscount(data, locale) {
    const errors = [];
    const hasValue = data.discount_value != null;
    const hasType = data.discount_type != null;

    if (!hasValue && !hasType) return errors;

    if (!hasValue) errors.push({ field: "discount_value", message: getMessage(locale, "REQUIRED", "valoarea reducerii (discount_value)") });
    if (!hasType) errors.push({ field: "discount_type", message: getMessage(locale, "REQUIRED", "tipul reducerii (discount_type)") });

    if (hasType && !["percent", "amount"].includes(data.discount_type)) {
        errors.push({ field: "discount_type", message: getMessage(locale, "INVALID_TYPE", "Tipul reducerii (discount_type)", "percent sau amount") });
    }

    if (hasValue && typeof data.discount_value !== "number") {
        errors.push({ field: "discount_value", message: getMessage(locale, "MUST_BE_NUMBER", "Reducerea (discount_value)") });
    } else if (hasValue) {
        if (data.discount_value < 0) {
            errors.push({ field: "discount_value", message: getMessage(locale, "NEGATIVE_NOT_ALLOWED", "Reducerea (discount_value)") });
        }
        if (data.discount_type === "percent" && data.discount_value > 100) {
            errors.push({ field: "discount_value", message: getMessage(locale, "CANNOT_EXCEED", "Reducerea procentuala (discount_value)", "100%") });
        }
    }

    return errors;
}

function validateBusinessRules(data, locale) {
    const errors = [];

    if (data.type && !["invoice", "proforma", "credit_note"].includes(data.type)) {
        errors.push({ field: "type", message: getMessage(locale, "INVALID_TYPE", "Tipul facturii (type)", "invoice, proforma sau credit_note") });
    }

    if (data.vat_exemption && data.reverse_charge) {
        errors.push({ field: "vat_exemption", message: getMessage(locale, "MUTUALLY_EXCLUSIVE", "Scutirea de TVA (vat_exemption)", "taxarea inversa (reverse_charge)") });
    }

    return errors;
}

export function validateInvoiceData(data, locale = "ro") {
    const errors = [];

    errors.push(...validateRequiredFields(data, locale));
    errors.push(...validateSupplier(data.supplier, locale));
    errors.push(...validateClient(data.client, locale));
    errors.push(...validateItems(data.items, data.type, locale));
    errors.push(...validateTaxRate(data, locale));
    errors.push(...validateDates(data, locale));
    errors.push(...validateDiscount(data, locale));
    errors.push(...validateBusinessRules(data, locale));

    return errors;
}

function formatDateRO(dateStr) {
    return dateStr ? new Date(dateStr + "T00:00:00").toLocaleDateString("ro-RO") : "";
}

function formatCurrencyRO(amount, currency) {
    if (amount == null) return "0,00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    const formatted = num.toLocaleString("ro-RO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${formatted} ${currency}`;
}

function calculateDiscount(subtotal, discountValue, discountType) {
    if (!discountValue || !discountType) return { value: 0, label: "" };

    let value = 0;
    let label = "";

    if (discountType === "percent") {
        value = (subtotal * discountValue) / 100;
        label = `Reducere (${discountValue}%)`;
    } else if (discountType === "amount") {
        value = discountValue;
        label = "Reducere";
    }

    if (subtotal > 0 && value > subtotal) {
        value = subtotal;
    }

    return { value, label };
}

function calculateTotals(data) {
    const items = data.items.map(item => ({
        ...item,
        amount: round2(item.qty * item.unit_price)
    }));

    const subtotal = round2(items.reduce((sum, item) => sum + item.amount, 0));
    const { value: discountValue, label: discountLabel } = calculateDiscount(
        subtotal,
        data.discount_value,
        data.discount_type
    );

    const taxableBase = subtotal - discountValue;
    const taxRate = data.tax_rate ?? 0;
    const vatAmount = round2((taxableBase * taxRate) / 100);
    const total = round2(taxableBase + vatAmount);

    return {
        items,
        subtotal,
        vat_amount: vatAmount,
        total,
        discount_value: discountValue,
        discount_label: discountLabel
    };
}

export function generateInvoiceHTML(data, options = {}) {
    const errors = validateInvoiceData(data, options.locale);
    if (errors.length > 0) {
        const err = new Error("Date invalide");
        err.errors = errors;
        throw err;
    }

    const invoiceData = { ...data };

    if (typeof invoiceData.notes === "string" && !invoiceData.notes.trim()) {
        invoiceData.notes = null;
    }

    const calculated = calculateTotals(invoiceData);
    invoiceData.items = calculated.items;
    invoiceData.subtotal = calculated.subtotal;
    invoiceData.vat_amount = calculated.vat_amount;
    invoiceData.total = calculated.total;

    const hasDiscount = calculated.discount_value !== 0;
    const invoiceType = invoiceData.type || "invoice";

    const formattedData = {
        ...invoiceData,
        is_proforma: invoiceType === "proforma",
        is_credit_note: invoiceType === "credit_note",
        issue_date: formatDateRO(invoiceData.issue_date),
        due_date: formatDateRO(invoiceData.due_date),
        delivery_date: invoiceData.delivery_date ? formatDateRO(invoiceData.delivery_date) : null,
        share_capital: invoiceData.supplier.share_capital
      ? formatCurrencyRO(invoiceData.supplier.share_capital, invoiceData.currency)
      : null,
        subtotal: formatCurrencyRO(invoiceData.subtotal, invoiceData.currency),
        discount: hasDiscount ? formatCurrencyRO(calculated.discount_value, invoiceData.currency) : null,
        discount_label: calculated.discount_label,
        vat_amount: formatCurrencyRO(invoiceData.vat_amount, invoiceData.currency),
        total: formatCurrencyRO(invoiceData.total, invoiceData.currency),
        items: invoiceData.items.map(item => ({
            ...item,
            unit_price: formatCurrencyRO(item.unit_price, invoiceData.currency),
            amount: formatCurrencyRO(item.amount, invoiceData.currency)
        })),
        logo: invoiceData.logo || null
    };

    const html = COMPILED_TEMPLATE({ ...formattedData, css: LOVABLE_CSS });
    return html;
}
