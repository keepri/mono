import { FC, TextareaHTMLAttributes, useId } from 'react';

interface Props extends TextareaHTMLAttributes<Omit<HTMLTextAreaElement, 'id'>> {
	initialValue?: string;
	label?: string;
}

export const Textarea: FC<Props> = ({ className, initialValue, rows, cols, label, ...rest }) => {
	const id = useId();

	return (
		<>
			<label htmlFor={id}>{label}</label>
			<textarea id={id} rows={rows} cols={cols} className={`input-base ${className}`} {...rest}>
				{initialValue}
			</textarea>
		</>
	);
};
