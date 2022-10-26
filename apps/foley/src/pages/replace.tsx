/* eslint-disable indent */
import { Button, ReplacePair, Textarea } from '@clfxc/ui';
import { ReplacePairName } from '@clfxc/ui/types';
import styles from '@styles/Replace.module.scss';
import type { NextPage } from 'next';
import { ChangeEventHandler, useCallback, useMemo, useRef, useState } from 'react';

type Declaration = Record<ReplacePairName, string>;
type Declarations = Record<string, Declaration>;

type Fields = { input: string; declarations: Declarations };

// interface Props {}

const initFields: Fields = { input: '', declarations: {} };

const ReplaceTextPage: NextPage = () => {
	const fields = useRef<Fields>(initFields);

	const [pairs, setPairs] = useState<number>(1);
	const [output, updateOutput] = useState<string>('');

	const handleChangeReplacePair: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		const target = e.target;
		const id = target.id;
		const name = target.name as ReplacePairName;

		const f = fields.current;
		fields.current = {
			...f,
			declarations: { ...f.declarations, [id]: { ...f.declarations[id], [name]: e.target.value } },
		};
	}, []);

	const handleOutputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		updateOutput(e.target.value);
	}, []);

	const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		const f = fields.current;
		fields.current = { ...f, input: e.target.value };
	}, []);

	const handleSubmit = useCallback(() => {
		const input = fields.current.input;
		const declarations = fields.current.declarations ?? {};
		let output: string = String(input);

		if (!input?.length) return;

		for (const key in declarations) {
			const declaration = declarations[key as keyof typeof declarations];
			if (!declaration.replace.length || !declaration.replaceValue.length) continue;

			const newOutput = output.split(declaration.replace).join(declaration.replaceValue);
			output = newOutput;
		}

		updateOutput(output);
	}, []);

	const handleAddReplacePair = useCallback(() => {
		setPairs((prev) => prev + 1);
	}, []);

	// DOM REPLACE DECLARATION FIELDS
	const ReplacePairInputGroups = useMemo(() => {
		return new Array(pairs).fill('').map((_, index) => {
			return (
				<ReplacePair
					key={'replace-pair-' + index + 1}
					ref={(inputRef) =>
						inputRef &&
						(fields.current.declarations = {
							...fields.current.declarations,
							[inputRef.id]: { replace: '', replaceValue: '' },
						})
					}
					className="w-full"
					onChange={handleChangeReplacePair}
				/>
			);
		});
	}, [pairs, handleChangeReplacePair]);

	return (
		<div className={styles['container']}>
			<aside className="flex flex-col gap-2.5 p-2">
				<Button className="w-full" onClick={handleAddReplacePair}>
					+
				</Button>
				{ReplacePairInputGroups}
			</aside>
			<section className="p-2">
				<Textarea className="" placeholder="Input" onChange={handleInputChange} />
				<Textarea className="" value={output} onChange={handleOutputChange} placeholder="Output" />
				<div style={{ minHeight: '50px' }}>
					<Button className="w-full h-full" onClick={handleSubmit}>
						Replace
					</Button>
				</div>
			</section>
		</div>
	);
};

export default ReplaceTextPage;
