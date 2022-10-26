import { forwardRef, InputHTMLAttributes, PropsWithRef, useId } from 'react';
import { WithRequired } from '../types';
import { Button } from './Button';

type ReplacePairProps = WithRequired<Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' & 'id'>, 'onChange'>;

interface Props extends ReplacePairProps {
	replace?: string;
	replaceValue?: string;
	wrapperClass?: string;
	placeholder1?: string;
	placeholder2?: string;
	index?: number;
	remove?: (index: number) => void;
}

export const ReplacePair = forwardRef<HTMLSpanElement, PropsWithRef<Props>>(
	(
		{ index, className, replace, replaceValue, wrapperClass, placeholder1, placeholder2, onChange, remove, ...rest },
		ref
	) => {
		const id = useId();

		return (
			<span ref={ref} id={id} className={`flex justify-center items-center flex-wrap gap-2 ${wrapperClass}`}>
				<input
					name="replace"
					id={id}
					className={`input-base max-w-full ${className}`}
					value={replace}
					placeholder={placeholder1 ?? 'replace'}
					onChange={onChange}
					{...rest}
				/>
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
