// @refresh reload
import { Suspense, type JSXElement } from "solid-js";
import { Body, ErrorBoundary, FileRoutes, Head, Html, Link, Meta, Route, Routes, Scripts, Title } from "solid-start";
import { QueryProvider } from "@prpc/solid";
import { queryClient, trpc } from "~/utils/trpc";
import NotFound from "./components/NotFound";
import "./root.css";

export default function Root(): JSXElement {
    return (
        <Html lang="en">
            <Head>
                <Title>NIKA Marketing Agency</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta name="theme-color" content="#F8C8DC" />
                <Meta name="description" content="Template" />
                <Link rel="icon" href="/favicon.ico" />
            </Head>
            <Body>
                {/** @ts-expect-error should be fixed with an @tanstack/solid-query package update */}
                <trpc.Provider queryClient={queryClient}>
                    <QueryProvider>
                        <Suspense>
                            <ErrorBoundary>
                                <Routes>
                                    <FileRoutes />
                                    <Route path="*" component={NotFound} />
                                </Routes>
                            </ErrorBoundary>
                        </Suspense>
                    </QueryProvider>
                </trpc.Provider>
                <Scripts />
            </Body>
        </Html>
    );
}
