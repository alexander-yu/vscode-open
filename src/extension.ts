import * as vscode from 'vscode';
import * as config from './config';
import * as git from './git';
import * as variables from './variables';

const EXTENSION = 'vscode-open';
const EXTENSION_CONFIG_NAMESPACE = 'open';

// TODO (ayu): docstrings

function getSelectedLines(editor: vscode.TextEditor): [number, number] {
	const anchor = editor.selection.anchor.line + 1;
	const active = editor.selection.active.line + 1;
	const start = Math.min(anchor, active);
	const end = Math.max(anchor, active);
	return [start, end];
}

async function openPR() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<config.PRMapping>>('prMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		file: uri.fsPath,
		lines: getSelectedLines(editor),
		match: null,
	};

	for (const mapping of mappings)  {
		const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
		const match = pattern.exec(uri.fsPath);
		if (match) {
			context.match = match;
			const line = editor.selection.active.line;
			const pr = await git.getPullRequestURI(uri.fsPath, line, mapping.provider);
			vscode.env.openExternal(pr);
			return;
		}
	}

	// TODO (ayu): handle no match
}

function open() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<config.URIMapping>>('uriMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		file: uri.fsPath,
		lines: getSelectedLines(editor),
		match: null,
	};

	for (const mapping of mappings)  {
		const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
		const match = pattern.exec(uri.fsPath);
		if (match) {
			context.match = match;
			const output = variables.resolve(mapping.output, context);
			vscode.env.openExternal(vscode.Uri.parse(output, true));
			return;
		}
	}

	// TODO (ayu): handle no match
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.open`, open));
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.openPR`, openPR));
}

export function deactivate() {}
