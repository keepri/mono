import { londrinaSketch } from "@utils/misc";
import { type HTMLAttributes, type PropsWithChildren } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & PropsWithChildren & {
    enabled?: boolean;
};

export default function LoadingBounce({ children, enabled = true, className, ...rest }: Props): JSX.Element {
    const font = londrinaSketch.variable + " font-londrina-sketch";

    return (
        <span
            className={`flex gap-1 ${className ? className : ""}`}
            {...rest}
        >
            <span
                ref={(dotOne) => setTimeout(() => dotOne?.classList.add("animate-bounce"), 342.0)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span
                ref={(dotTwo) => setTimeout(() => dotTwo?.classList.add("animate-bounce"), 117)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span
                ref={(dotThree) => setTimeout(() => dotThree?.classList.add("animate-bounce"), 69)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span className={`${!children ? "hidden" : ""} ${enabled ? "animate-bounce" : ""}`}>
                {children}
            </span>
        </span>
    );
}
