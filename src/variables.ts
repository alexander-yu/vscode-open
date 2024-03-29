import { Context } from './context';
import { evaluateEditor } from './editor';
import { getRegex } from './regex';

const VARIABLE_REGEX = /\$\{(.+?)\}/g;

const VARIABLE_HANDLERS = new Map<string, (context: Context, value: string, argument: string | undefined) => string>([
    ['env', evaluateEnv],
    ['match', evaluateMatch],
    ['editor', evaluateEditor],
    ['regex', evaluateRegex],
]);

// TODO (ayu): docstrings

function evaluateEnv(context: Context, value: string, variable: string | undefined): string {
    if (!variable) {
        throw new Error(`${value} cannot be resolved because no environment variable name is given`);
    }

    const env = context.env[variable];
    if (env === undefined) {
        throw new Error(`Environment variable ${variable} does not exist`);
    }

    return env;
}

function evaluateMatch(context: Context, value: string, group: string | undefined): string {
    // TODO (ayu): validation against the argument; is the argument validly formed?
    // Does the argument exist in the match?
    // Handle group numbers too
    if (!context.match) {
        throw new Error(`${value} cannot be resolved because there is no regex match`);
    } else if (!context.match.groups) {
        throw new Error(`${value} cannot be resolved because there are no regex capture groups to match`);
    } else if (!group) {
        throw new Error(`${value} cannot be resolved because no regex capture group is given`);
    }
    return context.match.groups[group];
}

function evaluateRegex(context: Context, value: string, template: string | undefined): string {
    if (!template) {
        throw new Error(`${value} cannot be resolved because no regex template name is given`);
    }
    const regex = getRegex(context, template);
    return `(?<${template}>${regex})`;
}

function evaluate(value: string, variable: string, context: Context): string {
    let argument: string | undefined;
    const parts = variable.split(':');

    if (parts.length > 1) {
        variable = parts[0];
        argument = parts.slice(1).join(':');
    }

    const handler = VARIABLE_HANDLERS.get(variable);
    if (handler) {
        return handler(context, value, argument);
    }

    return value;
}

export function resolve(value: string, context: Context): string {
    const replaced = value.replace(VARIABLE_REGEX, (match: string, variable: string): string => {
        return evaluate(match, variable, context);
    });

    return replaced;
}
