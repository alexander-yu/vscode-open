# Change Log

## 0.1.10 - 2020-09-16

### Added

- Added a set of new editor variables, in order to increase parity with the [VSCode variables](https://code.visualstudio.com/docs/editor/variables-reference) that are available in VSCode's own configuration files; in particular, added the following:

  |Variable|Description|
  |--------|-----------|
  |`${editor:workspaceFolder}`|The path of the folder opened in VS Code|
  |`${editor:workspaceFolderBasename}`|The name of the folder opened in VS Code without any slashes (/)|
  |`${editor:file}`|The current opened file|
  |`${editor:relativeFile}`|The current opened file relative to workspaceFolder|
  |`${editor:relativeFileDirname}`|The current opened file's dirname relative to workspaceFolder|
  |`${editor:fileBasename}`|The current opened file's basename|
  |`${editor:fileBasenameNoExtension}`|The current opened file's basename with no file extension|
  |`${editor:fileDirname}`|The current opened file's dirname|
  |`${editor:fileExtname}`|The current opened file's extension|

## 0.1.9 - 2020-09-14

### Added

- Added support for parsing GitHub line numbers (e.g. `L123-L124`) as part of the `${regex:lines}` variable; when opening files from a URI, the extension will similarly be able to respect GitHub line numbers

## 0.1.8 - 2020-09-14

### Fixed

- Improved error messaging for invalid environment variables and when file paths/URIs fail to match any known mappings

## 0.1.7 - 2020-09-14

### Fixed

- Fixed issue where `openURI` fails to execute when there is no active editor

## 0.1.5 - 2020-09-11

### Fixed

- `lineSeparator` is escaped properly when used as part of `${regex:lines}`

## 0.1.4 - 2020-09-11

### Added

- Added a setting to file and URI mappings to configure the line separator used for generating `${editor:lines}` and `${regex:lines}`; when opening files from a URI, the extension will respect the configured line separator when extracting line numbers
- Error messages are now surfaced for invalid settings

## 0.1.0 - 2020-09-10

### Added

- Added command to just open the file in browser without any line selection
- Added command to open file in editor from a given URI, with support for line numbers in the URI; if line numbers are present, corresponding lines will be selected, and the editor will scroll to selection
- Added new variable, `regex`, which provides a set of reasonable default regex templates; have only added `${regex:file}` and `${regex:lines}` so far

### Changed

- (BREAKING) Changed default keybindings for commands; commands are now chorded, with the initial sequence being <kbd>Ctrl Alt O</kbd> for Windows/Unix and <kbd>⌘⌥O</kbd> for Mac
- (BREAKING) The `${lines}` variable has now been changed to `${editor:lines}`, and will also generate the line fragment character (i.e. `#`), meaning any previous configs with that character manually specified before `${lines}` should remove it

### Fixed

- Fixed issue with line numbers being off by 1 when opening files in browser with line selection
- Improved some error handling; validation errors are now shown as error messages in the editor

## 0.0.1

### Added

- Initial release, with commands to open files in browser and open PRs
