import * as regex from './regex';

const SINGLE_LINE_REGEX = '(?<line>[0-9]+)$';
const MULTI_LINE_REGEX = '(?<start>[0-9]+)-(?<end>[0-9]+)$';

// TODO (ayu): docstrings

export class Range {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    toFragment(lineSeparator: string): string {
        if (this.start === this.end) {
            return `${lineSeparator}${this.start.toString()}`;
        }
        return `${lineSeparator}${this.start.toString()}-${this.end.toString()}`;
    }
}

export function extractRangeFromURI(lineSeparator: string, uri: string): [string, Range | null] {
    let range: Range | null = null;
    let match: RegExpExecArray | null = null;

    match = RegExp(regex.escapeRegex(lineSeparator) + SINGLE_LINE_REGEX).exec(uri);
    if (match && match.groups) {
        const line = parseInt(match.groups['line'], 10);
        range = new Range(line, line);
    } else {
        match = RegExp(regex.escapeRegex(lineSeparator) + MULTI_LINE_REGEX).exec(uri);
        if (match && match.groups) {
            const start = parseInt(match.groups['start'], 10);
            const end = parseInt(match.groups['end'], 10);
            range = new Range(start, end);
        }
    }

    if (match) {
        uri = uri.slice(0, match.index);
    }

    return [uri, range];
}
