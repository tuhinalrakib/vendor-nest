import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate array of page numbers to render
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 py-4" aria-label="Pagination">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Pages list */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`w-9 h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-all active:scale-95 ${
            currentPage === page
              ? "bg-indigo-600 text-white shadow-sm"
              : "border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-800"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
