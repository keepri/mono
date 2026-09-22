import { generateInvoiceHTML } from "invoice";
import { Button, Input, Select, Textarea } from "ui";
import { readFileAsDataUrl, toMB } from "utils";
import Section from "@components/Section";
import { fontInconsolata, fontLondrinaSketch } from "@utils/font";
import { type NextPage } from "next/types";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

const VAT_EXEMPTION =
    "Scutit de TVA conform art. 292 alin. (1) lit. a) din Legea 227/2015 privind Codul Fiscal";
const legendClass = "text-2xl font-semibold pb-3";
const LOCALE = "en";
const LOGO_MAX_MB = 1;
const fieldClass =
    "border border-gray-300 bg-white dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2";

type InvoiceType = "invoice" | "proforma" | "credit_note";
type DiscountType = "percent" | "amount";

type Item = {
    description: string;
    qty: number;
    unit_price: number;
};

type InvoiceForm = {
    number: string;
    type: InvoiceType;
    issue_date: string;
    due_date: string;
    currency: string;
    payment_terms: string;
    reference_invoice: string;
    po_number: string;
    delivery_date: string;
    efactura_reference: string;
    issuer: string;
    watermark: string;
    notes: string;
    vat_exemption: string;
    reverse_charge: boolean;
    discount_type: "" | DiscountType;
    discount_value: string;
    tax_rate: number;
    logo: string;
    supplier: {
        name: string;
        cif: string;
        trade_registry: string;
        share_capital: string;
        address: string;
        iban: string;
        bank: string;
        email: string;
        phone: string;
    };
    client: {
        name: string;
        cif: string;
        trade_registry: string;
        address: string;
        email: string;
        phone: string;
    };
    items: Item[];
};

