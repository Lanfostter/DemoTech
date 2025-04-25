import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { PasswordRounded } from "@mui/icons-material";
import { MRT_ColumnDef } from "material-react-table";
import { User } from "../../model/user.ts";
import TableComponent from "../../component/TableComponent.tsx";
import {AppDispatch, RootState} from "../../redux/store.ts";

const UserTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { page, loading,search } = useSelector((state: RootState) => state.page);

    const handleChangePagination = async (change: number) => {
    };


    const columns: MRT_ColumnDef<User>[] = [
        {
            accessorKey: "#",
            header: "#",
            size: 50,
            Cell: ({ row }) => row.index + 1,
            muiTableBodyCellProps: { align: "center" },
        },
        {
            header: "Action",
            id: "action",
            Cell: () => (
                <IconButton
                    color="primary"
                >
                    <PasswordRounded />
                </IconButton>
            ),
            size: 100,
            muiTableBodyCellProps: { align: "center" },
        },
        {
            accessorKey: "username",
            header: "Username",
            size: 150,
        },
        {
            accessorKey: "role",
            header: "Role",
            size: 150,
        },
    ];

    return (
        <>
            {loading ? <p>Loading...</p> : (
                <TableComponent
                    data={page.content}
                    columns={columns}
                    pageCount={page.totalPages}
                    rowCount={page.totalItems}
                    pagination={{
                        pageSize: search.pageSize,
                        pageIndex: search.pageIndex,
                    }}
                    handleChangePagination={handleChangePagination}
                />
            )}
        </>
    );
};

export default UserTable;
