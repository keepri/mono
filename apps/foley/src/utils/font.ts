import { Inconsolata, Londrina_Sketch, Jua } from "next/font/google";

export const inconsolata = Inconsolata({
    weight: ["200", "300", "400", "500", "700"],
    subsets: ["latin"],
    // preload: true,
    variable: "--font-inconsolata",
});

export const londrinaSketch = Londrina_Sketch({
    weight: "400",
    subsets: ["latin"],
    style: ["normal"],
    // preload: true,
    variable: "--font-londrina-sketch",
});

export const jua = Jua({
    weight: "400",
    subsets: ["latin"],
    // preload: true,
    variable: "--font-jua",
});

export const fontLondrinaSketch = `${londrinaSketch.variable} font-londrina-sketch`;
export const fontInconsolata = `${inconsolata.variable} font-inconsolata`;
export const fontJua = `${jua.variable} font-jua`;
