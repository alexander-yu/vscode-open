import * as regex from './regex';

const LINE_REGEX = '(?<start>[0-9]+)(?:-(?<end>[0-9]+)$)?';

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

    match = RegExp(regex.escapeRegex(lineSeparator) + LINE_REGEX).exec(uri);
    if (match && match.groups) {
        const start = match.groups['start'];
        const end = match.groups['end'] || start;

        range = new Range(
            parseInt(start, 10),
            parseInt(end, 10),
        );
    }

    if (match) {
        uri = uri.slice(0, match.index);
    }

    return [uri, range];
}
