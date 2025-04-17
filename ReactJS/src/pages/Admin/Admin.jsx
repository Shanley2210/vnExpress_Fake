import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

// Cấu hình base URL cho axios
axios.defaults.baseURL = 'https://vnexpress-fake.onrender.com/';

export default function Admin() {
  // States
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [articleTitles, setArticleTitles] = useState({});
  const [userRoles, setUserRoles] = useState({});
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');

  // Dialog for article details
  const [openArticleDialog, setOpenArticleDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Form states for adding article
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');

  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  useEffect(() => {
    fetchArticles();
    fetchComments();
    fetchUsers();
  }, []);

  const fetchArticles = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const { data } = await axios.get('/api/admin/articles?page=1&limit=100', { headers });
      setArticles(data.articles || []);
      const titles = {};
      (data.articles || []).forEach(a => titles[a.id] = a.title);
      setArticleTitles(titles);
    } catch {
      toast.error('Lỗi khi lấy bài viết!');
    }
  };

  const fetchComments = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const { data } = await axios.get('/api/admin/comments', { headers });
      setComments(data.comments || []);
    } catch {
      toast.error('Lỗi khi lấy bình luận!');
    }
  };

  const fetchUsers = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      // Increase limit to fetch all users (default limit=10)
      const { data } = await axios.get('/api/users?page=1&limit=100', { headers });
      console.log('fetchUsers:', data);
      setUsers(data.users || []);
      const roles = {};
      (data.users || []).forEach(u => roles[u.id] = u.role);
      setUserRoles(roles);
    } catch (err) {
      console.error('fetchUsers error:', err);
      toast.error('Lỗi khi lấy người dùng!');
    }
  };

  // Attach display_name to comments
  const formattedComments = comments.map(c => {
    const u = users.find(u => u.id === c.user_id);
    return { ...c, display_name: u ? u.display_name : 'Không rõ' };
  });

  const filteredComments = selectedArticleId
    ? formattedComments.filter(c => c.article_id === selectedArticleId)
    : formattedComments;

  // Handlers
  const handleAddArticle = async e => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;
    if (!title || !slug || !content || !category) {
      toast.error('Vui lòng điền đầy đủ!');
      return;
    }
    try {
      await axios.post(
        '/api/articles',
        { title, slug, content, thumbnail, category_id: +category, author_id: 1 },
        { headers }
      );
      toast.success('Tạo bài viết thành công!');
      setTitle(''); setSlug(''); setContent(''); setThumbnail(''); setCategory('');
      fetchArticles();
    } catch {
      toast.error('Tạo bài viết thất bại!');
    }
    {articles.map(article => (
      <div key={article.id}>
        <p>{article.title}</p>
        <button onClick={() => deleteArticle(article.id)}>Xóa</button>
      </div>
    ))}
    
  };

  const handleDeleteArticle = async id => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/articles/${id}`, { headers });
      setArticles(prev => prev.filter(a => a.id !== id));
      toast.success('Đã xóa bài viết!');
    } catch {
      toast.error('Xóa bài viết thất bại!');
    }
  };

  const handleOpenArticleDialog = article => {
    setSelectedArticle(article);
    setOpenArticleDialog(true);
  };
  const handleCloseArticleDialog = () => {
    setOpenArticleDialog(false);
    setSelectedArticle(null);
  };

  const handleDeleteComment = async id => {
    const headers = getAuthHeaders();
    if (!headers) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await axios.delete(`/api/comments/${id}`, { headers });
      setComments(prev =>
        prev.map(c => ({ ...c, replies: (c.replies || []).filter(r => r.id !== id) }))
          .filter(c => c.id !== id)
      );
      toast.success('Đã xóa bình luận!');
    } catch {
      toast.error('Xóa bình luận thất bại!');
    }
  };

  const handleUpdateUserRole = async id => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.put(`/api/users/${id}/role`, { role: userRoles[id] }, { headers });
      toast.success('Cập nhật vai trò thành công!');
      fetchUsers();
    } catch {
      toast.error('Cập nhật vai trò thất bại!');
    }
  };

  const handleDeleteUser = async id => {
    const headers = getAuthHeaders();
    if (!headers) return toast.error('Cần đăng nhập!');
    if (!window.confirm('Xác nhận xóa người dùng?')) return;
    try {
      await axios.delete(`/api/users/${id}`, { headers });
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Đã xóa người dùng!');
    } catch {
      toast.error('Xóa người dùng thất bại!');
    }
  };

  const handleTabChange = (_, v) => {
    setActiveTab(v);
    if (v !== 'comments') setSelectedArticleId(null);
  };

  return (
    <Box sx={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2, #2196f3)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Trang Quản Trị</Typography>
          <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
            <Tab label="Bài Viết" value="articles" />
            <Tab label="Bình Luận" value="comments" />
            <Tab label="Người Dùng" value="users" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Thêm Bài Viết Mới</Typography>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }} elevation={3}>
              <form onSubmit={handleAddArticle} style={{ display: 'grid', gap: '16px' }}>
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
                <Button variant="contained" type="submit">Thêm Bài Viết</Button>
              </form>
            </Paper>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Quản lý Bài Viết</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
              <DataGrid
                autoHeight pageSize={5}
                rows={articles} getRowId={r => r.id}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'title', headerName: 'Tiêu đề', width: 250 },
                  { field: 'slug', headerName: 'Slug', width: 200 },
                  { field: 'content', headerName: 'Nội dung', width: 300 },
                  { field: 'thumbnail', headerName: 'Thumbnail', width: 300 },
                  { field: 'author_id', headerName: 'ID Tác giả', width: 150 },
                  { field: 'category_id', headerName: 'Danh mục', width: 120 },
                  { field: 'created_at', headerName: 'Ngày tạo', width: 180 },
                  {
                    field: 'view', headerName: 'Xem', width: 100,
                    renderCell: params => (
                      <Button
                        variant="contained"
                        onClick={() => handleOpenArticleDialog(params.row)}
                      >Xem</Button>
                    )
                  },
                  {
                    field: 'delete', headerName: 'Xóa', width: 100,
                    renderCell: params => (
                      <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteArticle(params.row.id)}>
                        Xóa
                      </Button>
                    )
                  }
                ]}
              />
            </Paper>

            {/* Article Details Dialog */}
            <Dialog open={openArticleDialog} onClose={handleCloseArticleDialog} fullWidth maxWidth="md">
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
                <Button onClick={handleCloseArticleDialog}>Đóng</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Quản lý Bình Luận</Typography>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant={!selectedArticleId ? 'contained' : 'outlined'} onClick={() => setSelectedArticleId(null)}>Tất cả</Button>
              {Object.entries(articleTitles).map(([id, t]) => (
                <Button key={id} variant={selectedArticleId === +id ? 'contained' : 'outlined'} onClick={() => setSelectedArticleId(+id)}>
                  #{id} {t}
                </Button>
              ))}
            </Box>
            {filteredComments.length === 0 ? (
              <Typography>Chưa có bình luận.</Typography>
            ) : (
              filteredComments.map(comment => (
                <Paper key={comment.id} sx={{ p: 2, mb: 2 }} elevation={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2">
                        {comment.display_name} bình luận ở bài “{articleTitles[comment.article_id] || '—'}”
                      </Typography>
                      <Typography variant="body2" mt={1}>{comment.content}</Typography>
                      <Typography variant="caption" color="textSecondary" mt={1} display="block">
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteComment(comment.id)}>Xóa</Button>
                  </Box>
                  {comment.replies?.length > 0 && (
                    <Box mt={2} pl={4} borderLeft="2px solid #ccc">
                      {comment.replies.map(reply => {
                        const ru = users.find(u => u.id === reply.user_id);
                        return (
                          <Paper key={reply.id} sx={{ p: 1, mb: 1 }}>
                            <Box display="flex" justifyContent="space-between">
                              <Box>
                                <Typography variant="subtitle2">
                                  {ru ? ru.display_name : 'Không rõ'} trả lời
                                </Typography>
                                <Typography variant="body2">{reply.content}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {new Date(reply.created_at).toLocaleString()}
                                </Typography>
                              </Box>
                              <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteComment(reply.id)}>Xóa</Button>
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  )}
                </Paper>
              ))
            )}
          </Box>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Quản lý Người Dùng</Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }} elevation={3}>
              <DataGrid autoHeight pageSize={5} rows={users} getRowId={r => r.id} columns={[
                { field: 'id', headerName: 'ID', width: 70 },
                { field: 'display_name', headerName: 'Tên', width: 200 },
                { field: 'email', headerName: 'Email', width: 250 },
                { field: 'role', headerName: 'Vai trò', width: 180,
                  renderCell: params => (
                    <FormControl fullWidth size="small">
                      <Select value={userRoles[params.row.id] || ''} onChange={e => setUserRoles({ ...userRoles, [params.row.id]: e.target.value })}>
                        <MenuItem value="reader">Reader</MenuItem>
                        <MenuItem value="author">Author</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  )
                },
                { field: 'actions', headerName: 'Hành động', width: 240,
                  renderCell: params => (
                    <Box>
                      <Button size="small" variant="contained" onClick={() => handleUpdateUserRole(params.row.id)} sx={{ mr: 1 }}>Cập nhật</Button>
                      <Button size="small" variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(params.row.id)}>Xóa</Button>
                    </Box>
                  )
                }
              ]} />
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
