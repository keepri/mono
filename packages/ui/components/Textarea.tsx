import { FC, TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	initialValue?: string;
}

export const Textarea: FC<Props> = ({ className, initialValue, rows, cols, ...rest }) => {
	return (
		<textarea rows={rows} cols={cols} className={`input-base ${className}`} {...rest}>
			{initialValue}
		</textarea>
	);
};
