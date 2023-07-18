import { fontLondrinaSketch } from "@utils/font";
import { type HTMLAttributes, type PropsWithChildren } from "react";

type Props = HTMLAttributes<HTMLSpanElement> &
    PropsWithChildren & {
        enabled?: boolean;
    };

export default function Bounce({ children, enabled = true, className, ...rest }: Props): JSX.Element {
    return (
        <span className={`${className ?? ""} flex items-center justify-center gap-1`} {...rest}>
            <span
                ref={(dotOne) => setTimeout(() => enabled && dotOne?.classList.add("animate-bounce"), 342.69)}
                className={`${!enabled ? "hidden" : ""} m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
            >
                .
            </span>
            <span
                ref={(dotTwo) => setTimeout(() => enabled && dotTwo?.classList.add("animate-bounce"), 117.42)}
                className={`${!enabled ? "hidden" : ""} m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
            >
                .
            </span>
            <span
                ref={(dotThree) => setTimeout(() => enabled && dotThree?.classList.add("animate-bounce"), 69.42)}
                className={`${!enabled ? "hidden" : ""} m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
            >
                .
            </span>
            <span className={`${!children ? "hidden" : "ml-1"} ${enabled ? "animate-bounce" : ""}`}>{children}</span>
        </span>
    );
}
