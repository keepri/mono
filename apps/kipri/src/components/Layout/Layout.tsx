import { FC, ReactNode } from 'react';

import Footer from '@components/Layout/Footer/Footer';
import Navbar from '@components/Navbar/Navbar';

interface Props {
	children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<main>
			<Navbar />
			{children}
			<Footer />
		</main>
	);
};

export default Layout;
