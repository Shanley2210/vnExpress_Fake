
// CommentsTab.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Typography,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

// Cấu hình base URL cho axios
axios.defaults.baseURL = 'https://vnexpress-fake.onrender.com/';

export default function CommentsTab() {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [articleTitles, setArticleTitles] = useState({});
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const getAuthHeaders = () => {
    const token = Cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const [cRes, aRes, uRes] = await Promise.all([
        axios.get('/api/admin/comments', { headers }),
        axios.get('/api/admin/articles?page=1&limit=100', { headers }),
        axios.get('/api/users?page=1&limit=100', { headers })
      ]);
      setComments(cRes.data.comments || []);
      const mapA = {};
      (aRes.data.articles || []).forEach(a => mapA[a.id] = a.title);
      setArticleTitles(mapA);
      setUsers(uRes.data.users || []);
    } catch {
      toast.error('Lỗi khi tải bình luận');
    }
  };

  const deleteComment = async (id) => {
    const headers = getAuthHeaders();
    if (!headers || !window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      // Xóa bình luận từ backend
      await axios.delete(`/api/comments/${id}`, { headers });
  
      // Cập nhật lại danh sách bình luận trong state (loại bỏ bình luận bị xóa)
      setComments(prevComments => prevComments.filter(comment => comment.id !== id));
      
      // Cập nhật lại danh sách trả lời (nếu có)
      setComments(prevComments => prevComments.map(comment => ({
        ...comment,
        replies: comment.replies.filter(reply => reply.id !== id),
      })));
  
      toast.success('Đã xóa bình luận');
    } catch {
      toast.error('Xóa bình luận thất bại');
    }
  };
  

  // Lọc bình luận cấp cha
  const topComments = comments.filter(c => c.parent_id === null);

  // Nối tên người dùng và trả lời
  const enriched = topComments.map(c => ({
    ...c,
    userName: users.find(u => u.id === c.user_id)?.display_name || 'Không rõ',
    replies: c.replies?.map(r => ({
      ...r,
      userName: users.find(u => u.id === r.user_id)?.display_name || 'Không rõ'
    })) || []
  }));

  // Lọc theo bài viết (nếu có)
  const filtered = selectedArticleId
    ? enriched.filter(c => c.article_id === selectedArticleId)
    : enriched;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Quản lý Bình Luận</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant={!selectedArticleId ? 'contained' : 'outlined'}
          onClick={() => setSelectedArticleId(null)}
        >
          Tất cả
        </Button>
        {Object.entries(articleTitles).map(([id, t]) => (
          <Button
            key={id}
            variant={selectedArticleId === +id ? 'contained' : 'outlined'}
            onClick={() => setSelectedArticleId(+id)}
          >
            #{id} {t}
          </Button>
        ))}
      </Box>

      {filtered.length === 0 ? (
        <Typography>Chưa có bình luận.</Typography>
      ) : (
        filtered.map(comment => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2 }} elevation={1}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2">
                  {comment.userName} bình luận ở bài “{articleTitles[comment.article_id] || '—'}”
                </Typography>
                <Typography variant="body2" mt={1}>{comment.content}</Typography>
                <Typography variant="caption" color="textSecondary" mt={1} display="block">
                  {new Date(comment.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => deleteComment(comment.id)}>
                Xóa
              </Button>
            </Box>

            {/* Hiển thị replies */}
            {comment.replies.length > 0 && (
              <Box mt={2} pl={4} borderLeft="2px solid #ccc">
                {comment.replies.map(reply => (
                  <Paper key={reply.id} sx={{ p: 1, mb: 1 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2">
                          {reply.userName} trả lời
                        </Typography>
                        <Typography variant="body2">{reply.content}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(reply.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => deleteComment(reply.id)}>
                        Xóa
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}

