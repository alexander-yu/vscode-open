# vscode-open

[![VS Marketplace version](https://vsmarketplacebadges.dev/version-short/alexander-yu.vscode-open.svg)](https://marketplace.visualstudio.com/items?itemName=alexander-yu.vscode-open) ![Installs](https://vsmarketplacebadges.dev/installs-short/alexander-yu.vscode-open.svg) ![Downloads](https://vsmarketplacebadges.dev/downloads-short/alexander-yu.vscode-open.svg) [![GitHub license](https://img.shields.io/github/license/alexander-yu/vscode-open.svg)](https://github.com/alexander-yu/vscode-open/blob/master/LICENSE)

This is a [Visual Studio Code](https://code.visualstudio.com/) extension for opening files in your browser, or vice versa.

The main purpose of this extension is to be able to seamlessly move between your editor and the SCM/code review provider in your browser. You can open files or pull requests in your browser based off of selected lines in your editor, or conversely open a file in your editor from a given URI.

See the [release notes](https://github.com/alexander-yu/vscode-open/blob/master/CHANGELOG.md) for the list of recent changes.

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

### Mappings

Mappings are the main settings that determine how to generate file paths/URIs/PRs.

- **open.fileMappings**
  - Type: `object[]`
  - This configures a list of file mappings. Each mapping declares a file path pattern that maps files to URIs. Only the first mapping matching the file path will be applied.
  - File mappings have the following schema:
    |Property Name|Required|Description|
    |-------------|--------|-----------|
    |`pattern`|Yes|Pattern that matches file paths; paths matching this pattern will have the mapping in question applied.|
    |`output`|Yes|Pattern that generates URIs; will be applied to the path captured by `pattern`.|
    |`lineSeparator`|No|Optional parameter for configuring the text used to denote the line numbers in the URI, e.g. the `#` in `#123-124`. Defaults to `#`.|
    |`linePrefix`|No|Optional parameter for configuring the prefix used for rendering line numbers in the URI, e.g. setting this to `L` will render the line numbers as `L123-L124`. Defaults to nothing.|
    |`lineRangeSeparator`|No|Optional parameter for configuring the text used to denote the line number range in the URI, e.g. the `-` in `#123-124`. Defaults to `-`.|

- **open.prMappings**
  - Type: `object[]`
  - This configures a list of file mappings for pull requests. Each mapping declares a file path pattern and opens pull requests for matched files.
  - PR mappings have the following schema:
    |Property Name|Required|Description|
    |-------------|--------|-----------|
    |`pattern`|Yes|Pattern that matches file paths; paths matching this pattern will have the mapping in question applied.|
    |`provider`|Yes|Configuration for code review provider.|
  - The `provider` setting has the following schema:
    |Property Name|Required|Description|
    |-------------|--------|-----------|
    |`type`|Yes|Provider type; supported values are: `phabricator`, `github` (**Note**: only public GitHub repos are currently supported).|
    |`base`|Yes|Base URL for provider.|

- **open.uriMappings**
  - Type: `object[]`
  - This configures a list of URI mappings. Each mapping declares a URI pattern that maps URIs to files.
  - URI mappings have the following schema:
    |Property Name|Required|Description|
    |-------------|--------|-----------|
    |`pattern`|Yes|Pattern that matches URIs; URIs matching this pattern will have the mapping in question applied.|
    |`output`|Yes|Pattern that generates file paths; will be applied to the URI captured by `pattern`.|
    |`lineSeparator`|No|Optional parameter for configuring the text used to denote the line numbers in the URI, e.g. the `#` in `#123-124`. Defaults to `#`.|
    |`linePrefix`|No|Optional parameter for configuring the prefix used for rendering line numbers in the URI, e.g. setting this to `L` will recognize line numbers such as `L123-L124`. Default support is for no line prefix or a line prefix of `L`.|
    |`lineRangeSeparator`|No|Optional parameter for configuring the text used to denote the line number range in the URI, e.g. the `-` in `#123-124`. Defaults to `-`.|

### Variables

There are a number of special variables that are supported by this extension, which make it possible/easier to generate mappings. Variables can be used in the patterns that are required for various mappings, using the format `${category:value}`. Some variables may take additional values, which are further separated by additional colons, e.g. `${category:value_1:value_2}`.

#### `env`

This category surfaces environment variables, specifically the environment variables available to the Node process running the extension.

**Example:**

```ini
${env:HOME}/myrepo/file.py
# Output: /Users/me/myrepo/file.py
```

#### `editor`

This category surfaces information about the current editor context. Many of these overlap with the standard [VSCode variables](https://code.visualstudio.com/docs/editor/variables-reference) that are available as part of VSCode's own configuration files.

|Variable|Description|
|--------|-----------|
|`${editor:workspaceFolder}`|The path of the folder opened in VS Code. Folder name must be specified as an additional argument if there are multiple open workspace folders, e.g. `${editor:workspaceFolder:folder_name}`.|
|`${editor:workspaceFolderBasename}`|The name of the folder opened in VS Code without any slashes (/). Folder name must be specified as an additional argument if there are multiple open workspace folders.|
|`${editor:relativeFile}`|The current opened file relative to `workspaceFolder`. Folder name must be specified as an additional argument if there are multiple open workspace folders.|
|`${editor:relativeFileDirname}`|The current opened file's dirname relative to `workspaceFolder`. Folder name must be specified as an additional argument if there are multiple open workspace folders.|
|`${editor:file}`|The current opened file.|
|`${editor:fileBasename}`|The current opened file's basename.|
|`${editor:fileBasenameNoExtension}`|The current opened file's basename with no file extension.|
|`${editor:fileDirname}`|The current opened file's dirname.|
|`${editor:fileExtname}`|The current opened file's extension.|
|`${editor:lines}`|The selected lines of the current opened file. The exact output is configurable via settings like `lineSeparator` and `linePrefix`.|
|`${editor:currentCommit}`|The current commit hash of the opened file.|

**Examples:**

```ini
# Assume multiple opened workspace folders, current file is /myrepo/dir/file.py

${editor:workspaceFolder:myrepo}
# Output: /myrepo

${editor:workspaceFolderBasename:myrepo}
# Output: myrepo

${editor:relativeFile:myrepo}
# Output: /dir/file.py

${editor:relativeFileDirname:myrepo}
# Output: /dir

# Assume single opened workspace folder, current file is /myrepo/dir/file.py

${editor:workspaceFolder}
# Output: /myrepo

${editor:workspaceFolderBasename}
# Output: myrepo

${editor:relativeFile}
# Output: /dir/file.py

${editor:relativeFileDirname}
# Output: /dir

${editor:file}
# Output: /myrepo/dir/file.py

${editor:fileBasename}
# Output: file.py

${editor:fileBasenameNoExtension}
# Output: file

${editor:fileDirname}
# Output: /myrepo/dir

${editor:fileExtname}
# Output: .py

${editor:lines}
# Output: e.g. #12 or #12-14 (the default format)

${editor:currentCommit}
# Output: e.g. 6081948371a180586a806a214202e44c2f922a42
```

#### `match`

This category allows you to extract any regex capture groups from the input patterns of mappings. The value of the variable must be the name of a valid capture group in the input pattern.

**Example:**

```ini
${match:group_1}/${match:group_2}
# Input pattern: (?<group_1>[A-Za-z]+)_(?<group_2>[0-9]+).txt
# Input text: hello_123.txt
# Output: hello/123
```

#### `regex`

This category provides some standard regex templates to use. This will be subsituted by the appropriate regex template, with a capture group whose name is equal to the template name (i.e. you can use this in conjunction with `match` variables).

|Variable|Description|
|--------|-----------|
|`file`|Regex for capturing file names. For simplicity, this is currently just `.+`.|
|`lines`|Regex for capturing line numbers. The end result regex is configurable via settings like `lineSeparator` and `linePrefix`.|

### Example Configuration

```json
{
    "open.fileMappings": [
        {

            "pattern": "src/static/(?<mdFileWithoutExt>.+)\\.md$",
            "output": "https://host.example.com/docs/${match:mdFileWithoutExt}"
        },
        {
            "pattern": "${editor:file}",
            "output": "https://host.example.com/repo/blob/${editor.currentCommit}/${editor:relativeFile}${editor:lines}",
            "lineSeparator": "#",
            "linePrefix": "L"
        }
    ],
    "open.prMappings": [
        {
            "pattern": "${editor:file}",
            "provider": {
                "type": "phabricator",
                "base": "https://phabricator.example.com"
            }
        }
    ],
    "open.uriMappings": [
        {
            "pattern": "https://host.example.com/repo/${regex:file}${regex:lines}",
            "output": "${editor:workspaceFolder}/${match:file}${match:lines}",
            "lineSeparator": "#"
        }
    ]
}
```
