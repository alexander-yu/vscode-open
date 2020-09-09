# vscode-open

> A VSCode extension for opening files

## Features

- Open files in your browser, using a file-to-URL mapping of your choice
  - Available in editor/explorer context menus
  - Default bindings:
    - Windows/Unix: <kbd>Alt</kbd> + <kbd>Ctrl</kbd> + <kbd>O</kdb>
    - Mac: <kbd>⌥</kbd> + <kbd>⌘</kbd> + <kbd>O</kdb>

- Open files with selected lines in your browser, using a file-to-URL mapping of your choice
  - Available in editor/explorer context menus
  - Default bindings:
    - Windows/Unix: <kbd>Alt</kbd> + <kbd>Ctrl</kbd> + <kbd>L</kdb>
    - Mac: <kbd>⌥</kbd> + <kbd>⌘</kbd> + <kbd>L</kdb>

- Open pull requests for selected lines in your browser, using a Git provider of your choice
  - Specifically, this opens the pull request that was merged for the currently selected line (i.e. what would appear in `git blame`)
  - Available in editor context menus
  - Default bindings:
    - Windows/Unix: <kbd>Alt</kbd> + <kbd>Ctrl</kbd> + <kbd>P</kdb>
    - Mac: <kbd>⌥</kbd> + <kbd>⌘</kbd> + <kbd>P</kdb>

## Configuration

[comment]: # (TODO: More details about variables and setting formats)

- **open.fileMappings**
  - Type: `object[]`
  - This configures a list of file mappings. Each mapping declares a filepath regex pattern that maps files to URLs.

- **open.prMappings**
  - Type: `object[]`
  - This configures a list of file mappings for pull requests. Each mapping declares a filepath regex pattern and opens pull requests for matched files.

**Example:**

```json
{
    "open.fileMappings": [
        {
            "pattern": "${env:REPO_PATH}/(?<file>.*)",
            "output": "https://host.example.com/repo/${match:file}#${lines}"
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
    ]
}
```
