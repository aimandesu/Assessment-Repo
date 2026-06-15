import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyState?: React.ReactNode;
}

export function ReusableTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
}: ReusableTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-muted/20 transition-colors">
          {columns.map((col, i) => (
            <TableHead key={i} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>{emptyState}</TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow key={keyExtractor(row)}>
              {columns.map((col, i) => (
                <TableCell key={i} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
