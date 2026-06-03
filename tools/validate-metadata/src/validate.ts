import { ALLOWED_PLATFORMS, REQUIRED_HEADINGS } from "./platforms.js";
import {
  extractHeadings,
  extractTablesInSection,
  findTableRow,
  getColumnIndex,
  isSeparatorRow,
  parseTableCells,
  stripBackticks,
  type MarkdownTable,
} from "./parse.js";

export type ValidationMessage = {
  level: "error" | "warning";
  message: string;
};

export type ValidateOptions = {
  /** METADATA_TEMPLATE.md: headings only, no device-specific warnings */
  templateMode?: boolean;
};

function isPlaceholder(value: string): boolean {
  const v = stripBackticks(value);
  if (!v) return true;
  if (/^<.*>$/.test(v)) return true;
  if (v.includes("<例:") || v.includes("<...>")) return true;
  return false;
}

function validateRequiredHeadings(
  headings: Set<string>,
  fileLabel: string,
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  for (const heading of REQUIRED_HEADINGS) {
    if (!headings.has(heading)) {
      messages.push({
        level: "error",
        message: `${fileLabel}: missing required heading: ${heading}`,
      });
    }
  }
  return messages;
}

function validateTableStructure(
  table: MarkdownTable,
  fileLabel: string,
  tableLabel: string,
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const colCount = table.header.length;

  if (colCount < 2) {
    messages.push({
      level: "error",
      message: `${fileLabel}: ${tableLabel} table at line ${table.startLine} has too few columns`,
    });
    return messages;
  }

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    if (row.length !== colCount) {
      messages.push({
        level: "error",
        message: `${fileLabel}: ${tableLabel} table row ${table.startLine + 2 + i} has ${row.length} columns, expected ${colCount}`,
      });
    }
  }

  return messages;
}

function validatePlatformTable(
  table: MarkdownTable,
  fileLabel: string,
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  messages.push(
    ...validateTableStructure(table, fileLabel, "Platform 別 Example"),
  );

  const platformCol = getColumnIndex(table, "Platform");
  if (platformCol < 0) {
    messages.push({
      level: "error",
      message: `${fileLabel}: Platform 別 Example table missing Platform column`,
    });
    return messages;
  }

  for (let i = 0; i < table.rows.length; i++) {
    const platform = stripBackticks(table.rows[i][platformCol] ?? "");
    if (!platform) continue;
    if (!ALLOWED_PLATFORMS.has(platform)) {
      messages.push({
        level: "error",
        message: `${fileLabel}: unknown platform "${platform}" at row ${table.startLine + 2 + i}`,
      });
    }
  }

  return messages;
}

function validateBasicInfoWarnings(
  tables: MarkdownTable[],
  fileLabel: string,
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  for (const table of tables) {
    const row = findTableRow(table, "Device Dashboard");
    if (!row) continue;
    const value = row[1] ?? "";
    if (isPlaceholder(value)) {
      messages.push({
        level: "warning",
        message: `${fileLabel}: Device Dashboard link is empty or placeholder`,
      });
    }
  }
  return messages;
}

function validateRecommendedWarnings(
  tables: MarkdownTable[],
  fileLabel: string,
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  for (const table of tables) {
    const row = findTableRow(table, "実機確認");
    if (!row) continue;
    const value = stripBackticks(row[1] ?? "");
    if (value === "未確認") {
      messages.push({
        level: "warning",
        message: `${fileLabel}: 実機確認 is 未確認`,
      });
    }
  }
  return messages;
}

export function validateMetadataContent(
  content: string,
  fileLabel: string,
  options: ValidateOptions = {},
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const headings = extractHeadings(content);

  messages.push(...validateRequiredHeadings(headings, fileLabel));

  const basicTables = extractTablesInSection(content, "## 基本情報");
  const platformTables = extractTablesInSection(
    content,
    "## Platform 別 Example",
  );
  const recommendedTables = extractTablesInSection(
    content,
    "## 推奨 Example",
  );

  for (const table of basicTables) {
    messages.push(...validateTableStructure(table, fileLabel, "基本情報"));
  }

  if (platformTables.length === 0 && headings.has("## Platform 別 Example")) {
    messages.push({
      level: "error",
      message: `${fileLabel}: ## Platform 別 Example section has no valid table`,
    });
  }

  for (const table of platformTables) {
    messages.push(...validatePlatformTable(table, fileLabel));
  }

  for (const table of recommendedTables) {
    messages.push(
      ...validateTableStructure(table, fileLabel, "推奨 Example"),
    );
  }

  if (!options.templateMode) {
    messages.push(...validateBasicInfoWarnings(basicTables, fileLabel));
    messages.push(...validateRecommendedWarnings(recommendedTables, fileLabel));
  }

  return messages;
}
