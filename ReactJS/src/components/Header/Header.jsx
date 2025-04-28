import React, { useEffect, useState } from "react";
import "./Header.scss";
import { getUerInfo } from "@services/userService";
import Cookies from "js-cookie";
import { logout } from "@services/authService";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const token = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const navigate = useNavigate();

  const [dataUserInfo, setDataUserInfo] = useState({});

  const handleLogout = () => {
    logout({ refreshToken: refreshToken })
      .then((res) => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setDataUserInfo({});
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (token) {
      getUerInfo(token)
        .then((res) => setDataUserInfo(res.data.data))
        .catch((err) => console.log(err));
    } else {
      setDataUserInfo({});
    }
  }, [token]);

  return (
    <div className="homepage-container">
      <div className="header">
        <h2 className="homepage-title">VNExpress_Fake</h2>
        {!dataUserInfo.display_name ? (
          <div>
            <button
              className="login-button"
              onClick={() => navigate("/login")}
              style={{ marginRight: "10px" }}
            >
              Đăng Nhập
            </button>
            <button
              className="login-button"
              onClick={() => navigate("/register")}
            >
              Đăng Ký
            </button>
          </div>
        ) : (
          <div>
            <div>{dataUserInfo.display_name} </div>
            <div
              onClick={handleLogout}
              style={{ cursor: "pointer", color: "red" }}
            >
              Đăng xuất
            </div>
          </div>
        )}
      </div>

      <div className="category-bar">
        <div className="category-item" onClick={() => navigate("/")}>
          Trang Chủ
        </div>
        <div className="category-item" onClick={() => navigate("/category/1")}>
          Công nghệ
        </div>
        <div className="category-item" onClick={() => navigate("/category/2")}>
          Khoa học
        </div>
        <div className="category-item" onClick={() => navigate("/category/3")}>
          Sức khỏe
        </div>
        <div className="category-item" onClick={() => navigate("/category/4")}>
          Kinh Doanh
        </div>
        <div className="category-item" onClick={() => navigate("/category/5")}>
          Giáo dục
        </div>
        <div className="category-item" onClick={() => navigate("/category/6")}>
          Lập trình
        </div>
        <div className="category-item" onClick={() => navigate("/category/7")}>
          Vật lý
        </div>
        <div className="category-item" onClick={() => navigate("/category/8")}>
          Y học
        </div>
        <div className="category-item" onClick={() => navigate("/category/9")}>
          Tài chính
        </div>
        <div className="category-item" onClick={() => navigate("/category/10")}>
          E-learning
        </div>
      </div>
    </div>
  );
};

export default Header;
