import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: FC<PropsWithChildren<Props>> = ({ children, className, ...rest }) => {
	return (
		<button className={`button-base ${className}`} {...rest}>
			{children}
		</button>
	);
};
