# Change Log

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
