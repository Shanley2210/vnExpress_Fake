import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel,
  FormControl, Typography, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

export default function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const { data } = await axios.get('/api/admin/articles?page=1&limit=100', { headers });
      setArticles(data.articles || []);
    } catch {
      toast.error('Lỗi khi lấy bài viết!');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers || !title || !slug || !content || !category) {
      toast.error('Thiếu thông tin');
      return;
    }
    try {
      await axios.post('/api/articles', {
        title, slug, content, category_id: +category, thumbnail, author_id: 1
      }, { headers });
      toast.success('Đã tạo bài viết!');
      setTitle(''); setSlug(''); setContent(''); setCategory(''); setThumbnail('');
      fetchArticles();
      setShowAddForm(false); // Ẩn form sau khi thêm
    } catch {
      toast.error('Tạo bài viết thất bại');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Bạn chắc chắn muốn xóa bài viết này?');
    if (!isConfirmed) return;
    const headers = getAuthHeaders();
    if (!headers) {
      toast.error('Chưa đăng nhập');
      return;
    }
    try {
      await axios.delete(`/api/articles/${id}`, { headers });
      setArticles(prev => prev.filter(article => article.id !== id));
      toast.success('Đã xóa bài viết');
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.errMessage || 'Xóa bài viết thất bại');
    }
  };

  const openDetail = (row) => {
    setSelectedArticle(row);
    setOpenDialog(true);
  };

  const closeDetail = () => {
    setSelectedArticle(null);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Quản lý Bài Viết</Typography>

      {/* Nút mở/ẩn form thêm bài viết */}
      <Button 
        variant="contained" 
        onClick={() => setShowAddForm(prev => !prev)} 
        sx={{ mb: 2 }}
      >
        {showAddForm ? 'Đóng' : 'Thêm Bài Viết'}
      </Button>

      {/* Form thêm bài viết (ẩn/hiện theo showAddForm) */}
      {showAddForm && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }} elevation={3}>
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: '16px' }}>
            <TextField label="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
            <TextField label="Slug" value={slug} onChange={e => setSlug(e.target.value)} fullWidth />
            <TextField multiline rows={4} label="Nội dung" value={content} onChange={e => setContent(e.target.value)} fullWidth />
            <TextField label="Thumbnail URL" value={thumbnail} onChange={e => setThumbnail(e.target.value)} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select value={category} onChange={e => setCategory(e.target.value)} label="Danh mục">
                <MenuItem value="1">Công nghệ</MenuItem>
                <MenuItem value="2">Khoa học</MenuItem>
                <MenuItem value="3">Sức khỏe</MenuItem>
                <MenuItem value="4">Kinh doanh</MenuItem>
                <MenuItem value="5">Giáo dục</MenuItem>
                <MenuItem value="6">Lập trình</MenuItem>
                <MenuItem value="7">Vật lý</MenuItem>
                <MenuItem value="8">Y học</MenuItem>
                <MenuItem value="9">Tài chính</MenuItem>
                <MenuItem value="10">E-learning</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" type="submit">Lưu Bài Viết</Button>
          </form>
        </Paper>
      )}

      {/* Danh sách bài viết */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
      <DataGrid
  autoHeight
  pageSize={5}
  rows={articles}
  getRowId={(row) => row.id}
  columns={[
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Tiêu đề', width: 200 },
    { field: 'slug', headerName: 'Slug', width: 100 },
    { field: 'content', headerName: 'Nội dung', width: 300 },
    { field: 'thumbnail', headerName: 'Thumbnail', width: 100 },
    { field: 'category_id', headerName: 'Danh mục', width: 50 },
    { field: 'created_at', headerName: 'Ngày tạo', width: 100 },
    {
      field: 'actions', headerName: 'Hành động', width: 200, sortable: false,
      renderCell: (params) => (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Button variant="contained" size="small" onClick={() => openDetail(params.row)}>Xem</Button>
          <Button color="error" variant="contained" size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>
            Xóa
          </Button>
        </Box>
      )
    }      
  ]}
/>
      </Paper>

      {/* Dialog xem chi tiết bài viết */}
      <Dialog open={openDialog} onClose={closeDetail} fullWidth maxWidth="md">
        <DialogTitle>Chi tiết Bài Viết</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedArticle?.title}</Typography>
          {selectedArticle?.thumbnail && (
            <Box component="img" src={selectedArticle.thumbnail} alt="thumbnail" sx={{ width: '100%', mt: 2 }} />
          )}
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
            {selectedArticle?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
