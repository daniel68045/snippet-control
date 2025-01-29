const vscode = require("vscode");
const { generateSnippet } = require("./commands");
const { importSnippet } = require("./commands");
const { deleteSnippet } = require("./commands");
const { exportSnippet } = require("./commands");

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

  const deleteSnippetCommand = vscode.commands.registerCommand(
    "snippet-gen.deleteSnippet",
    deleteSnippet
  );

  context.subscriptions.push(deleteSnippetCommand);

  context.subscriptions.push = vscode.commands.registerCommand(
    "snippet-gen.exportSnippet",
    exportSnippet
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
