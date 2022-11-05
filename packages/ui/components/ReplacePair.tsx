import { forwardRef, InputHTMLAttributes, PropsWithRef, useId } from 'react';
import { WithRequired } from '../types';
import { Button } from './Button';

type ReplacePairProps = WithRequired<
	Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' & 'id' & 'name'>,
	'onChange'
>;

interface Props extends ReplacePairProps {
	replace?: string;
	replaceValue?: string;
	wrapperClass?: string;
	labelClass?: string;
	placeholder1?: string;
	placeholder2?: string;
	label1?: string;
	label2?: string;
	index?: number;
	remove?: (index: number) => void;
}

export const ReplacePair = forwardRef<HTMLSpanElement, PropsWithRef<Props>>(
	(
		{
			index,
			className,
			wrapperClass,
			labelClass,
			replace,
			replaceValue,
			placeholder1,
			placeholder2,
			label1,
			label2,
			onChange,
			remove,
			...rest
		},
		ref
	) => {
		const id = useId();

		return (
			<span ref={ref} id={id} className={`flex justify-center items-center flex-wrap gap-2 ${wrapperClass}`}>
				{label1 && <label className={`text-sm leading-none text-left w-full ${labelClass}`}>{label1}</label>}
				<input
					name="replace"
					id={id}
					className={`input-base max-w-full ${className}`}
					value={replace}
					placeholder={placeholder1 ?? 'replace'}
					onChange={onChange}
					{...rest}
				/>
				{label2 && <label className={`text-sm leading-none text-left w-full ${labelClass}`}>{label2}</label>}
				<input
					name="replaceValue"
					id={id}
					className={`input-base max-w-full ${className}`}
					value={replaceValue}
					placeholder={placeholder2 ?? 'with'}
					onChange={onChange}
					{...rest}
				/>
				{Boolean(remove && index !== undefined) && (
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					<Button className="text-xs" onClick={() => remove!(index!)}>
						x
					</Button>
				)}
			</span>
		);
	}
);
