# vscode-open

> A VSCode extension for opening files

## Features

- Open files in your browser, using a file-to-URL mapping of your choice
- Open pull requests for files in your browser, using a Git provider of your choice

## Extension Settings

[comment]: # (TODO: More details about variables and setting formats)

- **open.fileMappings**
  - This configures a list of file mappings, where each mapping declares a filepath regex pattern and maps the matched filename to an output URL

- **open.prMappings**
  - This configures a list of file mappings for pull requests, where each mapping declares a filepath regex pattern and opens a pull request if the given file matches the pattern

Example:

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

## Release Notes

- TODO
