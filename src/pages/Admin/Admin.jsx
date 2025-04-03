import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Cấu hình base URL cho axios
axios.defaults.baseURL = "http://localhost:3000";

function Admin() {
  // State quản lý dữ liệu bài viết, bình luận, người dùng và tiêu đề bài viết theo ID
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [articleTitles, setArticleTitles] = useState({});

  // State cho form thêm bài viết
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  console.log({ title, slug, content, thumbnail, category });

  // Hàm lấy headers xác thực từ token trong cookies
  const getAuthHeaders = () => {
    const token = Cookies.get("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  // Gọi API lấy dữ liệu khi component mount
  useEffect(() => {
    fetchArticles();
    fetchComments();
    fetchUsers();
  }, []);

  // Hàm lấy danh sách bài viết và lưu tiêu đề theo ID
  const fetchArticles = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await axios.get("/api/admin/articles", { headers });
      setArticles(res.data.articles || []);
      const titles = {};
      res.data.articles.forEach((article) => {
        titles[article.id] = article.title;
      });
      setArticleTitles(titles);
    } catch (error) {
      toast.error("Lỗi khi lấy bài viết!");
    }
  };

  // Hàm lấy danh sách bình luận
  const fetchComments = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await axios.get("/api/admin/comments", { headers });
      setComments(res.data.comments || []);
    } catch (error) {
      toast.error("Lỗi khi lấy bình luận!");
    }
  };

  // Hàm lấy danh sách người dùng từ API (bảng users)
  const fetchUsers = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      // Sử dụng endpoint /api/users để lấy danh sách người dùng
      const res = await axios.get("/api/users", { headers });
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng!");
    }
  };

  // Hàm xử lý tạo bài viết mới
  const handleAddArticle = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;
  
    // Kiểm tra dữ liệu bắt buộc
    if (!title || !slug || !content || !category) {
      toast.error("Vui lòng điền đầy đủ tiêu đề, slug, nội dung và danh mục!");
      return;
    }
  
    // Kiểm tra và chuyển category thành số nếu cần
    const categoryNumber = parseInt(category, 10);
    if (isNaN(categoryNumber)) {
      toast.error("Danh mục phải là một số hợp lệ!");
      return;
    }
  
    const payload = {
      title,
      slug,
      content,
      thumbnail,
      category: categoryNumber, // Đảm bảo là số
    };
  
    // In ra payload để kiểm tra
    console.log("Payload gửi lên:", payload);
  
    try {
      const res = await axios.post("/api/articles", payload, { headers });
      toast.success("Bài viết mới đã được tạo!");
      // Reset form sau khi tạo thành công
      setTitle("");
      setSlug("");
      setContent("");
      setThumbnail("");
      setCategory("");
      // Cập nhật lại danh sách bài viết
      fetchArticles();
    } catch (error) {
      console.error("Error response:", error.response);
      // Kiểm tra thông điệp lỗi từ backend và hiển thị cụ thể hơn
      if (error.response && error.response.data && error.response.data.errMessage) {
        toast.error(error.response.data.errMessage);
      } else {
        toast.error("Có lỗi xảy ra khi tạo bài viết!");
      }
    }
  };  
  
  // Hàm xử lý xóa bài viết
  const handleDeleteArticle = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/articles/${id}`, { headers });
      setArticles(articles.filter((article) => article.id !== id));
      toast.success("Bài viết đã bị xóa!");
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết!");
    }
  };

  // Hàm xử lý xóa bình luận
  const handleDeleteComment = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      await axios.delete(`/api/comments/${id}`, { headers });
      setComments(comments.filter((comment) => comment.id !== id));
      toast.success("Bình luận đã bị xóa!");
    } catch (error) {
      toast.error("Lỗi khi xóa bình luận!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Form thêm bài viết */}
      <h2>Thêm Bài Viết Mới</h2>
      <form onSubmit={handleAddArticle} style={{ marginBottom: "40px" }}>
        <TextField
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Slug (URL)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Thumbnail (URL)"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Danh mục"
          >
            <MenuItem value="1">Công nghệ</MenuItem>
            <MenuItem value="2">Sức khỏe</MenuItem>
            <MenuItem value="3">Kinh doanh</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Thêm Bài Viết
        </Button>
      </form>

      {/* Quản lý bài viết */}
      <h2>Quản lý Bài Viết</h2>
      <div style={{ height: 400, marginBottom: "40px" }}>
        <DataGrid
          rows={articles}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            { field: "title", headerName: "Tiêu đề", width: 250 },
            { field: "slug", headerName: "Slug", width: 200 },
            { field: "created_at", headerName: "Ngày tạo", width: 180 },
            {
              field: "delete",
              headerName: "Xóa",
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
              ),
            },
          ]}
          pageSize={5}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Quản lý bình luận */}
      <h2>Quản lý Bình luận</h2>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={comments}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            { field: "content", headerName: "Nội dung", width: 300 },
            { field: "user_id", headerName: "ID người bình luận", width: 300 },
            { field: "article_id", headerName: "ID bài viết", width: 300 },
            { field: "created_at", headerName: "Ngày tạo", width: 180 },
            {
              field: "delete",
              headerName: "Xóa",
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
              ),
            },
          ]}
          pageSize={5}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
}

export default Admin;
