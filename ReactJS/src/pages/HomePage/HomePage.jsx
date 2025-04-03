import { useEffect, useState } from "react";
import "./HomePage.scss";
import axios from "../clients/axiosClient";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/news")
            .then((res) => setNews(res.data))
            .catch((err) => console.log("Lỗi khi tải tin tức:", err));
    }, []);

    return (
        <div className="homepage-container">
            <h2 className="homepage-title">Trang Tin Tức</h2>
            <div className="news-list">
                {news.map((item) => (
                    <div key={item.id} className="news-item">
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-content">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
