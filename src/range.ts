import * as regex from './regex';

// TODO (ayu): docstrings

class RangeRegex {
    lineRegex: string;
    linePrefix: string;

    constructor(lineRegex: string, linePrefix: string) {
        this.lineRegex = lineRegex;
        this.linePrefix = linePrefix || '';
    }

    toRegex(lineSeparator: string, captureGroups: boolean = false): string {
        if (captureGroups) {
            return (
                `${escapeRegex(lineSeparator)}` +
                `${this.linePrefix}(?<start>${this.lineRegex})` +
                `(?:-${this.linePrefix}(?<end>${this.lineRegex}))?$`
            );
        }
        return (
            `${escapeRegex(lineSeparator)}` +
            `${this.linePrefix}${this.lineRegex}` +
            `(?:-${this.linePrefix}${this.lineRegex})?`
        );
    }
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
}

export const REGEXES : RangeRegex[] = [
    new RangeRegex('[0-9]+', ''),
    // e.g. for GitHub, where line numbers are of the form L123-L124 instead of 123-124; hard-code this
    // since it's a relatively common line format
    new RangeRegex('[0-9]+', 'L'),
];

export class Range {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    toFragment(lineSeparator: string, linePrefix: string): string {
        if (this.start === this.end) {
            return `${lineSeparator}${linePrefix}${this.start.toString()}`;
        }
        return `${lineSeparator}${linePrefix}${this.start.toString()}-${linePrefix}${this.end.toString()}`;
    }
}

export function extractRangeFromURI(lineSeparator: string, uri: string): [string, Range | null] {
    let range: Range | null = null;
    let match: RegExpExecArray | null = null;

    for (const regex of REGEXES) {
        match = RegExp(regex.toRegex(lineSeparator, true)).exec(uri);
        if (match) {
            break;
        }
    }

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
