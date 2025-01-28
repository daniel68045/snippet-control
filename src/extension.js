const vscode = require("vscode");
const { generateSnippet } = require("./commands");
const { importSnippet } = require("./commands");

function activate(context) {
  const generateSnippetCommand = vscode.commands.registerCommand(
    "snippet-gen.generateSnippet",
    generateSnippet
  );

  context.subscriptions.push(generateSnippetCommand);

  const importSnippetCommand = vscode.commands.registerCommand(
    "snippet-gen.importSnippet",
    importSnippet
  );

  context.subscriptions.push(importSnippetCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
