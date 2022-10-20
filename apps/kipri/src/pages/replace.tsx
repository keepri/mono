import { Button, ReplacePair, Textarea } from '@clfxc/ui';
import { ReplacePairName } from '@clfxc/ui/types';
import styles from '@styles/Replace.module.scss';
import type { NextPage } from 'next';
import { ChangeEventHandler, useCallback } from 'react';

// interface Props {}

// const initInputsState = { '0': { replace: '', with: '' } };

const ReplaceTextPage: NextPage = () => {
	const handleChangeReplacePair: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		const target = e.target;
		const name = target.name as ReplacePairName;
	}, []);

	return (
		<div className={styles['container']}>
			<aside className="flex flex-col gap-2.5 p-2">
				<ReplacePair onChange={handleChangeReplacePair} />
			</aside>
			<section className="p-2">
				<Textarea className="" placeholder="Input" />
				<Textarea className="" placeholder="Output" />
				<div className="">
					<Button>Replace</Button>
				</div>
			</section>
		</div>
	);
};

export default ReplaceTextPage;
