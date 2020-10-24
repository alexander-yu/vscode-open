import * as vscode from 'vscode';

import * as config from './config';
import { Context } from './context';
import * as git from './git';
import * as range from './range';
import * as variables from './variables';

const EXTENSION = 'vscode-open';

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

	try {
		const uri = editor.document.uri;
		const mappings = config.getMappings<config.PRMappingType>('prMappings');
		const context = new Context(getSelectedLines(editor));

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

		throw new Error(`${uri.fsPath} did not match any PR mappings`);
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

function openLines() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	try {
		const uri = editor.document.uri;
		const mappings = config.getMappings<config.FileMappingType>('fileMappings');
		const context = new Context(getSelectedLines(editor));

		for (const mapping of mappings)  {
			if (mapping.lineSeparator) {
				context.lineSeparator = mapping.lineSeparator;
			}
			if (mapping.linePrefix) {
				context.linePrefix = mapping.linePrefix;
			}

			const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
			const match = pattern.exec(uri.fsPath);
			if (match) {
				context.match = match;
				const output = variables.resolve(mapping.output, context);
				vscode.env.openExternal(vscode.Uri.parse(output, true));
				return;
			}
		}

		throw new Error(`${uri.fsPath} did not match any file mappings`);
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

function open() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	try {
		const uri = editor.document.uri;
		const mappings = config.getMappings<config.FileMappingType>('fileMappings');
		const context = new Context();

		for (const mapping of mappings)  {
			if (mapping.lineSeparator) {
				context.lineSeparator = mapping.lineSeparator;
			}

			const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
			const match = pattern.exec(uri.fsPath);
			if (match) {
				context.match = match;
				const output = variables.resolve(mapping.output, context);
				vscode.env.openExternal(vscode.Uri.parse(output, true));
				return;
			}
		}

		throw new Error(`${uri.fsPath} did not match any file mappings`);
	} catch (error) {
		vscode.window.showErrorMessage(error.message);
	}
}

async function openURI() {
	try {
		const mappings = config.getMappings<config.URIMappingType>('uriMappings');
		const context = new Context();

		const uri = await vscode.window.showInputBox({
			placeHolder: 'https://host.example.com/repo/file#1-3',
			prompt: 'Enter URI to open file for',
		});

		if (uri) {
			for (const mapping of mappings)  {
				if (mapping.lineSeparator) {
					context.lineSeparator = mapping.lineSeparator;
				}

				const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
				const match = pattern.exec(uri);
				if (match) {
					context.match = match;
					const output = variables.resolve(mapping.output, context);
					const [fileName, lines] = range.extractRangeFromURI(context.lineSeparator, output);
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

			throw new Error(`${uri} did not match any URI mappings`);
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
