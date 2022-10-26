import Link from 'next/link';
import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: FC<PropsWithChildren<Props>> = ({ children, className, ...rest }) => {
	return (
		<Link className={`button-base ${className}`} {...rest}>
			{children}
		</Link>
	);
};
