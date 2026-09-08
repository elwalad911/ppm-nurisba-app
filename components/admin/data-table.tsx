"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Cari data...",
  emptyMessage = "Tidak ada data tersedia.",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = searchKey
    ? data.filter((item) => {
        const val = item[searchKey];
        if (!val) return false;
        return String(val).toLowerCase().includes(searchQuery.toLowerCase());
      })
    : data;

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      )}

      {/* Table for Desktop / Tablet */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-primary-soft/50 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-sm text-text-primary">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-background/50">
                  {columns.map((col, idx) => {
                    const value =
                      typeof col.accessorKey === "function"
                        ? col.accessorKey(row)
                        : row[col.accessorKey];
                    return (
                      <td key={idx} className={`px-6 py-4 ${col.className || ""}`}>
                        {value as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card List for Mobile */}
      <div className="space-y-4 md:hidden">
        {filteredData.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            {emptyMessage}
          </div>
        ) : (
          filteredData.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-3"
            >
              {columns.map((col, idx) => {
                const value =
                  typeof col.accessorKey === "function"
                    ? col.accessorKey(row)
                    : row[col.accessorKey];
                return (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-text-secondary text-xs uppercase">
                      {col.header}
                    </span>
                    <div className="text-right text-text-primary">
                      {value as React.ReactNode}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
