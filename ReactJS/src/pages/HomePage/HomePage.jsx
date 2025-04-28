import Header from '@components/Header/Header';
import './HomePage.scss';
import { useEffect, useState } from 'react';
import { getAllArticles } from '@services/articleService';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [dataArticles, setDataArticles] = useState([]);

    const navigate = useNavigate();

    const handleNavigateDetail = (slug) => {
        navigate(`/detail/${slug}`);
    };

    useEffect(() => {
        getAllArticles()
            .then((res) => setDataArticles(res.data))
            .catch((err) => console.log(err));
    }, []);

    console.log('dataArticles', dataArticles);

    return (
        <>
            <Header />
            <div className='homepage-container'>
                <h2 className='homepage-title'>Tin Tức</h2>
                <div className='news-list'>
                    {dataArticles.map((item) => (
                        <div
                            key={item.id}
                            className='news-item'
                            onClick={() => handleNavigateDetail(item.slug)}
                        >
                            {item.thumbnail && (
                                <img src={item.thumbnail} alt={item.title} />
                            )}
                            <div>
                                <h3 className='news-title'>{item.title}</h3>
                                <p className='news-content'>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HomePage;
