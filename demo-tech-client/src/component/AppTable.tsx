import {MenuItem, Pagination, Select} from "@mui/material";
import {MaterialReactTable, type MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";

interface AppTableProps<T extends object> {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    action?: boolean;
    index?: boolean;
    totalPages?: number;
    totalElements?: number;
    maxHeight?: number | string;
    onPageChange?: (pageIndex: number) => void; // 👈 thêm
    onPageSizeChange?: (pageSize: number) => void; // 👈 thêm
}

export default function AppTable<T extends object>({
                                                       data,
                                                       columns,
                                                       onEdit,
                                                       onDelete,
                                                       totalPages,
                                                       totalElements,
                                                       maxHeight = "70vh",
                                                       onPageChange,
                                                       onPageSizeChange,
                                                       action = false,
                                                       index = true,
                                                   }: AppTableProps<T>) {
    const memoColumns = useMemo<MRT_ColumnDef<T>[]>(() => {
        const base: MRT_ColumnDef<T>[] = [];

        if (index) {
            base.push({
                id: "index",
                header: "STT",
                size: 50,
                Cell: ({ row }) => row.index + 1,
            });
        }
        if (action) {
            base.push({
                id: "actions",
                header: "Actions",
                size: 100,
                Cell: ({ row }) => (
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
                ),
            });
        }
        return [...base, ...columns];
    }, [index, action, columns, onEdit, onDelete]);


    return (
        <MaterialReactTable
            columns={memoColumns}
            data={data}
            manualPagination
            rowCount={totalElements}
            pageCount={totalPages}
            muiTablePaperProps={{
                className: "shadow-md rounded-xl",
            }}
            muiTableProps={{
                sx: {
                    border: '1px solid rgba(81, 81, 81, .5)',
                }
            }}
            muiTableHeadCellProps={{
                sx: {
                    border: '1px solid rgba(81, 81, 81, .5)',
                },
            }}
            muiTableBodyCellProps={({row}) => ({
                sx: {
                    border: '1px solid rgba(81, 81, 81, .5)',
                    backgroundColor: row.index % 2 === 0 ? '#f9f9f9' : '#ffffff', // màu nền so le
                },
            })}
            muiTableContainerProps={{
                sx: {
                    maxHeight: maxHeight,
                },
            }}
            renderBottomToolbar={({table}) =>
                (
                    <div className="flex items-center p-2 gap-2 justify-end">
                        {/* chọn page size */}
                        <span>Rows per page:</span>
                        <Select
                            size="small"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);
                                table.setPageSize(newSize);
                                onPageSizeChange?.(newSize); // 👈 gọi callback
                            }}
                        >
                            {[5, 10, 20, 50, 100].map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                        {/* pagination 1,2,3... */}
                        <Pagination
                            count={totalPages}
                            page={table.getState().pagination.pageIndex + 1}
                            onChange={(_, page) => {
                                table.setPageIndex(page - 1);
                                onPageChange?.(page); // 👈 gọi callback
                            }}
                            color="primary"
                            shape="rounded"
                        />
                    </div>
                )
            }
        />
    )
        ;
}
