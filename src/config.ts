export interface FileMapping {
	pattern: string,
	output: string,
	lineSeparator?: string,
}

export interface URIMapping {
	pattern: string,
	output: string,
	lineSeparator?: string,
}

export interface PRMapping {
	pattern: string,
	provider: GitProvider,
}

export interface GitProvider {
    type: string,
    base: string,
}

// TODO (ayu): helpers for validating settings against interfaces
// TODO (ayu): helpers for validating that files/URIs are valid
