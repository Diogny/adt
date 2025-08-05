export declare const centerStr: (s: string, width: number) => string;
export declare const centerPadStr: (str: string, width: number, leftStr: string, rightStr: string) => string;
export declare const replaceAt: (str: string, index: number, replacement: string) => string;
export declare const matrix: <T>(rows: number, cols: number, filler: T) => T[][];
export declare const enumConditional: (start: number, max: number, discovered: (ndx: number) => boolean) => {
    current: () => number;
    next: () => boolean;
};
export declare const tag: (tagName: string, id: string, nsAttrs: any) => SVGElement;
export declare const svg: (html: string) => Element;
