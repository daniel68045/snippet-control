const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * Generate a snippet from selected text.
 * @returns {void}
 */
function generateSnippet() {
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

  // Create a snippet object
  const snippet = {
    prefix: "exampleSnippet", // User-defined prefix
    body: selectedText.split("\n"), // Convert to an array of lines
    description: "Generated snippet from selected text",
  };

  // Save the snippet to a JSON file
  saveSnippet(snippet);
  vscode.window.showInformationMessage("Snippet generated and saved!");
}

/**
 * Save the snippet to a JSON file in the snippets folder.
 * @param {Object} snippet The snippet object to save.
 */
function saveSnippet(snippet) {
  const snippetsDir = path.join(__dirname, "../snippets");
  const filePath = path.join(snippetsDir, "example.json");

  // Ensure the snippets directory exists
  if (!fs.existsSync(snippetsDir)) {
    fs.mkdirSync(snippetsDir);
  }

  let existingSnippets = {};

  // Read and parse existing snippets safely
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingSnippets = fileContent ? JSON.parse(fileContent) : {};
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to parse snippets file. Resetting to a new file."
      );
      existingSnippets = {};
    }
  }

  // Add the new snippet
  existingSnippets[snippet.prefix] = snippet;

  // Write updated snippets back to the file
  fs.writeFileSync(filePath, JSON.stringify(existingSnippets, null, 2), "utf8");
}

module.exports = {
  generateSnippet,
};
