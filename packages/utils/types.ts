// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R>
    ? R
    : unknown;

export type WithRequired<Type, Key extends keyof Type> = Omit<Type, Key> & Required<Pick<Type, Key>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
