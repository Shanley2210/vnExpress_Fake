import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Toolbar,
  Typography,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Cấu hình base URL cho axios
axios.defaults.baseURL = 'https://vnexpress-fake.onrender.com/';

function Admin() {
  // State dữ liệu
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [articleTitles, setArticleTitles] = useState({});

  // State cho form thêm bài viết
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');

  // State cho vai trò của user
  const [userRoles, setUserRoles] = useState({});

  // State chuyển tab: 'articles', 'comments', 'users'
  const [activeTab, setActiveTab] = useState('articles');

  // Lấy headers xác thực từ token
  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  // Format lại bình luận để đưa display_name lên cấp trên
  const formattedComments = comments.map((comment) => ({
    ...comment,
    display_name: comment.user?.display_name || 'Không rõ',
    user_id: comment.user?.id || null,
  }));
  console.log("Formatted comments:", formattedComments);

  // Gọi API khi component mount
  useEffect(() => {
    fetchArticles();
    fetchComments();
    fetchUsers();
  }, []);

  // Hàm lấy bài viết
  const fetchArticles = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await axios.get('/api/admin/articles', { headers });
      setArticles(res.data.articles || []);
      const titles = {};
      res.data.articles.forEach((article) => {
        titles[article.id] = article.title;
      });
      setArticleTitles(titles);
    } catch (error) {
      toast.error('Lỗi khi lấy bài viết!');
    }
  };

  // Hàm lấy bình luận
  const fetchComments = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await axios.get('/api/admin/comments', { headers });
      setComments(res.data.comments || []);
    } catch (error) {
      toast.error('Lỗi khi lấy bình luận!');
    }
  };

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await axios.get('/api/users', { headers });
      setUsers(res.data.users || []);
      const roles = {};
      res.data.users.forEach((user) => {
        roles[user.id] = user.role;
      });
      setUserRoles(roles);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách người dùng!');
    }
  };

  // Xử lý thêm bài viết mới
  const handleAddArticle = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    if (!title || !slug || !content || !category) {
      toast.error('Vui lòng điền đầy đủ tiêu đề, slug, nội dung và danh mục!');
      return;
    }

    const categoryNumber = parseInt(category, 10);
    if (isNaN(categoryNumber)) {
      toast.error('Danh mục phải là một số hợp lệ!');
      return;
    }

    const payload = {
      title,
      slug,
      content,
      thumbnail,
      category_id: categoryNumber,
      author_id: authorId,
    };

    try {
      await axios.post('/api/articles', payload, { headers });
      toast.success('Bài viết mới đã được tạo!');
      setTitle('');
      setSlug('');
      setContent('');
      setThumbnail('');
      setCategory('');
      fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.errMessage || 'Có lỗi xảy ra khi tạo bài viết!'
      );
    }
  };

  // Xử lý xóa bài viết
  const handleDeleteArticle = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/articles/${id}`, { headers });
      setArticles((prev) => prev.filter((article) => article.id !== id));
      toast.success('Bài viết đã bị xóa!');
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết!');
    }
  };

  // Xử lý xóa bình luận
  const handleDeleteComment = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/comments/${id}`, { headers });
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      toast.success('Bình luận đã bị xóa!');
    } catch (error) {
      toast.error('Lỗi khi xóa bình luận!');
    }
  };

  // Xử lý cập nhật vai trò người dùng
  const handleUpdateUserRole = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.put(`/api/users/${id}/role`, { role: userRoles[id] }, { headers });
      toast.success('Cập nhật vai trò thành công!');
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi cập nhật vai trò người dùng!');
    }
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/users/${id}`, { headers });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('Người dùng đã bị xóa!');
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng!');
    }
  };

  // Xử lý chuyển tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      {/* Thanh Menu */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2, #2196f3)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Trang Quản Trị
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Bài Viết" value="articles" />
            <Tab label="Bình Luận" value="comments" />
            <Tab label="Người Dùng" value="users" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
        {activeTab === 'articles' && (
          <Box>
            {/* Form thêm bài viết */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Thêm Bài Viết Mới
            </Typography>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }} elevation={3}>
              <form onSubmit={handleAddArticle} style={{ display: 'grid', gap: '16px' }}>
                <TextField
                  label="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Slug (URL)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Nội dung"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Thumbnail (URL)"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Danh mục"
                  >
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
                <Button variant="contained" color="primary" type="submit" sx={{ py: 1.5, fontWeight: 'bold' }}>
                  Thêm Bài Viết
                </Button>
              </form>
            </Paper>

            {/* Quản lý bài viết */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quản lý Bài Viết
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
              <DataGrid
                rows={articles}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'title', headerName: 'Tiêu đề', width: 250 },
                  { field: 'slug', headerName: 'Slug', width: 200 },
                  { field: 'content', headerName: 'Nội dung', width: 300 },
                  { field: 'thumbnail', headerName: 'Thumbnail', width: 200 },
                  { field: 'author_id', headerName: 'ID người viết', width: 200 },
                  {
                    field: 'category_id',
                    headerName: 'Danh mục',
                    width: 150,
                    renderCell: (params) => <span>{params.value}</span>
                  },
                  { field: 'created_at', headerName: 'Ngày tạo', width: 180 },
                  {
                    field: 'delete',
                    headerName: 'Xóa',
                    width: 120,
                    renderCell: (params) => (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteArticle(params.id)}
                      >
                        Xóa
                      </Button>
                    )
                  }
                ]}
                pageSize={5}
                autoHeight
                getRowId={(row) => row.id}
              />
            </Paper>
          </Box>
        )}

        {activeTab === 'comments' && (
          <Box>
            {/* Quản lý bình luận */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quản lý Bình Luận
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
              <DataGrid
                key={activeTab}
                rows={formattedComments}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'content', headerName: 'Nội dung', width: 300 },
                  { field: 'user_id', headerName: 'ID người bình luận', width: 200 },
                  { field: 'article_id', headerName: 'ID bài viết', width: 200 },
                  { field: 'created_at', headerName: 'Ngày tạo', width: 180 },
                  {
                    field: 'delete',
                    headerName: 'Xóa',
                    width: 120,
                    renderCell: (params) => (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteComment(params.id)}
                      >
                        Xóa
                      </Button>
                    )
                  }
                ]}
                pageSize={5}
                autoHeight
                getRowId={(row) => row.id}
              />
            </Paper>
          </Box>
        )}

        {activeTab === 'users' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quản lý Người Dùng
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
              <DataGrid
                rows={users}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'display_name', headerName: 'Tên', width: 200 },
                  { field: 'email', headerName: 'Email', width: 250 },
                  {
                    field: 'role',
                    headerName: 'Vai trò',
                    width: 200,
                    renderCell: (params) => (
                      <FormControl fullWidth size="small">
                        <Select
                          value={userRoles[params.row.id] || ''}
                          onChange={(e) =>
                            setUserRoles({
                              ...userRoles,
                              [params.row.id]: e.target.value
                            })
                          }
                        >
                          <MenuItem value="reader">Reader</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="author">Author</MenuItem>
                        </Select>
                      </FormControl>
                    )
                  },
                  {
                    field: 'actions',
                    headerName: 'Hành động',
                    width: 250,
                    renderCell: (params) => (
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleUpdateUserRole(params.row.id)}
                          sx={{ mr: 1 }}
                        >
                          Cập nhật
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(params.row.id)}
                        >
                          Xóa
                        </Button>
                      </Box>
                    )
                  }
                ]}
                pageSize={5}
                autoHeight
                getRowId={(row) => row.id}
              />
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Admin;
