// src/pages/CategoryPage/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import Header from "@components/Header/Header";
import "./CategoryPage.scss";
import { useParams, useNavigate } from "react-router-dom";
import { getAllArticles } from "@services/articleService";

function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [dataArticles, setDataArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm điều hướng sang trang chi tiết bài viết, sử dụng slug của bài viết
  const handleNavigateDetail = (slug) => {
    navigate(`/detail/${slug}`);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAllArticles()
      .then((res) => {
        // Lọc danh sách bài viết theo category_id (ép kiểu categoryId về số)
        const filteredArticles = res.data.filter(
          (article) => article.category.id === parseInt(categoryId, 10)
        );
        setDataArticles(filteredArticles);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <>
      <Header />
      <div className="category-page-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <h2 className="category-page-title">Bài viết theo thể loại</h2>
            {dataArticles.length === 0 ? (
              <p>Không có bài viết nào thuộc thể loại này.</p>
            ) : (
              <div className="news-list">
                {dataArticles.map((item) => (
                  <div
                    key={item.id}
                    className="news-item"
                    onClick={() => handleNavigateDetail(item.slug)}
                  >
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} />
                    )}
                    <div>
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-content">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CategoryPage;
