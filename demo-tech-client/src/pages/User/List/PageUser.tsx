import {useEffect, useState} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {User} from "../../../models/user.ts";
import AppTable from "../../../component/AppTable.tsx";
import {pagingUser} from "../user-service.ts";

export default function PageUser() {
    const [users, setUsers] = useState<User[]>([
        {id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Admin"},
        {id: 2, name: "Trần Thị B", email: "b@example.com", role: "User"},
    ]);

    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        const user = await pagingUser({pageIndex: 1, pageSize: 10})
        setUsers(user.content)
    }
    const columns: MRT_ColumnDef<User>[] = [
        {accessorKey: "id", header: "ID"},
        {accessorKey: "name", header: "Họ tên"},
        {accessorKey: "email", header: "Email"},
        {accessorKey: "role", header: "Role"},
    ];

    const handleEdit = (row: User) => {
        console.log("Edit:", row);
    };

    const handleDelete = (row: User) => {
        setUsers((prev) => prev.filter((u) => u.id !== row.id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Quản lý người dùng</h1>
            <AppTable<User>
                data={users}
                columns={columns}
                enableRowActions
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
