import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho props
interface TaleComponentProps<T extends Record<string, any>> {
    columns: MRT_ColumnDef<T>[];
    data: T[];
    pageCount: number;
    rowCount: number;
    handleChangePagination?: (pageIndex: number, pageSize: number) => void;
    enableTopToolbar?: boolean;
    enablePagination?: boolean;
    pagination:{
        pageIndex: number,
        pageSize: number
    }
}

// Component Table
const TableComponent = <T extends Record<string, any>>({
                                                          columns,
                                                          data,
                                                          pageCount,
                                                          rowCount,
                                                          handleChangePagination,
                                                          enableTopToolbar = false,
                                                          enablePagination = true,
                                                          ...props
                                                      }: TaleComponentProps<T>) => {

    // State quản lý pagination
    const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Gọi hàm `handleChangePagination` mỗi khi pageIndex hoặc pageSize thay đổi
    useEffect(() => {
        if (handleChangePagination) {
            handleChangePagination(pagination.pageIndex + 1, pagination.pageSize);
        }
    }, [pagination.pageIndex, pagination.pageSize, handleChangePagination]);

    // Cấu hình MaterialReactTable
    const table = useMaterialReactTable<T>({
        columns,
        data,
        pageCount,
        rowCount,
        autoResetPageIndex: false,
        state: { pagination },
        enableSorting: false,
        enableFilters: false,
        enableColumnActions: false,
        enableTopToolbar,
        enablePagination,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnResizing: true,
        layoutMode: "grid", // Bật grid layout
        paginationDisplayMode: "pages",
        muiTableHeadCellProps: {
            align: "center",
            sx: {
                top: 0,
                zIndex: 9999,
                border: "1px solid rgba(81, 81, 81, .5)",
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
            },
        },
        muiTableBodyCellProps: {
            sx: {
                padding: "8px 10px",
                border: "1px solid rgba(81, 81, 81, .5)",
                fontSize: "0.875rem",
            },
        },
        muiTableContainerProps: {
            sx: {
                height: "100%",
                maxHeight: "500px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            },
        },
        muiTableProps: {
            sx: {
                height: "100%",
                minWidth: "700px",
            },
        },
        muiTablePaperProps: {
            sx: {
                height: "100%",
                borderRadius: "unset",
            },
        },
        ...(enablePagination
            ? {
                onPaginationChange: setPagination,
                manualPagination: true,
                muiPaginationProps: {
                    color: "primary",
                    rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
                    shape: "rounded",
                    variant: "outlined",
                    showRowsPerPage: true,
                },
            }
            : {}),
        ...props, // Spread các props khác
    });

    return <MaterialReactTable table={table} />;
};

export default TableComponent;
