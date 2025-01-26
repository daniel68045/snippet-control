const vscode = require('vscode');
const { generateSnippet } = require('./commands');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register the command
    let disposable = vscode.commands.registerCommand('snippet-gen.generateSnippet', generateSnippet);

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};

