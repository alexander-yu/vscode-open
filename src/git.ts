import * as path from 'path';
import * as url from 'url';

import simpleGit, { DefaultLogFields, ListLogLine } from 'simple-git';
import * as vscode from 'vscode';

import * as config from './config';
import * as gh from './github';
import * as ph from './phabricator';


enum ProviderType {
    PHABRRICATOR = 'phabricator',
    GITHUB = 'github',
}

export type GitContext = {
    currentFileCommit: string,
};

export async function getGitContext(file: string): Promise<GitContext | null> {
    const git = simpleGit(path.dirname(file));
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
        return null;
    }

    return {
        currentFileCommit: await git.revparse(['HEAD']),
    };
}

// TODO (ayu): docstrings
async function getBlameCommit(file: string, line: number): Promise<DefaultLogFields & ListLogLine | null> {
    // TODO (ayu): catch errors
    const log = await simpleGit(path.dirname(file)).log([
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

    if (commit === null) {
        throw new Error(`No commit available at ${file}:${line}`);
    }

    switch (provider.type) {
        case ProviderType.PHABRRICATOR:
            const revision = ph.getRevisionID(commit.body);
            const uri = new url.URL(revision, provider.base).toString();
            return vscode.Uri.parse(uri, true);
        case ProviderType.GITHUB:
            // TODO (ayu): support enterprise GitHub
            if (provider.base !== 'https://github.com') {
                throw new Error(
                    'Only public GitHub repos are currently supported. Must set GitHub base to https://github.com.'
                );
            }
            let remote = await simpleGit(path.dirname(file)).remote(['get-url', 'origin']);

            if (!remote) {
                throw new Error('No remote origin exists.');
            } else if (!remote.startsWith(provider.base)) {
                throw new Error(`Base URL is ${provider.base} but remote origin is ${remote}.`);
            }

            // Strip base URL and .git suffix so that we're left with /owner/repo
            remote = remote.slice(provider.base.length).trim();

            if (remote.endsWith('.git')) {
                remote = remote.slice(0, -4);
            }

            const parts = remote.split('/').slice(-2);
            const prUrl = await gh.getPullRequest(parts[0], parts[1], commit.hash);
            return vscode.Uri.parse(prUrl, true);
        default:
            throw new Error(
                `A valid version control provider is required for generating PR URIs, but got ${provider.type}. ` +
                `Valid values: [${ProviderType.PHABRRICATOR}]`
            );
    }
}
