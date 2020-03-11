const VARIABLE_REGEX = /\$\{(.*?)\}/g;

export interface Context {
    env: NodeJS.ProcessEnv,
    file: string,
    lines: [number, number] | null,
    match: RegExpExecArray | null,
}

function evaluate(value: string, variable: string, context: Context): string {
    let argument: string | undefined;
    const parts = variable.split(':');

    if (parts.length > 1) {
        variable = parts[0];
        argument = parts[1];
    }

    switch (variable) {
        case 'env':
            if (!argument) {
                throw new Error(`${value} cannot be resolved because no environment variable name is given.`);
            }
            const env = context.env[argument];
            return (typeof env === 'string') ? env : '';
        case 'match':
            // TODO (ayu): validation against the argument; is the argument validly formed?
            // Does the argument exist in the match?
            // Handle group numbers too
            if (!context.match) {
                throw new Error(`${value} cannot be resolved because there is no regex match`);
            } else if (!context.match.groups) {
                throw new Error(`${value} cannot be resolved because there are no regex capture groups to match`);
            } else if (!argument) {
                throw new Error(`${value} cannot be resolved because no regex capture group is given`);
            }
            return context.match.groups[argument];
        case 'lines':
            if (!context.lines) {
                return '';
            } else if (context.lines[0] === context.lines[1]) {
                return context.lines[0].toString();
            }
            return `${context.lines[0].toString()}-${context.lines[1].toString()}`;
        default:
            return value;
    }
}

export function resolve(value: string, context: Context): string {
    const replaced = value.replace(VARIABLE_REGEX, (match: string, variable: string): string => {
        return evaluate(match, variable, context);
    });

    return replaced;
}
