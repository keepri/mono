import { ChangeEvent, forwardRef, InputHTMLAttributes, PropsWithRef, useCallback } from 'react';

export type InputOnChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => void;

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	index?: number;
	onChange: InputOnChange;
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
