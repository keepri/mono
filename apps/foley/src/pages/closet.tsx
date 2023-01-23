import { ProductCard } from '@clfxc/ui';
import type { NextPage } from 'next/types';

// interface Props {}

const ClosetPage: NextPage = () => {
	return (
		<main className="min-h-screen bg-[var(--clr-bg-300)]">
			<header className="grid place-items-center py-4">
				<h1
					style={{ fontSize: 'clamp(4rem, 15vw, 10rem)' }}
					className="font-londrina-sketch leading-tight whitespace-nowrap text-white"
				>
					CLOSET
				</h1>
				<p className="font-underdog text-white">Stuff I no longer use or need.</p>
			</header>
			<ProductCard
				available={true}
				name="Test product 123 Lalalallalalalala"
				description="A product that is for testing purposes and lalalalala 123 haha xD"
				photo="/images/keyboard.png"
				price={100}
			/>
		</main>
	);
};

export default ClosetPage;
