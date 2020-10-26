import { Context } from './context';
import { Range } from './range';
import { getRegexes } from './regex';

export { Range } from './range';
export { getRegexes } from './regex';

export function extract(context: Context, uri: string): [string, Range | null] {
    let range: Range | null = null;
    let match: RegExpExecArray | null = null;

    for (const regex of getRegexes(context, true)) {
        match = regex.exec(uri);
        if (match) {
            break;
        }
    }

    if (match && match.groups) {
        const start = match.groups['start'];
        const end = match.groups['end'] || start;

        range = {
            start: parseInt(start, 10),
            end: parseInt(end, 10),
        };
    }

    if (match) {
        uri = uri.slice(0, match.index);
    }

    return [uri, range];
}

export function toFragment(context: Context, range: Range): string {
    const linePrefix = context.linePrefix || '';

    if (range.start === range.end) {
        return `${context.lineSeparator}${linePrefix}${range.start.toString()}`;
    }
    return (
        `${context.lineSeparator}${linePrefix}${range.start.toString()}` +
        `${context.lineRangeSeparator}${linePrefix}${range.end.toString()}`
    );
}
