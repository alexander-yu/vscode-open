import { Config } from './config';
import { Range } from './range';
import { getRegexes } from './regex';

export { Range } from './range';
export { getRegexes } from './regex';

export function extract(config: Config, uri: string): [string, Range | null] {
    let range: Range | null = null;
    let match: RegExpExecArray | null = null;

    for (const regex of getRegexes(config, true)) {
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

export function toFragment(config: Config, range: Range): string {
    const linePrefix = config.linePrefix || '';

    if (range.start === range.end) {
        return `${config.lineSeparator}${linePrefix}${range.start.toString()}`;
    }
    return (
        `${config.lineSeparator}${linePrefix}${range.start.toString()}` +
        `${config.lineRangeSeparator}${linePrefix}${range.end.toString()}`
    );
}
