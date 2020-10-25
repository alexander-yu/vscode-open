import { isLeft } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as vscode from 'vscode';

const EXTENSION_CONFIG_NAMESPACE = 'open';

// Git provider
const GitProvider = t.type({
	type: t.string,
	base: t.string,
});

// File mapping
const RequiredFileMapping = t.type({
	pattern: t.string,
	output: t.string,
});
const OptionalFileMapping = t.partial({
	lineSeparator: t.string,
	linePrefix: t.string,
	provider: GitProvider,
});
const FileMapping = t.intersection([RequiredFileMapping, OptionalFileMapping]);

// URI mapping
const RequiredURIMapping = t.type({
	pattern: t.string,
	output: t.string,
});
const OptionalURIMapping = t.partial({
	lineSeparator: t.string,
	linePrefix: t.string,
	provider: GitProvider,
});
const URIMapping = t.intersection([RequiredURIMapping, OptionalURIMapping]);

// PR mapping
const PRMapping = t.type({
	pattern: t.string,
	provider: GitProvider,
});

const CONFIGS = new Map<string, t.Type<any, any, any>>([
	['fileMappings', FileMapping],
	['uriMappings', URIMapping],
	['prMappings', PRMapping],
]);

export function getMappings<T>(name: string): T[] {
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const codec = <t.Type<T, any, any>>CONFIGS.get(name);

	if (!codec) {
		throw new Error(`Internal error: ${name} is not a valid setting`);
	}

	return (
		config.get<object[]>(name) ?? []
	).map(
		mapping => codec.decode(mapping)
	).map(
		result => {
			if (isLeft(result)) {
				const firstError = result.left[0];
				const keys = firstError.context.map(({ key }) => key);
				throw new Error(
					`Open: invalid mapping: invalid value \"${firstError.value}\" supplied to \"${keys[keys.length - 1]}\"`
				);
			}
			return result.right;
		}
	);
}

export type FileMappingType = t.TypeOf<typeof FileMapping>;
export type URIMappingType = t.TypeOf<typeof URIMapping>;
export type GitProviderType = t.TypeOf<typeof GitProvider>;
export type PRMappingType = t.TypeOf<typeof PRMapping>;

// TODO (ayu): helpers for validating that files/URIs are valid
