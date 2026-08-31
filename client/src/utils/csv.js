function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function rowsToCsv(rows, columns) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",");
  const body = (rows || []).map((row) =>
    columns
      .map((column) => {
        const value = typeof column.value === "function" ? column.value(row) : row[column.key];
        return escapeCsvValue(value);
      })
      .join(",")
  );
  return [header, ...body].join("\n");
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
