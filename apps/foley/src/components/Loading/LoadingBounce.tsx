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
                ref={(dotOne) => setTimeout(() => enabled && dotOne?.classList.add("animate-bounce"), 342.69)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span
                ref={(dotTwo) => setTimeout(() => enabled && dotTwo?.classList.add("animate-bounce"), 117.42)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span
                ref={(dotThree) => setTimeout(() => enabled && dotThree?.classList.add("animate-bounce"), 69.420)}
                className={`${!enabled ? "hidden" : ""} ${font} m-0 p-0 text-xl text-white leading-none`}
            >
                .
            </span>
            <span className={`${!children ? "hidden" : "ml-1"} ${enabled ? "animate-bounce" : ""}`}>
                {children}
            </span>
        </span>
    );
}
