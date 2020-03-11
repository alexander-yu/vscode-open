import * as vscode from 'vscode';
import * as variables from './variables';

const EXTENSION = 'vscode-open';
const EXTENSION_CONFIG_NAMESPACE = 'open';

interface Mapping {
	pattern: string,
	output: string,
}

function getSelectedLines(): [number, number] | null {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const anchor = editor.selection.anchor.line + 1;
		const active = editor.selection.active.line + 1;
		const start = Math.min(anchor, active);
		const end = Math.max(anchor, active);
		return [start, end];
	}
	return null;
}

function open(uri: vscode.Uri) {
	const config = vscode.workspace.getConfiguration(`${EXTENSION_CONFIG_NAMESPACE}`);
	const mappings = config.get<Array<Mapping>>('uriMappings') ?? [];

	const context: variables.Context = {
		env: process.env,
		file: uri.fsPath,
		lines: getSelectedLines(),
		match: null,
	};

	for (const mapping of mappings)  {
		const pattern = RegExp(variables.resolve(mapping.pattern, context), 'g');
		const match = pattern.exec(uri.fsPath);
		if (match) {
			context.match = match;
			const output = variables.resolve(mapping.output, context);
			vscode.env.openExternal(vscode.Uri.parse(output));
		}
	}

	// TODO (ayu): handle no match
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(`${EXTENSION}.open`, () => {
		let uri = vscode.window.activeTextEditor?.document.uri;

		if (uri) {
			open(uri);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
