/* eslint-disable indent */
import { Button, ReplacePair, Textarea } from '@clfxc/ui';
import { ReplacePairId, ReplacePairName } from '@clfxc/ui/types';
import styles from '@styles/Replace.module.scss';
import type { NextPage } from 'next';
import { ChangeEventHandler, useCallback, useRef, useState } from 'react';

type Declaration = Record<ReplacePairName, string>;

type Fields = {
	input: string;
	declarations: Record<ReplacePairId, Declaration>;
};

// interface Props {}

const initFields: Fields = {
	input: '',
	declarations: {
		'declaration-1': { replace: '', replaceValue: '' },
		'declaration-2': { replace: '', replaceValue: '' },
		'declaration-3': { replace: '', replaceValue: '' },
		'declaration-4': { replace: '', replaceValue: '' },
		'declaration-5': { replace: '', replaceValue: '' },
		'declaration-6': { replace: '', replaceValue: '' },
		'declaration-7': { replace: '', replaceValue: '' },
	},
};

const ReplaceTextPage: NextPage = () => {
	const fields = useRef<Fields>(initFields);

	const [output, updateOutput] = useState<string>('');

	const handleChangeReplacePair: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		const target = e.target;
		const id = target.id as ReplacePairId;
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

			do {
				output = output.replace(declaration.replace, declaration.replaceValue);
			} while (output.indexOf(declaration.replace) !== -1);
		}

		updateOutput(output);
	}, []);

	return (
		<div className={styles['container']}>
			<aside className="flex flex-col gap-2.5 p-2">
				<ReplacePair id="declaration-1" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-2" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-3" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-4" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-5" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-6" onChange={handleChangeReplacePair} />
				<ReplacePair id="declaration-7" onChange={handleChangeReplacePair} />
			</aside>
			<section className="p-2">
				<Textarea className="" placeholder="Input" onChange={handleInputChange} />
				<Textarea className="" value={output} onChange={handleOutputChange} placeholder="Output" />
				<div className="">
					<Button onClick={handleSubmit}>Replace</Button>
				</div>
			</section>
		</div>
	);
};

export default ReplaceTextPage;
