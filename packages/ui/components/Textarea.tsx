import { FC, TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	initialValue?: string;
}

export const Textarea: FC<Props> = ({ className, initialValue, ...rest }) => {
	return (
		<textarea className={`input-base ${className}`} {...rest}>
			{initialValue}
		</textarea>
	);
};
