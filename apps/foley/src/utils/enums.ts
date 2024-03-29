export enum StateStatus {
    idle = "idle",
    loading = "loading",
    failed = "failed",
}

export enum URLS {
    // WEBSITE
    HOME = "/",
    REPLACE = "/replace",
    SMOL = "/s",
    QR = "/qr",
    CLOSET = "/closet",
    BLOG = "/blog",

    // API
    API_AUTH = "/api/auth",
    API_SMOL = "/api/smol",
    API_QR = "/api/qr",
    API_EMAIL = "/api/email",
    API_CONTACT = "/api/contact",
    API_SMOL_CREATE = `${URLS.API_SMOL}/create`,
    API_QR_CREATE = `${URLS.API_QR}/create`,
    API_EMAIL_SEND = `${URLS.API_EMAIL}/send`,
}

export enum Langs {
    en = "en",
    ro = "ro",
}

export enum AuthProvider {
    github = "github",
}

export enum RoleName {
    user = "user",
    admin = "admin",
}

export enum StorageKey {
    qrInput = "kdv-qr-input",
    qrMargin = "kdv-qr-margin",
    qrPatternColor = "kdv-qr-pattern",
    qrBackgroundColor = "kdv-qr-background",
    theme = "kdv-theme",
}

export enum ImageType {
    png = "image/png",
    jpeg = "image/jpeg",
    jpg = "image/jpg",
    svg = "image/svg",
    gif = "image/gif",
    webp = "image/webp",
}

export enum FileType {
    pdf = "application/pdf",
    ppt = "application/vnd.ms-powerpoint",
    pptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    msword = "application/msword",
    mswordx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    text = "text/plain",
    mp4 = "video/mp4",
    mp3 = "audio/mpeg",
    mpeg = "video/mpeg",
    json = "application/json",
    webm = "video/webm",
}

// HEAD
export enum TITLE {
    HOME = "Home",
}

export enum DESCRIPTION {
    HOME = "Description",
}

export enum OG_DESCRIPTION {
    HOME = "Description",
}

export enum OG_TITLE {
    HOME = "Home",
}

export enum KEYWORDS {
    HOME = "home",
}
