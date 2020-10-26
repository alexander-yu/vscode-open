import { Context } from './context';

const DEFAULT_LINE_PREFIXES = [
    '',
    // e.g. for GitHub, where line numbers are of the form L123-L124 instead of 123-124; hard-code this
    // since it's a relatively common line format
    'L',
];
const LINE_REGEX = '[0-9]+';

export function getRegexes(context: Context, captureGroups: boolean = false): RegExp[] {
    const linePrefixes = context.linePrefix === null ? DEFAULT_LINE_PREFIXES : [context.linePrefix];
    return linePrefixes.map(
        linePrefix => new RegExp(toRegex(linePrefix, context.lineSeparator, context.lineRangeSeparator, captureGroups))
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
