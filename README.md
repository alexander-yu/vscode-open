# vscode-open

> A VSCode extension for opening files

## Features

- Open files in your browser, using a file-to-URI mapping of your choice
  - Available in editor/explorer context menus
  - Default bindings:
    - Windows/Unix: <kbd>Ctrl Alt O</kbd> + <kbd>O</kbd>
    - Mac: <kbd>⌘⌥O</kbd> + <kbd>O</kbd>

- Open files with selected lines in your browser, using a file-to-URI mapping of your choice
  - Available in editor/explorer context menus
  - Default bindings:
    - Windows/Unix: <kbd>Ctrl Alt O</kbd> + <kbd>L</kbd>
    - Mac: <kbd>⌘⌥O</kbd> + <kbd>L</kbd>

- Open pull requests for selected lines in your browser, using a Git provider of your choice
  - Specifically, this opens the pull request that was merged for the currently selected line (i.e. what would appear in `git blame`)
  - Available in editor context menus
  - Default bindings:
    - Windows/Unix: <kbd>Ctrl Alt O</kbd> + <kbd>P</kbd>
    - Mac: <kbd>⌘⌥O</kbd> + <kbd>P</kbd>

- Open files in VSCode from URIs, using a URI-to-file mapping of your choice
  - Supports line numbers in the URIs — if present, will select the given lines and scroll to the selection
  - Default bindings:
    - Windows/Unix: <kbd>Ctrl Alt O</kbd> + <kbd>U</kbd>
    - Mac: <kbd>⌘⌥O</kbd> + <kbd>U</kbd>

## Configuration

[comment]: # (TODO: More details about variables and setting formats)

- **open.fileMappings**
  - Type: `object[]`
  - This configures a list of file mappings. Each mapping declares a filepath regex pattern that maps files to URIs.

- **open.prMappings**
  - Type: `object[]`
  - This configures a list of file mappings for pull requests. Each mapping declares a filepath regex pattern and opens pull requests for matched files.

- **open.uriMappings**
  - Type: `object[]`
  - This configures a list of URI mappings. Each mapping declares a URI regex pattern that maps URIs to files.

**Example:**

```json
{
    "open.fileMappings": [
        {
            "pattern": "${env:REPO_PATH}/${regex:file}",
            "output": "https://host.example.com/repo/${match:file}${editor:lines}"
        }
    ],
    "open.prMappings": [
        {
            "pattern": "${env:REPO_PATH}/.*",
            "provider": {
                "type": "phabricator",
                "base": "https://phabricator.example.com"
            }
        }
    ],
    "open.uriMappings": [
        {
            "pattern": "https://host.example.com/repo/${regex:file}${regex:lines}",
            "output": "${env:REPO_PATH}/${match:file}${match:lines}"
        }
    ]
}
```
