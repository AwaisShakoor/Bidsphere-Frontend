/**
 * ESLint formatter that emits GitHub Actions annotations.
 * Errors show as red, warnings as orange in the Actions UI / PR Checks.
 */
module.exports = function eslintGithubFormatter(results) {
  const lines = [];

  for (const result of results) {
    for (const message of result.messages) {
      const severity = message.severity === 2 ? "error" : "warning";
      const file = result.filePath;
      const line = message.line ?? 1;
      const col = message.column ?? 1;
      const rule = message.ruleId ? ` (${message.ruleId})` : "";
      const text = `${message.message}${rule}`.replace(/\r?\n/g, " ");

      lines.push(`::${severity} file=${file},line=${line},col=${col}::${text}`);
    }
  }

  return `${lines.join("\n")}${lines.length ? "\n" : ""}`;
};
