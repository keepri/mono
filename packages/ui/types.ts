export type WithRequired<Type, Key extends keyof Type> = Omit<Type, Key> & Required<Pick<Type, Key>>;
export type ReplacePairName = 'replace' | 'replaceValue';
