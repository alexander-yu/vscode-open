import * as vscode from 'vscode';

const REVISION_FIELD_REGEX = /^Differential Revision:\s*(?<revision>.+)$/im;
const REVISION_ID_REGEX = /^D[1-9]\d*$/im;

/**
 * Extracts the revision ID from a commit message.
 *
 * @param message - Raw commit message to parse
 * @throws {Error} If there is a revision field but the value is invalid
 * @returns The revision ID
 */
export function getRevisionID(message: string): string {
    const field = REVISION_FIELD_REGEX.exec(message);
    if (!field || !field.groups) {
        throw new Error('Commit message does not have a "Differential Revision" field.');
    }

    const revision = field.groups.revision.trim();

    // First check if the revision directly matches a revision ID
    if (REVISION_ID_REGEX.exec(revision)) {
        return revision;
    }

    // Otherwise, the revision should be a URI path containing the revision ID
    const uri = vscode.Uri.parse(revision, true);

    // Retrieve the last part of the revision URI; check that
    // this corresponds to a revision ID
    const part = uri.path.split('/').pop();
    if (part && REVISION_ID_REGEX.exec(part)) {
        return part;
    }

    throw new Error(
        'Invalid "Differential Revision" field in commit message. ' +
        'This field should have a revision ID like D123 or a URI like ' +
        `https://phabricator.example.com/D123 but instead has ${revision}.`
    );
}
