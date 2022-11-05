/* eslint-disable indent */
import { Button, ReplacePair, Textarea } from '@clfxc/ui';
import { ReplacePairName } from '@clfxc/ui/types';
import styles from '@styles/Replace.module.scss';
import type { NextPage } from 'next';
import { ChangeEvent, ChangeEventHandler, useCallback, useLayoutEffect, useState, useTransition } from 'react';

type Declaration = Record<ReplacePairName, string>;

const initDeclaration: Declaration = { replace: '', replaceValue: '' };

const ReplaceTextPage: NextPage = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, startTransition] = useTransition();

	const [declarations, updateDeclarations] = useState<Declaration[]>([initDeclaration]);
	const [input, updateInput] = useState<string>('');
	const [output, updateOutput] = useState<string>('');
	const [autoSubmit, setAutoSubmit] = useState<boolean>(false);

	const handleChangeReplacePair = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
		updateDeclarations((d) => {
			const target = e.target;
			const name = target.name as ReplacePairName;
			const value = target.value;
			const newDeclarations = Array.from(d).map((declaration, idx) =>
				index === idx ? { ...declaration, [name]: value } : declaration
			);

			return newDeclarations;
		});
	}, []);

	const handleClearReplacePair = useCallback((index: number) => {
		updateDeclarations((d) => {
			// eslint-disable-next-line max-len
			const newDeclarations = Array.from(d).map((declaration, idx) => (index === idx ? initDeclaration : declaration));

			return newDeclarations;
		});
	}, []);

	const handleOutputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		updateOutput(e.target.value);
	}, []);

	const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		updateInput(e.target.value);
	}, []);

	const handleAddReplacePair = useCallback(() => {
		updateDeclarations((d) => [...d, initDeclaration]);
	}, []);

	const handleRemoveReplacePair = useCallback((index: number) => {
		updateDeclarations((d) => [...d].filter((_, i) => i !== index));
	}, []);

	const handleSubmit = () => {
		if (!input?.length) return;
		let output: string = String(input);

		for (const declaration of declarations) {
			if (!declaration.replace.length || !declaration.replaceValue.length) continue;
			const newOutput = output.split(declaration.replace).join(declaration.replaceValue);
			output = newOutput;
		}

		updateOutput(output);
	};

	// submit key combination event listener
	useLayoutEffect(() => {
		const listener = (e: DocumentEventMap['keydown']) => {
			const isMetaKey = e.metaKey;
			const isEnterKey = e.code.toLowerCase() === 'enter';
			isMetaKey && isEnterKey && setAutoSubmit(true);
		};

		document.addEventListener('keydown', listener);

		return () => document.removeEventListener('keydown', listener);
	}, []);

	// auto submit
	useLayoutEffect(() => {
		if (!autoSubmit) return;
		startTransition(() => {
			handleSubmit();
		});
		setAutoSubmit(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoSubmit]);

	return (
		<div className={styles['container']}>
			<aside className="flex flex-col gap-2.5 p-2">
				<Button className="w-full font-nixie-one font-bold" onClick={handleAddReplacePair}>
					+
				</Button>
				<ReplacePair
					key={'replace-pair-' + 1}
					index={0}
					replace={declarations[0].replace}
					replaceValue={declarations[0].replaceValue}
					label1="replace"
					label2="with"
					className="w-full font-nixie-one"
					labelClass="font-nixie-one"
					handleChange={handleChangeReplacePair}
					clear={handleClearReplacePair}
					remove={handleRemoveReplacePair}
				/>
				{Boolean(declarations.length > 1) &&
					declarations.map(
						({ replace, replaceValue }, index) =>
							index > 0 && (
								<ReplacePair
									key={'replace-pair-' + index + 1}
									index={index}
									replace={replace}
									replaceValue={replaceValue}
									label1="replace"
									label2="with"
									className="w-full font-nixie-one"
									labelClass="font-nixie-one"
									handleChange={handleChangeReplacePair}
									clear={handleClearReplacePair}
									remove={handleRemoveReplacePair}
								/>
							)
					)}
			</aside>
			<section className="p-2">
				<Textarea className="font-nixie-one" placeholder="Input" value={input} onChange={handleInputChange} />
				<Textarea className="font-nixie-one" placeholder="Output" value={output} onChange={handleOutputChange} />
				<div style={{ minHeight: '50px' }}>
					<Button className="w-full h-full font-nixie-one" onClick={handleSubmit}>
						start
					</Button>
				</div>
			</section>
		</div>
	);
};

export default ReplaceTextPage;
