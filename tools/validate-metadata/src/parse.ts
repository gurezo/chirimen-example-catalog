export type TableRow = string[];

export type MarkdownTable = {
  header: TableRow;
  rows: TableRow[];
  startLine: number;
};

export function parseTableCells(line: string): string[] | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return null;
  }
  const inner = trimmed.slice(1, -1);
  return inner.split("|").map((cell) => cell.trim());
}

export function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-+:?$/.test(cell));
}

export function stripBackticks(value: string): string {
  return value.replace(/^`+|`+$/g, "").trim();
}

export function extractHeadings(content: string): Set<string> {
  const headings = new Set<string>();
  for (const line of content.split("\n")) {
    if (line.startsWith("## ")) {
      headings.add(line.trimEnd());
    }
  }
  return headings;
}

export function extractTablesInSection(
  content: string,
  sectionHeading: string,
): MarkdownTable[] {
  const lines = content.split("\n");
  const tables: MarkdownTable[] = [];
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      inSection = line.trimEnd() === sectionHeading;
      continue;
    }
    if (!inSection) continue;

    const headerCells = parseTableCells(line);
    if (!headerCells) continue;

    const separatorLine = lines[i + 1];
    if (separatorLine === undefined) continue;
    const separatorCells = parseTableCells(separatorLine);
    if (!separatorCells || !isSeparatorRow(separatorCells)) continue;

    if (headerCells.length !== separatorCells.length) continue;

    const rows: TableRow[] = [];
    let j = i + 2;
    for (; j < lines.length; j++) {
      const rowCells = parseTableCells(lines[j]);
      if (!rowCells) break;
      rows.push(rowCells);
    }

    tables.push({ header: headerCells, rows, startLine: i + 1 });
    i = j - 1;
  }

  return tables;
}

export function findTableRow(
  table: MarkdownTable,
  label: string,
): TableRow | undefined {
  return table.rows.find((row) => stripBackticks(row[0] ?? "") === label);
}

export function getColumnIndex(table: MarkdownTable, name: string): number {
  return table.header.findIndex(
    (cell) => stripBackticks(cell).toLowerCase() === name.toLowerCase(),
  );
}
