import { fontJua } from "@utils/font";
import { type NextPage } from "next/types";
import { Link } from "ui/components/Link";
import { Balancer } from "react-wrap-balancer";
import ContactForm from "@components/ContactForm";
import Section from "@components/Section";
import Rocket from "@components/Svg/Rocket";

const HomePage: NextPage = () => {
    return (
        <div className="grid sm:place-items-center place-items-start lg:gap-32 gap-16 bg-ivory dark:bg-black dark:text-white">
            <HeroSection />
            <SkillsSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;

function HeroSection(): JSX.Element {
    return (
        <Section className="flex justify-between items-center max-sm:flex-wrap max-sm:gap-4">
            <div>
                <h1
                    style={{ fontSize: "clamp(18px, 7vw, 60px)" }}
                    className={`max-lg:mt-10 xs:mb-6 mb-4 sm:max-w-[24ch] max-w-[18ch] max-sm:leading-tight leading-none ${fontJua}`}
                >
                    Fullstack<small className="max-sm:text-sm text-lg">web</small> Connoisseur at Your Service
                </h1>

                <p className="max-sm:mb-8 mb-12 max-xs:text-sm text-lg">
                    <Balancer>
                        Until I leave for Mars, <br className="max-xs:hidden" />let&apos;s build cool stuff together! ✌️
                    </Balancer>
                </p>

                <Link href="#contact" className="button text-center bg-white dark:bg-black border-gray-400 hover:text-[var(--clr-orange)]">
                    let&apos;s talk
                </Link>
            </div>

            <Rocket />
        </Section>
    );
}

function SkillsSection(): JSX.Element {
    return (
        <Section>
            <h2 className={`lg:mb-10 mb-6 font-bold text-4xl ${fontJua}`}>Skills</h2>

            <div className="grid sm:grid-cols-2 gap-12">
                <Skill
                    title="Backend Proficiency"
                    description="My favorite part of web dev! I enjoy using Node, Express, APIs, Stripe, Supabase, PlanetScale, Auth.js, Firebase and the list goes on... and on..."
                />

                <Skill
                    title="Frontend Savvy"
                    description="React with Next is my go to, but I also love Solid and Leptos."
                />

                <Skill
                    title="Mobile Enthusiasm"
                    description="React-Native and Swift is what I use for iOS and Android apps, although it's not my best."
                />

                <Skill
                    title="Database Expertise"
                    description="MySQL, NoSQL - you name it, I've got it!"
                />

                <Skill
                    title="Infrastructure"
                    description="I thrive on infrastructure selection, meticulously considering various options to create the optimal setup for you."
                />

                <Skill
                    title="Passionate Troubleshooter"
                    description="Overthinking is my superpower as I leave no stone unturned in search of resolutions."
                />
            </div>
        </Section>
    );
}

function Skill(props: { title: string; description: string; iconList?: Array<string> }): JSX.Element {
    return (
        <span className="max-w-[60ch]">
            <h3 className={`mb-2 text-xl font-medium ${fontJua}`}>
                {props.title}
            </h3>

            <p className="leading-snug">
                <Balancer>
                    {props.description}
                </Balancer>
            </p>
        </span>
    );
}

function ContactSection(): JSX.Element {
    return (
        <Section id="contact" className="max-xs:scroll-m-40 scroll-m-28">
            <h2 className={`lg:mb-10 mb-6 font-bold text-4xl ${fontJua}`}>
                Contact
            </h2>

            <span className="flex flex-wrap-reverse items-center gap-6">
                <ContactForm className="xs:flex-1 max-sm:w-full max-w-xl" />

                <span className="xs:flex-1 xs:max-w-[65ch] xs:mx-auto xs:text-lg xs:text-center">
                    <p>
                        <Balancer>
                            Have a thrilling project idea, a burning question, or just want to geek out about code?
                            I’m up for it all.
                        </Balancer>
                    </p>

                    <p className="max-xs:mt-2 mt-2 font-bold">
                        Let’s team up! 💪
                    </p>
                </span>
            </span>
        </Section>
    );
}
