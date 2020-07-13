export declare const toBool: (val: any) => boolean;
export declare const pad: (t: string, e: number, ch?: any) => string;
export declare const fillChar: (ch: string, len: number) => string;
export declare const padStr: (s: string, width: number) => string;
export declare const centerStr: (s: string, width: number) => string;
export declare const centerPadStr: (str: string, width: number, leftStr: string, rightStr: string) => string;
export declare const formatNumber: (n: number, width: number) => string;
export declare const replaceAt: (str: string, index: number, replacement: string) => string;
export declare const range: (s: number, e: number) => number[];
export declare const selectMany: <TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]) => TOut[];
export declare const matrix: <T>(rows: number, cols: number, filler: T) => T[][];
export declare const enumConditional: (start: number, max: number, discovered: (ndx: number) => boolean) => {
    current: () => number;
    next: () => boolean;
};
