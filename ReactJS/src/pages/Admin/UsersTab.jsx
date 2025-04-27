import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Button, FormControl, Select, MenuItem, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});

  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const headers = getAuthHeaders(); if (!headers) return;
    try {
      const { data } = await axios.get('/api/users?page=1&limit=100', { headers });
      setUsers(data.users || []);
      const map = {}; (data.users||[]).forEach(u=>map[u.id]=u.role);
      setRoles(map);
    } catch {
      toast.error('Lỗi khi lấy người dùng');
    }
  };

  const updateRole = async id => {
    const headers = getAuthHeaders(); if (!headers) return;
    try {
      await axios.put(`/api/users/${id}/role`, { role: roles[id] }, { headers });
      toast.success('Cập nhật thành công');
      fetch();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const deleteUser = async id => {
    const headers = getAuthHeaders(); if (!headers || !window.confirm('Xác nhận xóa người dùng?')) return;
    try {
      await axios.delete(`/api/users/${id}`, { headers });
      setUsers(prev => prev.filter(u=>u.id!==id));
      toast.success('Đã xóa');
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Quản lý Người Dùng</Typography>
      <Paper sx={{ p:2, mt:2 }}>
        <DataGrid
          autoHeight pageSize={5}
          rows={users} getRowId={r=>r.id}
          columns={[
            { field:'id', headerName:'ID', width:70 },
            { field:'display_name', headerName:'Tên', width:200 },
            { field:'email', headerName:'Email', width:250 },
            {
              field:'role', headerName:'Vai trò', width:180,
              renderCell: params => (
                <FormControl fullWidth size="small">
                  <Select
                    value={roles[params.row.id]||''}
                    onChange={e=>setRoles({...roles,[params.row.id]:e.target.value})}
                  >
                    <MenuItem value="reader">Reader</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              )
            },
            {
              field:'actions', headerName:'Hành động', width:240,
              renderCell: params => (
                <Box>
                  <Button size="small" variant="contained" onClick={()=>updateRole(params.row.id)} sx={{mr:1}}>
                    Cập nhật
                  </Button>
                  <Button size="small" variant="contained" color="error" startIcon={<DeleteIcon/>}
                    onClick={()=>deleteUser(params.row.id)}>
                    Xóa
                  </Button>
                </Box>
              )
            }
          ]}
        />
      </Paper>
    </Box>
  );
}
