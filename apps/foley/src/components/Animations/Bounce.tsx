import { fontLondrinaSketch } from "@utils/font";
import {
    forwardRef,
    type PropsWithRef,
    type HTMLAttributes,
    type PropsWithChildren,
} from "react";

type Props = HTMLAttributes<HTMLSpanElement> &
    PropsWithChildren & {
        enabled?: boolean;
    };

const Bounce = forwardRef<HTMLSpanElement, PropsWithRef<Props>>(
    ({ children, enabled = true, className, ...rest }, ref) => {
        return (
            <span
                ref={ref}
                className={`${
                    className ?? ""
                } flex items-center justify-center gap-1`}
                {...rest}
            >
                <span
                    ref={(dotOne) => {
                        if (!dotOne) return;
                        setTimeout(() => {
                            if (enabled) {
                                dotOne.classList.add("motion-safe:animate-bounce");
                            }
                        }, 342.69);
                    }}
                    className={`${
                        !enabled ? "hidden" : ""
                    } m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
                >
                    .
                </span>
                <span
                    ref={(dotTwo) => {
                        if (!dotTwo) return;
                        setTimeout(() => {
                            if (enabled) {
                                dotTwo.classList.add("motion-safe:animate-bounce");
                            }
                        }, 117.42);
                    }}
                    className={`${
                        !enabled ? "hidden" : ""
                    } m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
                >
                    .
                </span>
                <span
                    ref={(dotThree) => {
                        if (!dotThree) return;
                        setTimeout(() => {
                            if (enabled) {
                                dotThree.classList.add("motion-safe:animate-bounce");
                            }
                        }, 69.42);
                    }}
                    className={`${
                        !enabled ? "hidden" : ""
                    } m-0 p-0 text-xl dark:text-white leading-none ${fontLondrinaSketch}`}
                >
                    .
                </span>
                <span
                    className={`${!children ? "hidden" : "ml-1"} ${
                        enabled ? "motion-safe:animate-bounce" : ""
                    }`}
                >
                    {children}
                </span>
            </span>
        );
    }
);

export default Bounce;
