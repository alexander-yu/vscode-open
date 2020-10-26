import { Config } from './config';

const DEFAULT_LINE_PREFIXES = [
    '',
    // e.g. for GitHub, where line numbers are of the form L123-L124 instead of 123-124; hard-code this
    // since it's a relatively common line format
    'L',
];
const LINE_REGEX = '[0-9]+';

export function getRegexes(config: Config, captureGroups: boolean = false): RegExp[] {
    const linePrefixes = config.linePrefix === null ? DEFAULT_LINE_PREFIXES : [config.linePrefix];
    return linePrefixes.map(
        linePrefix => new RegExp(toRegex(linePrefix, config.lineSeparator, config.lineRangeSeparator, captureGroups))
    );
}

function toRegex(
    linePrefix: string,
    lineSeparator: string,
    lineRangeSeparator: string,
    captureGroups: boolean,
): string {
    if (captureGroups) {
        return (
            `${escapeRegex(lineSeparator)}` +
            `${linePrefix}(?<start>${LINE_REGEX})` +
            `(?:${lineRangeSeparator}${linePrefix}(?<end>${LINE_REGEX}))?$`
        );
    }
    return (
        `${escapeRegex(lineSeparator)}` +
        `${linePrefix}${LINE_REGEX}` +
        `(?:${lineRangeSeparator}${linePrefix}${LINE_REGEX})?$`
    );
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
}
