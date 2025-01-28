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

function saveSnippet(snippet, languageId = null) {
  const editor = vscode.window.activeTextEditor;

  if (!languageId) {
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }
    languageId = editor.document.languageId;
  }

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

  saveSnippetToMarkdown(snippet, languageId);
}

function saveSnippetToMarkdown(snippet, languageId) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showWarningMessage(
      "No active workspace found. Snippet names cannot be saved to the project folder."
    );
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const markdownFilePath = path.join(workspacePath, "SavedSnippets.md");

  const snippetEntry = `### ${snippet.prefix}\n- **Description**: ${
    snippet.description || "No description"
  }\n- **Language**: ${languageId}\n\n`;

  fs.appendFileSync(markdownFilePath, snippetEntry);

  vscode.window.showInformationMessage(
    `Snippet "${snippet.prefix}" added to ${markdownFilePath}`
  );
}

function importSnippet() {
  vscode.window
    .showOpenDialog({
      canSelectMany: false,
      openLabel: "Select Snippet JSON File",
      filters: { JSON: ["json"] },
    })
    .then((fileUri) => {
      if (!fileUri || fileUri.length === 0) {
        vscode.window.showWarningMessage("No file selected.");
        return;
      }

      const filePath = fileUri[0].fsPath;

      let importedSnippets;
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        importedSnippets = JSON.parse(fileContent);
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to read or parse the snippet file."
        );
        return;
      }

      vscode.window
        .showInputBox({
          prompt:
            "Enter the language for these snippets (e.g., javascript, python)",
          placeHolder: "e.g., javascript",
          value: "javascript",
        })
        .then((languageId) => {
          if (!languageId) {
            vscode.window.showErrorMessage(
              "Language is required for importing snippets."
            );
            return;
          }

          const isSingleSnippet =
            importedSnippets.prefix &&
            importedSnippets.body &&
            importedSnippets.description;

          let snippetsToProcess = {};
          if (isSingleSnippet) {
            snippetsToProcess["importedSnippet"] = importedSnippets;
          } else {
            snippetsToProcess = importedSnippets;
          }

          for (const [name, snippet] of Object.entries(snippetsToProcess)) {
            saveSnippet(snippet, languageId);
          }

          vscode.window.showInformationMessage(
            `Imported ${
              Object.keys(snippetsToProcess).length
            } snippet(s) successfully for ${languageId}!`
          );
        });
    });
}

module.exports = {
  saveSnippet,
  generateSnippet,
  importSnippet,
};
