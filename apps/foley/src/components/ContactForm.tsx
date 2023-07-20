import { Button, Input, Textarea } from "ui";
import { URLS } from "@utils/enums";
import { origin } from "@utils/misc";
import { ContactBodySchema } from "@utils/schemas";
import { useSession } from "next-auth/react";
import { useCallback, useState, useEffect, type FormEvent, ChangeEvent, useMemo } from "react";
import { z } from "zod";
import { generateErrorMessage } from "zod-error";

enum Status {
    idle = "idle",
    loading = "loading",
    error = "error",
    success = "success",
}

type Props = {
    className?: string;
};

type ErrorFields = null | {
    name?: boolean;
    email?: boolean;
    message?: boolean;
};

export default function ContactForm(props: Props): JSX.Element {
    const session = useSession();

    const [errorFields, setErrorFields] = useState<ErrorFields>(null);
    const [status, setStatus] = useState<Status>(Status.idle);
    const [name, setName] = useState<string | undefined>(session.data?.user?.name ?? undefined);
    const [email, setEmail] = useState<string>(session.data?.user?.email ?? "");
    const [message, setMessage] = useState<string>("");

    const buttonText = useMemo(() => {
        if (status === Status.idle) return "send";
        else if (status === Status.loading) return "sending...";
        else if (status === Status.success) return "sent";
        else if (status === Status.error) return "oops... try again?";
        console.warn("ContactForm: button text for status -", status, "- was not handled");
        return "send";
    }, [status]);

    const handleChange = useCallback(<T extends HTMLInputElement | HTMLTextAreaElement>(e: ChangeEvent<T>) => {
        if (e.target.name === "name") setName(e.target.value.length ? e.target.value : undefined);
        else if (e.target.name === "email") setEmail(e.target.value);
        else if (e.target.name === "message") setMessage(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(Status.loading);

        try {
            const body = ContactBodySchema.safeParse({
                userId: session.data?.user?.id,
                name,
                email,
                message,
            } satisfies z.infer<typeof ContactBodySchema>);

            if (!body.success) {
                const fields = Object.keys(body.error.format());
                let errors: ErrorFields = null;

                if (fields.includes("name")) {
                    errors = Object.assign(errors ?? {}, { name: true } satisfies ErrorFields);
                }

                if (fields.includes("email")) {
                    errors = Object.assign(errors ?? {}, { email: true } satisfies ErrorFields);
                }

                if (fields.includes("message")) {
                    errors = Object.assign(errors ?? {}, { message: true } satisfies ErrorFields);
                }

                setErrorFields(errors);
                setStatus(Status.error);
                console.error(generateErrorMessage(body.error.issues));

                return;
            }

            const headers = new Headers();
            headers.set("Content-Type", "application/json");

            const result = await fetch(origin + URLS.API_CONTACT, {
                method: "POST",
                headers,
                credentials: "same-origin",
                body: JSON.stringify(body.data),
            });

            console.log(await result.text());
            setStatus(Status.success);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch ({ stack, message }: any) {
            setStatus(Status.error);
            console.error(stack);
            console.error("contact form submition failed,", message);
        }
    }, [email, message, name, session.data?.user?.id]);

    useEffect(() => {
        if (!(status === Status.success || status === Status.error)) return;
        const timeout = setTimeout(() => setStatus(Status.idle), 4206.9);
        return () => clearTimeout(timeout);
    }, [status]);

    useEffect(() => {
        if (!errorFields || !Object.values(errorFields).includes(true)) return;
        const timeout = setTimeout(() => setErrorFields(null), 4206.9);
        return () => clearTimeout(timeout);
    }, [errorFields]);

    useEffect(() => {
        if (session.status !== "authenticated") return;
        if (session.data.user?.name) setName(session.data.user.name);
        if (session.data.user?.email) setEmail(session.data.user.email);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session.status]);

    return (
        <form role="form" onSubmit={handleSubmit} className={`${props.className ?? ""} flex flex-col gap-4`}>
            <span className="flex flex-wrap justify-between gap-4">
                <Input
                    required={false}
                    inputMode="text"
                    label="name"
                    name="name"
                    value={name ?? ""}
                    placeholder="full name"
                    autoCorrect="off"
                    autoCapitalize="none"
                    autoComplete="name"
                    maxLength={255}
                    className={`block border ${errorFields?.name ? "border-red-500" : ""} border-gray-300 placeholder-gray-400 bg-white dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2`}
                    labelClass="flex-1"
                    onChange={handleChange<HTMLInputElement>}
                />

                <Input
                    required={true}
                    type="email"
                    inputMode="email"
                    label="email"
                    name="email"
                    value={email}
                    placeholder="email address"
                    autoCorrect="off"
                    autoCapitalize="none"
                    autoComplete="email"
                    maxLength={255}
                    className={`border ${errorFields?.email ? "border-red-500" : ""} border-gray-300 placeholder-gray-400 bg-white dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2`}
                    labelClass="flex-1"
                    onChange={handleChange<HTMLInputElement>}
                />
            </span>

            <span className="flex flex-col gap-2">
                <Textarea
                    required={true}
                    inputMode="text"
                    label="message"
                    name="message"
                    value={message}
                    placeholder="what's up?"
                    autoCorrect="off"
                    autoCapitalize="none"
                    maxLength={964.20}
                    rows={7}
                    cols={1}
                    className={`resize-none border ${errorFields?.message ? "border-red-500" : ""} border-gray-300 placeholder-gray-400 bg-white dark:bg-black focus:outline-[var(--clr-orange)] focus:outline-dotted focus:outline-2`}
                    onChange={handleChange<HTMLTextAreaElement>}
                />
            </span>

            <Button
                type="submit"
                className={`${status === Status.error ? "!border-red-500 !text-red-500" : status === Status.success ? "!border-green-500 !text-green-500" : ""} button !py-3 mt-4 border-gray-400 bg-white dark:bg-black`}
            >
                {buttonText}
            </Button>
        </form>
    );
}
