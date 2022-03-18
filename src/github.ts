import { Octokit } from 'octokit';

/**
 * Finds the pull request for a given commit.
 *
 * @param owner - Repo owner
 * @param repo - Repo name
 * @param commitSha - Commit SHA
 * @throws {Error} If there is no pull request associated with the commit.
 * @returns The pull request URL
 */
export async function getPullRequest(owner: string, repo: string, commitSha: string): Promise<string> {
    const octokit = new Octokit();
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
        owner: owner,
        repo: repo,
        commit_sha: commitSha,
    })

    const prs = response.data;

    if (prs.length === 0) {
        throw new Error('No pull requests associated with this commit');
    }

    return prs[0].html_url;
}
