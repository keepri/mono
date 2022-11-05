/* eslint-disable indent */
import { Button, ReplacePair, Textarea } from '@clfxc/ui';
import { ReplacePairName } from '@clfxc/ui/types';
import styles from '@styles/Replace.module.scss';
import type { NextPage } from 'next';
import {
	ChangeEvent,
	ChangeEventHandler,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
	useTransition,
} from 'react';

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
		const target = e.target;
		const name = target.name as ReplacePairName;
		const value = target.value;

		updateDeclarations((d) => {
			const newDeclarations = [...d];
			newDeclarations[index][name] = value;
			return newDeclarations;
		});
	}, []);

	const handleClearReplacePair = useCallback((index: number) => {
		updateDeclarations((d) => {
			const newDeclarations = [...d];
			newDeclarations[index].replace = '';
			newDeclarations[index].replaceValue = '';
			return newDeclarations;
		});
	}, []);

	const handleOutputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		updateOutput(e.target.value);
	}, []);

	const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		updateInput(e.target.value);
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

	const handleAddReplacePair = useCallback(() => {
		updateDeclarations((d) => [...d, initDeclaration]);
	}, []);

	const handleRemoveReplacePair = useCallback((index: number) => {
		updateDeclarations((d) => {
			const newDeclarations = [...d].filter((_, i) => i !== index);
			return newDeclarations;
		});
	}, []);

	useLayoutEffect(() => {
		const listener = (e: DocumentEventMap['keydown']) => {
			const isMetaKey = e.metaKey;
			const isEnterKey = e.code.toLowerCase() === 'enter';
			isMetaKey && isEnterKey && setAutoSubmit(true);
		};

		document.addEventListener('keydown', listener);

		return () => document.removeEventListener('keydown', listener);
	}, []);

	useEffect(() => {
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
				{/* {ReplacePairInputGroups} */}
				{declarations.map(({ replace, replaceValue }, index) => (
					<ReplacePair
						index={index}
						replace={replace}
						replaceValue={replaceValue}
						label1="replace"
						label2="with"
						key={'replace-pair-' + index + 1}
						className="w-full font-nixie-one"
						labelClass="font-nixie-one"
						handleChange={handleChangeReplacePair}
						clear={handleClearReplacePair}
						remove={handleRemoveReplacePair}
					/>
				))}
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
