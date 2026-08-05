import React from "react";

interface TableColumn<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  subtitle?: string;
  minWidth?: string;
}

export default function Table<T>({
  data,
  columns,
  title,
  subtitle,
  minWidth = "min-w-[650px]",
}: TableProps<T>) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header section (optional) */}
      {(title || subtitle) && (
        <div className="p-6 border-b border-zinc-100 text-left">
          {title && <h3 className="text-base font-bold text-zinc-900">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Table Wrapper */}
      <div className="w-full overflow-x-auto scrollbar-thin">
        <table className={`w-full ${minWidth} border-collapse text-left text-sm text-zinc-500`}>
          <thead className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className={`px-4 py-3.5 whitespace-nowrap ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-zinc-50/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-4 py-3.5 whitespace-nowrap text-zinc-700 font-semibold ${col.className || ""}`}>
                      {col.render(item, rowIdx)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2M5 13V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                    </svg>
                    <span className="text-sm font-medium">No records found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
