import * as constants from './constants';
import * as range from './range';

interface ContextParameters {
    lines?: range.Range;
    match?: RegExpExecArray;
    lineSeparator?: string;
}

export class Context {
    env: NodeJS.ProcessEnv;
    lines: range.Range | null;
    match: RegExpExecArray | null;
    lineSeparator: string;

    constructor({ lines, match, lineSeparator }: ContextParameters) {
        this.env = process.env;
        this.lines = lines || null;
        this.match = match || null;
        this.lineSeparator = lineSeparator || constants.DEFAULT_LINE_SEPARATOR;
    }
}
