import Image from "next/image";
import { FC } from "react";
import Envelope from "./Envelope";
import { Link } from "./Link";

interface Props {
	available: boolean;
	photo: string;
	name: string;
	description: string;
	price: number;
	// quantity: number;
	currency?: string;
}

export const ProductCard: FC<Props> = ({ photo, name, description, price, currency }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-10 px-4 py-5 bg-[var(--clr-bg-500)] rounded border-[var(--clr-orange)] border-[1px] w-[17rem] h-[27rem]">
            <Image
                src={photo}
                alt={`A photo of the ${name} that I am selling. It ain't no lie, baby, buy buy buy!`}
                width={300}
                height={300}
                style={{ objectFit: "contain" }}
                className="drop-shadow-xl"
            />
            <div className="flex flex-col justify-between items-center gap-4">
                <h4 className="font-underdog text-lg text-center text-white leading-tight">{name}</h4>
                <p className="font-nixie-one text-center text-white text-[.85rem]">{description}</p>
                <div className="flex justify-between items-center gap-6">
                    <Link
                        href="mailto:hi@kipri.dev"
                        className="flex items-center justify-between gap-2 text-[var(--clr-white)] leading-tight whitespace-nowrap hover:text-[var(--clr-bg-500)] hover:bg-[var(--clr-orange)]"
                    >
                        <Envelope />
						contact
                    </Link>
                    <p className="flex items-center gap-1 font-londrina-sketch text-[2rem] text-[var(--clr-orange)] font-bold">
                        {price}
                        <small className="relative" data-tooltip="RON">
                            {currency || "🦁"}
                        </small>
                    </p>
                </div>
            </div>
        </div>
    );
};
