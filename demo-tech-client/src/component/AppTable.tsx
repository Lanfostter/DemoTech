import {type MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { useMemo } from "react";

interface AppTableProps<T extends object> {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    enableRowActions?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export default function AppTable<T extends object>({
                                                       data,
                                                       columns,
                                                       enableRowActions = false,
                                                       onEdit,
                                                       onDelete,
                                                   }: AppTableProps<T>) {
    const memoColumns = useMemo(() => columns, [columns]);

    return (
        <MaterialReactTable
            columns={memoColumns}
            data={data}
            enableRowActions={enableRowActions}
            renderRowActions={({ row }) =>
                enableRowActions ? (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => onEdit(row.original)}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => onDelete(row.original)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ) : null
            }
            muiTablePaperProps={{
                className: "shadow-md rounded-xl", // Tailwind style
            }}
        />
    );
}
