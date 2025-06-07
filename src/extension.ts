import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('open-file-from-url.open-file-from-url', () => {
		vscode.window.showInputBox({
			prompt: 'Enter the URL of the file to open',
			placeHolder: 'https://example.com/path/to/file.txt'
		}).then(url => {
			if(!url) {
				vscode.window.showErrorMessage('No URL provided');
				return;
			}

			let urlObject: URL;
			try {
				urlObject = new URL(url);
			} catch (error) {
				vscode.window.showErrorMessage('Invalid URL provided');
				return;
			}

			fetch(urlObject.toString()).then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				response.text().then(text => {
					vscode.workspace.openTextDocument({ language:"auto", content: text }).then(document => {
						vscode.window.showTextDocument(document);
					});
				});
			}).catch(error => {
				vscode.window.showErrorMessage(`Failed to fetch file: ${error.message}`);
			});
		});
	});

	context.subscriptions.push(disposable);
}