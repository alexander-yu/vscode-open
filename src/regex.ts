import { Context } from './context';
import * as range from './range';

const REGEX_TEMPLATES = new Set<string>(['file', 'lines']);
const STRING_REGEX_TEMPLATES = new Map<string, string>([
    ['file', '.+'],
]);

export function getRegex(context: Context, template: string): string {
    if (!REGEX_TEMPLATES.has(template)) {
        throw new Error(`${template} is not a valid regex template.`);
    }

    if (template === 'lines' && context.lineSeparator) {
        return range.REGEXES.map(
            regex => regex.toRegex(context.lineSeparator)
        ).map(
            regex => `(?:${regex})`
        ).join('|');
    }

    const string_template = STRING_REGEX_TEMPLATES.get(template);
    if (string_template) {
        return string_template;
    }

    throw new Error(`Internal error: regex template ${template} is not currently supported`);
}
