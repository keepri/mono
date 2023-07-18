import { ProductCard } from "ui";
import { Section } from "@components/Section";
import { fontLondrinaSketch } from "@utils/font";

export default function ClosetPage(): JSX.Element {
    return (
        <div className="bg-ivory dark:bg-black">
            <Section>
                <header className="grid place-items-center mb-12 dark:text-white">
                    <h1
                        style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }}
                        className={`${fontLondrinaSketch} leading-tight whitespace-nowrap`}
                    >
                        CLOSET
                    </h1>

                    <p>Stuff I no longer use or need</p>

                    <p>How did you get here, you sneaky snek? 🐍</p>
                </header>

                <ProductCard
                    available={true}
                    name="FNATIC Rush G1 MX Blues Mechanical Keyboard"
                    description="A product that is for testing purposes and lalalalala 123 haha xD"
                    photo="/images/keyboard.png"
                    price={350}
                />
            </Section>
        </div>
    );
}
