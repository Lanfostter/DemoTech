import { useEffect, useState } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

import type { User } from '../../../models/user.ts';
import AppTable from '../../../component/AppTable.tsx';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@reduxjs/toolkit/query';
import {
  fetchUsers,
  resetUser,
  setPageIndex,
  setPageSize,
} from '../../../features/userSlice.ts';
import UserFormModal from './UserFormModal';
import { deleteUser } from '../user-service';

export default function PageUser() {
  const dispatch = useDispatch<any>();
  const { page, pageIndex, totalElements, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load when initializing or when currentPage/pageSize changes
  useEffect(() => {
    dispatch(fetchUsers({ pageIndex: page.pageIndex, pageSize: page.pageSize }));
    return () => {
      dispatch(resetUser()); // Cleanup properly
    };
  }, [dispatch]);

  const handleAddUserClick = () => {
    setSelectedUser(null);
    setFormModalOpen(true);
  };

  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setFormModalOpen(true);
  };

  const handleDeleteUserClick = (user: User) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa người dùng "${user.name}"?`
    );
    if (!confirmed) return;

    (async () => {
      try {
        await deleteUser(user.id);
        toast.success('Xóa người dùng thành công!');
        // Refresh user list
        dispatch(fetchUsers({ pageIndex: page.pageIndex, pageSize: page.pageSize }));
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || 'Đã xảy ra lỗi khi xóa người dùng';
        toast.error(errorMessage);
        console.error('Delete user failed:', error);
      }
    })();
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    // Refresh user list after creating/updating
    dispatch(fetchUsers({ pageIndex: page.pageIndex, pageSize: page.pageSize }));
  };

    const columns: MRT_ColumnDef<User>[] = [
        {accessorKey: "id", header: "ID"},
        {accessorKey: "name", header: "Họ tên"},
        {accessorKey: "email", header: "Email"},
        {accessorKey: "role", header: "Role"},
    ];

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUserClick}
          sx={{
            background: 'linear-gradient(to right, #7F00FF, #E100FF)',
            '&:hover': {
              background: 'linear-gradient(to right, #E100FF, #7F00FF)',
            },
          }}
        >
          Thêm mới
        </Button>
      </Box>

      <AppTable<User>
        data={page.content}
        columns={columns}
        totalPages={page.totalPages}
        totalElements={page.totalElements}
        action={true}
        onEdit={handleEditUserClick}
        onDelete={handleDeleteUserClick}
        onPageChange={(newPage) => {
          dispatch(setPageIndex(newPage));
          dispatch(fetchUsers({ pageIndex: newPage, pageSize: page.pageSize }));
        }}
        onPageSizeChange={(newSize) => {
          dispatch(setPageSize(newSize));
          dispatch(fetchUsers({ pageIndex: 1, pageSize: newSize }));
        }}
      />

      <UserFormModal
        open={formModalOpen}
        user={selectedUser}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
