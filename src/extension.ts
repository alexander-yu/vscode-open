import * as vscode from 'vscode';
import * as config from './config';
import * as git from './git';
import * as range from './range';
import * as variables from './variables';

const EXTENSION = 'vscode-open';
const EXTENSION_CONFIG_NAMESPACE = 'open';

// TODO (ayu): docstrings

function getSelectedLines(editor: vscode.TextEditor): range.Range {
	const anchor = editor.selection.anchor.line + 1;
	const active = editor.selection.active.line + 1;
	const start = Math.min(anchor, active);
	const end = Math.max(anchor, active);
	return new range.Range(start, end);
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
		lines: getSelectedLines(editor),
		match: null,
	};

	try {
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
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

function openLines() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<config.FileMapping>>('fileMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		lines: getSelectedLines(editor),
		match: null,
	};

	try {
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
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

function open() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const uri = editor.document.uri;
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<config.FileMapping>>('fileMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		lines: null,
		match: null,
	};

	try {
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
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

async function openURI() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<config.URIMapping>>('uriMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		lines: null,
		match: null,
	};

	try {
		const uri = await vscode.window.showInputBox({
			placeHolder: 'https://host.example.com/repo/file#1-3',
			prompt: 'Enter URI to open file for',
		});

		if (uri) {
			for (const mapping of mappings)  {
				const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
				const match = pattern.exec(uri);
				if (match) {
					context.match = match;
					const output = variables.resolve(mapping.output, context);
					const [fileName, lines] = range.extractRangeFromURI(output);
					const editor = await vscode.window.showTextDocument(vscode.Uri.file(fileName));

					if (lines) {
						// Subtract 1 from line numbers, since these are zero-indexed
						const anchor = new vscode.Position(lines.start - 1, 0);
						const endLine = editor.document.lineAt(lines.end - 1);
						const active = new vscode.Position(lines.end - 1, endLine.range.end.character);

						// Select line numbers and scroll to selection
						editor.selection = new vscode.Selection(anchor, active);
						editor.revealRange(new vscode.Range(anchor, active));
					}
					return;
				}
			}

			// TODO (ayu): handle no match
		}
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.open`, open));
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.openPR`, openPR));
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.openLines`, openLines));
	context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION}.openURI`, openURI));
}

export function deactivate() {}
