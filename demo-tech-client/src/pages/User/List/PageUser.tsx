import {useEffect} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {User} from "../../../models/user.ts";
import AppTable from "../../../component/AppTable.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@reduxjs/toolkit/query";
import {fetchUsers, resetUser, setPageIndex, setPageSize} from "../../../features/userSlice.ts";

export default function PageUser() {
    const dispatch = useDispatch<any>();
    const {page, pageIndex, totalElements, loading} = useSelector(
        (state: RootState) => state.user
    );

    // load khi khởi tạo hoặc khi currentPage/pageSize thay đổi
    useEffect(() => {
        dispatch(fetchUsers({pageIndex: page.pageIndex, pageSize: page.pageSize}));
        return () => {
            dispatch(resetUser()); // cleanup đúng cách
        };
    }, [dispatch]);

    const columns: MRT_ColumnDef<User>[] = [
        {accessorKey: "id", header: "ID"},
        {accessorKey: "name", header: "Họ tên"},
        {accessorKey: "email", header: "Email"},
        {accessorKey: "role", header: "Role"},
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Quản lý người dùng</h1>
            <AppTable<User>
                data={page.content}
                columns={columns}
                totalPages={page.totalPages}
                totalElements={page.totalElements}
                onPageChange={(newPage) => {
                    dispatch(setPageIndex(newPage));
                    dispatch(fetchUsers({pageIndex: newPage, pageSize: page.pageSize}));
                }}
                onPageSizeChange={(newSize) => {
                    dispatch(setPageSize(newSize));
                    dispatch(fetchUsers({pageIndex: 1, pageSize: newSize}));
                }}
            />
        </div>
    );
}
