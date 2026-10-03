import type { CSSProperties, ReactNode } from "react";

export type BlogTableData = {
  columns: string[];
  rows: string[][];
  // Shown above the table and used as its accessible name.
  caption?: string;
  // Render each row's first cell as a row header (<th scope="row">), for
  // tables where the first column labels the row (e.g. "Session 1").
  rowHeaders?: boolean;
};

// A post content table. The wrapper scrolls horizontally when the table is
// wider than the column: each column gets a minimum width (--blog-table-cols
// in blog.css), so up to three columns fit a phone screen and anything
// wider scrolls inside the post instead of stretching the page. The caption
// sits outside the scrolling box so it never gets clipped, and the wrapper
// is focusable so keyboard users can scroll it too.
// `renderCell` lets JSON resource pages render cells as rich text (maths,
// bold); blog posts pass plain strings through unchanged.
export default function BlogTable({ table, id, renderCell = cell => cell }: {
  table: BlogTableData;
  id: string;
  renderCell?: (cell: string) => ReactNode;
}) {
  const style = { "--blog-table-cols": table.columns.length } as CSSProperties;
  const captionId = `${id}-caption`;

  return (
    <figure className="blog-table-figure">
      {table.caption && (
        <figcaption id={captionId} className="blog-table-caption">{table.caption}</figcaption>
      )}
      <div
        className="blog-table-wrap"
        role="region"
        aria-labelledby={table.caption ? captionId : undefined}
        aria-label={table.caption ? undefined : "Table"}
        tabIndex={0}
      >
        <table className="blog-table" style={style} aria-labelledby={table.caption ? captionId : undefined}>
          <thead>
            <tr>
              {table.columns.map((column, i) => (
                <th key={i} scope="col">{renderCell(column)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === 0 && table.rowHeaders
                    ? <th key={j} scope="row">{renderCell(cell)}</th>
                    : <td key={j}>{renderCell(cell)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
