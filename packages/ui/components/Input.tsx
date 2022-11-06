import { ChangeEvent, forwardRef, InputHTMLAttributes, PropsWithRef, useCallback } from 'react';
import { WithRequired } from '../types';

interface Props extends WithRequired<Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>, 'value'> {
	index?: number;
	onChange: (e: ChangeEvent<HTMLInputElement>, index?: number) => void;
}

export const Input = forwardRef<HTMLInputElement, PropsWithRef<Props>>(
	({ type = 'text', className, index, value, onChange, ...rest }, ref) => {
		const handleChange = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				onChange(e, index);
			},
			[index, onChange]
		);

		return (
			<input
				ref={ref}
				value={value}
				className={`input-base ${className}`}
				type={type}
				onChange={handleChange}
				{...rest}
			/>
		);
	}
);
