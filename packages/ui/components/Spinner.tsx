import { FC, SVGProps } from "react";

export type SpinnerVarient = "puff" | "rings";

interface Props extends Omit<SVGProps<SVGSVGElement>, "id" | "height" | "width"> {
	variant: SpinnerVarient;
}

export const Spinner: FC<Props> = ({ variant, strokeWidth = 2, ...rest }) => {
    if (variant === "puff") {
        return (
            <svg
                id="spinner-puff"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#fff"
                strokeWidth={String(strokeWidth)}
                {...rest}
            >
                <g fill="none" fillRule="evenodd">
                    <circle cx="22" cy="22" r="1">
                        <animate
                            attributeName="r"
                            begin="0s"
                            dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="stroke-opacity"
                            begin="0s"
                            dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="22" cy="22" r="1">
                        <animate
                            attributeName="r"
                            begin="-0.9s"
                            dur="1.8s"
                            values="1; 20"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.165, 0.84, 0.44, 1"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="stroke-opacity"
                            begin="-0.9s"
                            dur="1.8s"
                            values="1; 0"
                            calcMode="spline"
                            keyTimes="0; 1"
                            keySplines="0.3, 0.61, 0.355, 1"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>
            </svg>
        );
    }

    if (variant === "rings") {
        return (
            <svg
                id="spinner-rings"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#fff"
                {...rest}
                strokeWidth={String(strokeWidth)}
            >
                <g fill="none" fillRule="evenodd" transform="translate(1 1)">
                    <circle cx="22" cy="22" r="6" strokeOpacity="0">
                        <animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite" />
                        <animate
                            attributeName="stroke-opacity"
                            begin="1.5s"
                            dur="3s"
                            values="1;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="stroke-width"
                            begin="1.5s"
                            dur="3s"
                            values="2;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="22" cy="22" r="6" strokeOpacity="0">
                        <animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite" />
                        <animate
                            attributeName="stroke-opacity"
                            begin="3s"
                            dur="3s"
                            values="1;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="stroke-width"
                            begin="3s"
                            dur="3s"
                            values="2;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="22" cy="22" r="8">
                        <animate
                            attributeName="r"
                            begin="0s"
                            dur="1.5s"
                            values="6;1;2;3;4;5;6"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>
            </svg>
        );
    }

    throw new Error("spinner component missing variant");
};
