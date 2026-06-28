'use client'

import { useState, useMemo, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Inbox,
} from 'lucide-react'

export interface Column<T> {
  key: keyof T | 'actions'
  header: string
  render: (item: T) => ReactNode
  sortable?: boolean
  className?: string
  cellClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchFields?: (keyof T)[]
  pageSize?: number
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Pesquisar...',
  searchFields,
  pageSize = 10,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim() || !searchFields) return data
    const q = search.toLowerCase()
    return data.filter((item) =>
      (searchFields as string[]).some((field) => {
        const itemRecord = item as Record<string, unknown>
        const val = itemRecord[field]
        return val != null && String(val).toLowerCase().includes(q)
      }),
    )
  }, [data, search, searchFields])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aRecord = a as Record<string, unknown>
      const bRecord = b as Record<string, unknown>
      const aVal = aRecord[sortKey]
      const bVal = bRecord[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), 'pt-BR', { sensitivity: 'base' })
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortOrder])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
    setPage(0)
  }

  function SortIcon({ columnKey }: { columnKey: string }) {
    if (sortKey !== columnKey) return <ChevronsUpDown className="h-3 w-3 ml-1 inline" />
    return sortOrder === 'asc'
      ? <ChevronUp className="h-3 w-3 ml-1 inline" />
      : <ChevronDown className="h-3 w-3 ml-1 inline" />
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-9 w-48" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searchFields && (
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="pl-8"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  className={col.className}
                  onClick={col.sortable ? () => toggleSort(col.key as string) : undefined}
                  role={col.sortable ? 'button' : undefined}
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={col.sortable ? (e) => { if (e.key === 'Enter') toggleSort(col.key as string) } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as string)}
                      className="inline-flex items-center cursor-pointer hover:text-foreground"
                    >
                      {col.header}
                      <SortIcon columnKey={col.key as string} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Inbox className="h-8 w-8 mb-2" />
                    <p>{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((item, i) => (
                <TableRow
                  key={(item as Record<string, unknown>).id as string ?? String(i)}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key as string} className={col.cellClassName}>
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {page * pageSize + 1} a {Math.min((page + 1) * pageSize, sorted.length)} de{' '}
            {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
