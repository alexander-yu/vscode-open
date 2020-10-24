import * as constants from './constants';
import * as range from './range';

export class Context {
    env: NodeJS.ProcessEnv;
    lines: range.Range | null;
    match: RegExpExecArray | null;
    lineSeparator: string;
    linePrefix: string | null;

    constructor(lines?: range.Range) {
        this.env = process.env;
        this.lines = lines || null;
        this.match = null;
        this.lineSeparator = constants.DEFAULT_LINE_SEPARATOR;
        this.linePrefix = null;
    }
}
