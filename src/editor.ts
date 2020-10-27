import * as path from 'path';
import * as vscode from 'vscode';

import { Context } from './context';
import * as range from './range';

function getWorkspaceFolder(variable: string, folderName?: string): vscode.Uri {
    const folders = vscode.workspace.workspaceFolders;

    if (!folders || folders.length === 0) {
        throw new Error(`${variable} cannot be resolved because there are no workspace folders currently active`);
    }

    if (!folderName) {
        if (folders.length === 1) {
            return folders[0].uri;
        }
        throw new Error(
            `${variable} cannot be resolved because no folder name was specified ` +
            'for a multi-folder workspace; specify a folder using \':\' and a workspace folder name'
        );
    }

    const uri = folders.find(folder => folder.name === folderName)?.uri;
    if (!uri) {
        throw new Error(`${variable} cannot be resolved because no folder with name ${folderName} was found`);
    }

    return uri;
}

function getOpenFile(variable: string): vscode.Uri {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error(`${variable} cannot be resolved because there is currently no open file`);
    }

    return editor.document.uri;
}

export function evaluateEditor(context: Context, value: string, variable: string | undefined): string {
    if (!variable) {
        throw new Error(`${value} cannot be resolved because no editor variable name is given`);
    }

    let argument: string | undefined;
    const parts = variable.split(':');

    if (parts.length > 1) {
        variable = parts[0];
        argument = parts[1];
    }

    switch (variable) {
        case 'lines':
            if (!context.lines) {
                return '';
            }
            return range.toFragment(context.rangeConfig, context.lines);
        case 'workspaceFolder':
            return getWorkspaceFolder(variable, argument).fsPath;
        case 'workspaceFolderBasename':
            return path.basename(getWorkspaceFolder(variable, argument).fsPath);
        case 'file':
            return getOpenFile(variable).fsPath;
        case 'relativeFile':
            return path.normalize(path.relative(
                getWorkspaceFolder(variable, argument).fsPath,
                getOpenFile(variable).fsPath,
            ));
        case 'relativeFileDirname':
            return path.normalize(path.relative(
                getWorkspaceFolder(variable, argument).fsPath,
                path.dirname(getOpenFile(variable).fsPath),
            ));
        case 'fileBasename':
            return path.basename(getOpenFile(variable).fsPath);
        case 'fileBasenameNoExtension':
            const basename = path.basename(getOpenFile(variable).fsPath);
            const extension = path.extname(basename);
            return basename.slice(0, -extension.length);
        case 'fileDirname':
            return path.dirname(getOpenFile(variable).fsPath);
        case 'fileExtname':
            return path.extname(getOpenFile(variable).fsPath);
        default:
            throw new Error(`${variable} is not a valid editor variable.`);
    }
}
