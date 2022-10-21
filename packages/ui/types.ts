export type WithRequired<Type, Key extends keyof Type> = Omit<Type, Key> & Required<Pick<Type, Key>>;
export type ReplacePairId = `declaration-${string}`;
export type ReplacePairName = 'replace' | 'replaceValue';
