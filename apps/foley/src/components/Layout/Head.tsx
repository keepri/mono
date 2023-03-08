import { useRouter } from "next/router";
import { default as NextHead } from "next/head";
import { DESCRIPTION, KEYWORDS, Langs, OG_DESCRIPTION, OG_TITLE, TITLE } from "@declarations/enums";
import { siteName } from "@utils/misc";

interface Props {
    keywords?: KEYWORDS;
    title?: TITLE;
    desc?: DESCRIPTION;
    ogTitle?: OG_TITLE;
    ogDesc?: OG_DESCRIPTION;
    previewImage?: string;
}

export default function Head({
    keywords = KEYWORDS.HOME,
    title = TITLE.HOME,
    desc = DESCRIPTION.HOME,
    ogTitle = OG_TITLE.HOME,
    ogDesc = OG_DESCRIPTION.HOME,
    previewImage,
}: Props): JSX.Element {
    const { locale } = useRouter();
    const url = typeof location !== "undefined" && location.href;

    return (
        <NextHead>
            <title>{`${siteName} | ${title}`}</title>
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta name="keywords" content={keywords} />
            <meta name="description" content={desc} />
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.ico" />

            {/* OG METADATA */}
            <meta property="og:title" content={ogTitle} key="ogtitle" />
            <meta property="og:type" content="website" key="ogtype" />
            <meta property="og:image" content={previewImage ?? "/default-preview-jpeg.jpeg"} key="ogimage" />
            {url && <meta property="og:url" content={url} key="ogurl" />}
            <meta property="og:locale" content={locale ?? Langs.en} key="oglocale" />
            <meta property="og:description" content={ogDesc} key="ogdesc" />
            <meta property="og:site_name" content={siteName} key="ogsitename" />
        </NextHead>
    );
}
