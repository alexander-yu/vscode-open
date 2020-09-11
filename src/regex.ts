import { Context } from './context';

const REGEX_TEMPLATES = new Map<string, string>([
    ['file', '.+'],
    ['lines', '[0-9]+(-[0-9]+)?'],
]);

export function getRegex(context: Context, template: string): string {
    let regex = REGEX_TEMPLATES.get(template);
    if (!regex) {
        throw new Error(`${template} is not a valid regex template.`);
    }

    if (template === 'lines' && context.lineSeparator) {
        regex = context.lineSeparator + regex;
    }

    return regex;
}
