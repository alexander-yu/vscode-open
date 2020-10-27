import * as path from 'path';
import * as url from 'url';

import * as simplegit from 'simple-git/promise';
import { DefaultLogFields, ListLogLine } from 'simple-git/typings/response';
import * as vscode from 'vscode';

import * as config from './config';
import * as ph from './phabricator';


enum ProviderType {
    PHABRRICATOR = 'phabricator',
}

// TODO (ayu): docstrings
async function getBlameCommit(file: string, line: number): Promise<DefaultLogFields & ListLogLine> {
    // TODO (ayu): catch errors
    const log = await simplegit(path.dirname(file)).log([
        '-L',
        `${line + 1},${line + 1}:${file}`,  // Git blame line numbers start from 1
        '-n',
        '1',
        '--first-parent',
        '-s',
    ]);
    return log.latest;
}

export async function getPullRequestURI(file: string, line: number, provider: config.GitProviderType): Promise<vscode.Uri> {
    const commit = await getBlameCommit(file, line);

    switch (provider.type) {
        case ProviderType.PHABRRICATOR:
            const revision = ph.getRevisionID(commit.body);
            const uri = new url.URL(revision, provider.base).toString();
            return vscode.Uri.parse(uri, true);
        default:
            throw new Error(
                `A valid version control provider is required for generating PR URIs, but got ${provider.type}. ` +
                `Valid values: [${ProviderType.PHABRRICATOR}]`
            );
    }
}
