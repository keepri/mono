import { ProductCard } from "@clfxc/ui";

export default function ClosetPage(): JSX.Element {
    return (
        <main className="min-h-screen bg-[var(--clr-bg-300)]">
            <header className="grid place-items-center py-4">
                <h1
                    style={{ fontSize: "clamp(4rem, 15vw, 10rem)" }}
                    className="font-londrina-sketch leading-tight whitespace-nowrap text-white"
                >
                    CLOSET
                </h1>
                <p className="font-underdog text-white">Stuff I no longer use or need.</p>
                <p className="font-underdog text-white">How did you get here, you sneaky snake? 🐍</p>
            </header>
            <ProductCard
                available={true}
                name="FNATIC Rush G1 MX Blues Mechanical Keyboard"
                description="A product that is for testing purposes and lalalalala 123 haha xD"
                photo="/images/keyboard.png"
                price={350}
            />
        </main>
    );
}
