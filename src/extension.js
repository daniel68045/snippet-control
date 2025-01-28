const vscode = require("vscode");
const { generateSnippet } = require("./commands");

function activate(context) {
  const generateSnippetCommand = vscode.commands.registerCommand(
    "snippet-gen.generateSnippet",
    generateSnippet
  );

  context.subscriptions.push(generateSnippetCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