function iso(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function dateHint(): string {
    if (typeof window === "undefined" || !("Intl" in window)) return "yyyy-mm-dd";
    const parts = new Intl.DateTimeFormat(window.navigator.language).formatToParts(
        new Date(2000, 11, 31)
    );
    const order = parts
        .filter((p) => p.type === "day" || p.type === "month" || p.type === "year")
        .map((p) => ({ day: "dd", month: "mm", year: "yyyy" }[p.type]));
    const monthIdx = parts.findIndex((p) => p.type === "month");
    const dayIdx = parts.findIndex((p) => p.type === "day");
    return monthIdx < dayIdx
        ? `${order.join("/")} - deal with it :)`
        : order.join("/");
}

function demo(): InvoiceForm {
    const issue = new Date();
    const due = new Date(issue);
    due.setDate(due.getDate() + 30);

    return {
        number: "DEMO-2026-0001",
        type: "invoice",
        issue_date: iso(issue),
        due_date: iso(due),
        currency: "RON",
        payment_terms: "",
        reference_invoice: "",
        po_number: "",
        delivery_date: "",
        efactura_reference: "",
        issuer: "",
        watermark: "",
        notes: "",
        vat_exemption: "",
        reverse_charge: false,
        discount_type: "",
        discount_value: "",
        tax_rate: 19,
        logo: "",
        supplier: {
            name: "FURNIZOR DEMO SRL",
            cif: "RO00000000",
            trade_registry: "",
            share_capital: "",
            address: "",
            iban: "",
            bank: "",
            email: "",
            phone: "",
        },
        client: {
            name: "CLIENT DEMO SRL",
            cif: "",
            trade_registry: "",
            address: "",
            email: "",
            phone: "",
        },
        items: [{ description: "Serviciu", qty: 1, unit_price: 100 }],
    };
}

function blank(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

function toPayload(form: InvoiceForm): Record<string, unknown> {
    const taxRate = form.tax_rate;
    const discountValue = form.discount_value.trim();
    const shareCapital = form.supplier.share_capital.trim();

    return {
        number: form.number,
        type: form.type,
        issue_date: form.issue_date,
        due_date: form.due_date,
        currency: form.currency,
        tax_rate: taxRate,
        payment_terms: blank(form.payment_terms),
        reference_invoice: blank(form.reference_invoice),
        po_number: blank(form.po_number),
        delivery_date: blank(form.delivery_date),
        efactura_reference: blank(form.efactura_reference),
        issuer: blank(form.issuer),
        watermark: blank(form.watermark),
        notes: blank(form.notes),
        vat_exemption: blank(form.vat_exemption),
        reverse_charge: form.reverse_charge || undefined,
        discount_type: form.discount_type || undefined,
        discount_value:
            discountValue === "" ? undefined : Number(discountValue),
        logo: form.logo || undefined,
        supplier: {
            name: form.supplier.name,
            cif: form.supplier.cif,
            trade_registry: blank(form.supplier.trade_registry),
            share_capital:
                shareCapital === "" ? undefined : Number(shareCapital),
            address: blank(form.supplier.address),
            iban: blank(form.supplier.iban),
            bank: blank(form.supplier.bank),
            email: blank(form.supplier.email),
            phone: blank(form.supplier.phone),
        },
        client: {
            name: form.client.name,
            cif: blank(form.client.cif),
            trade_registry: blank(form.client.trade_registry),
            address: blank(form.client.address),
            email: blank(form.client.email),
            phone: blank(form.client.phone),
        },
        items: form.items.map((item) => ({
            description: item.description,
            qty: item.qty,
            unit_price: item.unit_price,
        })),
    };
}

const InvoicesPage: NextPage = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [form, setForm] = useState<InvoiceForm>(demo);
    const [openItem, setOpenItem] = useState(-1);
    const [html, setHtml] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [logoError, setLogoError] = useState("");

    const payload = useMemo(() => toPayload(form), [form]);

    useEffect(() => {
        try {
            setHtml(generateInvoiceHTML(payload, { locale: LOCALE }));
            setErrors({});
        } catch (e) {
            const found = (
                e as { errors?: { field: string; message: string }[] }
            ).errors;
            if (found)
                setErrors(
                    Object.fromEntries(
                        found.map(({ field, message }) => [field, message])
                    )
                );
        }
    }, [payload]);

    function err(field: string): string | undefined {
        return errors[field];
    }

    function setField(
        field: keyof InvoiceForm,
        value: string | boolean | number
    ): void {
        setForm((prev) => {
            const next = { ...prev, [field]: value };
            if (
                field === "type" &&
                value === "proforma" &&
                !prev.watermark.trim()
            ) {
                next.watermark = "PROFORMA";
            }
            return next;
        });
    }

    function setSection<K extends "supplier" | "client">(
        section: K,
        field: keyof InvoiceForm[K],
        value: string
    ): void {
        setForm((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    }

    function setItem(index: number, field: keyof Item, value: string): void {
        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i !== index) return item;
                if (field === "description") {
                    return { ...item, [field]: value };
                }
                return { ...item, [field]: value === "" ? 0 : Number(value) };
            }),
        }));
    }

    function addItem(): void {
        setOpenItem(form.items.length);
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { description: "", qty: 1, unit_price: 0 }],
        }));
    }

    function removeItem(index: number): void {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    }

    function toggleVatExemption(checked: boolean): void {
        setForm((prev) => ({
            ...prev,
            vat_exemption: checked
                ? prev.vat_exemption.trim() || VAT_EXEMPTION
                : "",
        }));
    }

    function onLogo(e: ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0];
        if (!file) return;

        if (toMB(file.size) > LOGO_MAX_MB) {
            setLogoError("logo must be under 1MB");
            return;
        }

        if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
            setLogoError("logo must be a raster image (png/jpeg/webp)");
            return;
        }

        setLogoError("");
        readFileAsDataUrl(file, (event) => {
            const result = event.target?.result;
            if (typeof result === "string") setField("logo", result);
        });
    }

    function printInvoice(): void {
        iframeRef.current?.contentWindow?.print();
    }

    function fit(): void {
        const el = iframeRef.current;
        const body = el?.contentDocument?.body;
        if (!el || !body) return;
        el.style.height = `${body.scrollHeight}px`;
    }

    const printBlock = (
        <>
            <Button
                type="button"
                className={`button bg-white dark:bg-black border-black dark:border-white ${fontInconsolata}`}
                disabled={!html}
                onClick={printInvoice}
            >
                print / save pdf
            </Button>
            <p className={`text-sm ${fontInconsolata}`}>
                In the print window, pick Save as PDF.
            </p>
        </>
    );

    return (
        <div className="py-12 bg-ivory dark:bg-black dark:text-white">
            <Section className="flex flex-col gap-8">
                <h1
                    className={`text-6xl leading-none text-center ${fontLondrinaSketch}`}
                >
                    moneyz
                </h1>

                <div className="grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] gap-8 items-start">
                    <form
                        className={`flex flex-col gap-6 ${fontInconsolata}`}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>header</legend>
                            <Input
                                label="logo"
                                type="file"
                                accept="image/*"
                                className={fieldClass}
                                error={logoError}
                                onChange={onLogo}
                            />
                            {form.logo && (
                                <Button
                                    type="button"
                                    className="button bg-white dark:bg-black border-black dark:border-white"
                                    onClick={() => setField("logo", "")}
                                >
                                    clear logo
                                </Button>
                            )}
                            <Select
                                label="type"
                                className={fieldClass}
                                value={form.type}
                                options={[
                                    { value: "invoice", label: "invoice" },
                                    { value: "proforma", label: "proforma" },
                                    {
                                        value: "credit_note",
                                        label: "credit note",
                                    },
                                ]}
                                error={err("type")}
                                onChange={(e) =>
                                    setField(
                                        "type",
                                        e.target.value as InvoiceType
                                    )
                                }
                            />
                            <Input
                                label="watermark"
                                className={fieldClass}
                                value={form.watermark}
                                onChange={(e) =>
                                    setField("watermark", e.target.value)
                                }
                            />
                            <Input
                                label="number"
                                required
                                className={fieldClass}
                                value={form.number}
                                error={err("number")}
                                onChange={(e) =>
                                    setField("number", e.target.value)
                                }
                            />
                            <Input
                                label={`issue date (${dateHint()})`}
                                type="date"
                                required
                                className={fieldClass}
                                value={form.issue_date}
                                error={err("issue_date")}
                                onChange={(e) =>
                                    setField("issue_date", e.target.value)
                                }
                            />
                            <Input
                                label={`due date (${dateHint()})`}
                                type="date"
                                required
                                className={fieldClass}
                                value={form.due_date}
                                error={err("due_date")}
                                onChange={(e) =>
                                    setField("due_date", e.target.value)
                                }
                            />
                            <Input
                                label="currency"
                                required
                                className={fieldClass}
                                value={form.currency}
                                error={err("currency")}
                                onChange={(e) =>
                                    setField("currency", e.target.value)
                                }
                            />
                            <Input
                                label="payment terms"
                                className={fieldClass}
                                value={form.payment_terms}
                                onChange={(e) =>
                                    setField("payment_terms", e.target.value)
                                }
                            />
                            <Input
                                label="reference invoice"
                                className={fieldClass}
                                value={form.reference_invoice}
                                onChange={(e) =>
                                    setField(
                                        "reference_invoice",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="PO number"
                                className={fieldClass}
                                value={form.po_number}
                                onChange={(e) =>
                                    setField("po_number", e.target.value)
                                }
                            />
                            <Input
                                label={`delivery date (${dateHint()})`}
                                type="date"
                                className={fieldClass}
                                value={form.delivery_date}
                                onChange={(e) =>
                                    setField("delivery_date", e.target.value)
                                }
                            />
                            <Input
                                label="e-Factura reference"
                                className={fieldClass}
                                value={form.efactura_reference}
                                onChange={(e) =>
                                    setField(
                                        "efactura_reference",
                                        e.target.value
                                    )
                                }
                            />
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>supplier</legend>
                            <Input
                                label="name"
                                required
                                className={fieldClass}
                                value={form.supplier.name}
                                error={err("supplier.name")}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="CIF"
                                required
                                className={fieldClass}
                                value={form.supplier.cif}
                                error={err("supplier.cif")}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "cif",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="trade registry"
                                className={fieldClass}
                                value={form.supplier.trade_registry}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "trade_registry",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="share capital"
                                type="number"
                                className={fieldClass}
                                value={form.supplier.share_capital}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "share_capital",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="address"
                                className={fieldClass}
                                value={form.supplier.address}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "address",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="IBAN"
                                className={fieldClass}
                                value={form.supplier.iban}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "iban",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="bank"
                                className={fieldClass}
                                value={form.supplier.bank}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "bank",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="email"
                                type="email"
                                className={fieldClass}
                                value={form.supplier.email}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="phone"
                                className={fieldClass}
                                value={form.supplier.phone}
                                onChange={(e) =>
                                    setSection(
                                        "supplier",
                                        "phone",
                                        e.target.value
                                    )
                                }
                            />
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>client</legend>
                            <Input
                                label="name"
                                required
                                className={fieldClass}
                                value={form.client.name}
                                error={err("client.name")}
                                onChange={(e) =>
                                    setSection("client", "name", e.target.value)
                                }
                            />
                            <Input
                                label="CIF"
                                className={fieldClass}
                                value={form.client.cif}
                                onChange={(e) =>
                                    setSection("client", "cif", e.target.value)
                                }
                            />
                            <Input
                                label="trade registry"
                                className={fieldClass}
                                value={form.client.trade_registry}
                                onChange={(e) =>
                                    setSection(
                                        "client",
                                        "trade_registry",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="address"
                                className={fieldClass}
                                value={form.client.address}
                                onChange={(e) =>
                                    setSection(
                                        "client",
                                        "address",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="email"
                                type="email"
                                className={fieldClass}
                                value={form.client.email}
                                onChange={(e) =>
                                    setSection(
                                        "client",
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="phone"
                                className={fieldClass}
                                value={form.client.phone}
                                onChange={(e) =>
                                    setSection(
                                        "client",
                                        "phone",
                                        e.target.value
                                    )
                                }
                            />
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>items</legend>
                            {err("items") && (
                                <p className="text-red-600 text-sm">
                                    {err("items")}
                                </p>
                            )}
                            <Input
                                label="tax rate"
                                type="number"
                                required
                                className={fieldClass}
                                value={form.tax_rate}
                                error={err("tax_rate")}
                                onChange={(e) =>
                                    setField("tax_rate", Number(e.target.value))
                                }
                            />
                            {form.items.map((item, index) => (
                                <details
                                    key={index}
                                    open={openItem === index}
                                    onToggle={(e) => {
                                        if (e.currentTarget.open)
                                            setOpenItem(index);
                                    }}
                                    className="border border-gray-300 p-3"
                                >
                                    <summary className="cursor-pointer">
                                        <span className="inline-flex w-[calc(100%-1.25rem)] items-center justify-between gap-3 align-middle">
                                            <span>
                                                {item.description ||
                                                    `item ${index + 1}`}
                                            </span>
                                            <button
                                                type="button"
                                                className="underline shrink-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeItem(index);
                                                }}
                                            >
                                                remove
                                            </button>
                                        </span>
                                    </summary>
                                    <div className="flex flex-col gap-3 mt-3">
                                        <Input
                                            label="description"
                                            required
                                            className={fieldClass}
                                            value={item.description}
                                            error={err(
                                                `items[${index}].description`
                                            )}
                                            onChange={(e) =>
                                                setItem(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            label="qty"
                                            type="number"
                                            required
                                            className={fieldClass}
                                            value={item.qty}
                                            error={err(`items[${index}].qty`)}
                                            onChange={(e) =>
                                                setItem(
                                                    index,
                                                    "qty",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            label="unit price"
                                            type="number"
                                            required
                                            className={fieldClass}
                                            value={item.unit_price}
                                            error={err(
                                                `items[${index}].unit_price`
                                            )}
                                            onChange={(e) =>
                                                setItem(
                                                    index,
                                                    "unit_price",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </details>
                            ))}
                            <Button
                                type="button"
                                className="button bg-white dark:bg-black border-black dark:border-white"
                                onClick={addItem}
                            >
                                add item
                            </Button>
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>totals</legend>
                            <Select
                                label="discount type"
                                className={fieldClass}
                                value={form.discount_type}
                                options={[
                                    { value: "", label: "none" },
                                    { value: "percent", label: "percent" },
                                    { value: "amount", label: "amount" },
                                ]}
                                error={err("discount_type")}
                                onChange={(e) =>
                                    setField(
                                        "discount_type",
                                        e.target.value as "" | DiscountType
                                    )
                                }
                            />
                            <Input
                                label="discount value"
                                type="number"
                                className={fieldClass}
                                value={form.discount_value}
                                error={err("discount_value")}
                                onChange={(e) =>
                                    setField("discount_value", e.target.value)
                                }
                            />
                            <Input
                                label="reverse charge"
                                type="checkbox"
                                className={fieldClass}
                                checked={form.reverse_charge}
                                error={err("reverse_charge")}
                                onChange={(e) =>
                                    setField("reverse_charge", e.target.checked)
                                }
                            />
                            <Input
                                label="VAT exemption"
                                type="checkbox"
                                checked={Boolean(form.vat_exemption)}
                                error={err("vat_exemption")}
                                onChange={(e) =>
                                    toggleVatExemption(e.target.checked)
                                }
                            />
                            {form.vat_exemption && (
                                <Input
                                    label="exemption text"
                                    className={fieldClass}
                                    value={form.vat_exemption}
                                    onChange={(e) =>
                                        setField(
                                            "vat_exemption",
                                            e.target.value
                                        )
                                    }
                                />
                            )}
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={legendClass}>footer</legend>
                            <Textarea
                                label="notes"
                                className={fieldClass}
                                value={form.notes}
                                error={err("notes")}
                                onChange={(e) =>
                                    setField("notes", e.target.value)
                                }
                            />
                            <Input
                                label="issuer"
                                className={fieldClass}
                                value={form.issuer}
                                onChange={(e) =>
                                    setField("issuer", e.target.value)
                                }
                            />
                        </fieldset>
                    </form>

                    <div className="flex flex-col gap-3 lg:sticky lg:top-24">
                        {printBlock}
                        <iframe
                            ref={iframeRef}
                            title="invoice preview"
                            srcDoc={html}
                            onLoad={fit}
                            sandbox="allow-same-origin allow-modals"
                            className="w-full shrink-0 bg-white"
                            style={{ minHeight: "calc(297mm + 2rem)" }}
                        />
                        {printBlock}
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default InvoicesPage;
