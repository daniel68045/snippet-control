const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function generateSnippet() {
  console.log("generateSnippet command called");

  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor found!");
    return;
  }

  const document = editor.document;
  const selection = editor.selection;
  const selectedText = document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage("No text selected to generate a snippet.");
    return;
  }

  vscode.window
    .showInputBox({
      prompt: "Enter a name for your snippet (prefix)",
      placeHolder: "e.g., mySnippetName",
      value: "exampleSnippet",
    })
    .then((snippetName) => {
      if (!snippetName) {
        vscode.window.showErrorMessage("Snippet name is required!");
        return;
      }

      vscode.window
        .showInputBox({
          prompt: "Enter a description for your snippet",
          placeHolder: "e.g., A reusable fetch function snippet",
          value: "Generated snippet from selected text",
        })
        .then((snippetDescription) => {
          if (!snippetDescription) {
            vscode.window.showErrorMessage("Snippet description is required!");
            return;
          }

          const snippet = {
            prefix: snippetName,
            body: selectedText.split("\n"),
            description: snippetDescription,
          };

          console.log("Snippet to save:", JSON.stringify(snippet, null, 2));

          saveSnippet(snippet);
        });
    });
}

function saveSnippet(snippet) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const languageId = editor.document.languageId;

  // Global snippet file location
  const globalSnippetsDir = path.join(
    process.env.HOME || process.env.USERPROFILE,
    "Library/Application Support/Code/User/snippets"
  );
  const snippetFile = path.join(globalSnippetsDir, `${languageId}.json`);

  if (!fs.existsSync(globalSnippetsDir)) {
    fs.mkdirSync(globalSnippetsDir, { recursive: true });
  }

  const existingSnippets = fs.existsSync(snippetFile)
    ? JSON.parse(fs.readFileSync(snippetFile, "utf8"))
    : {};

  existingSnippets[snippet.prefix] = snippet;

  fs.writeFileSync(
    snippetFile,
    JSON.stringify(existingSnippets, null, 2),
    "utf8"
  );

  vscode.window.showInformationMessage(
    `Snippet saved globally to ${snippetFile}`
  );

  saveSnippetToMarkdown(snippet, editor);
}

function saveSnippetToMarkdown(snippet, editor) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showWarningMessage(
      "No active workspace found. Snippet names cannot be saved to the project folder."
    );
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const markdownFilePath = path.join(workspacePath, "SavedSnippets.md");

  const snippetEntry = `### ${snippet.prefix}\n- **Description**: ${snippet.description}\n- **Language**: ${editor.document.languageId}\n\n`;

  fs.appendFileSync(markdownFilePath, snippetEntry);

  vscode.window.showInformationMessage(
    `Snippet "${snippet.prefix}" added to ${markdownFilePath}`
  );
}

module.exports = {
  saveSnippet,
  generateSnippet,
};
