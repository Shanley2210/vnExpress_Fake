import React, { useEffect, useState } from 'react';
import './ArticleDetail.scss';
import Header from '@components/Header/Header';
import { getArticleBySlug } from '@services/articleService';
import { useParams } from 'react-router-dom';
import { getCommentsBySlug, addComment } from '@services/commentService';
import CommentItem from '@components/CommentItem/CommentItem';
import Cookies from 'js-cookie';

const ArticleDetail = () => {
    const [dataDetail, setDataDetail] = useState({});
    const [dataComment, setDataComment] = useState([]);

    const [newComment, setNewComment] = useState({
        content: '',
        parent_id: null
    });

    const { slug } = useParams();
    const token = Cookies.get('accessToken');

    const handleSubmitComment = async () => {
        try {
            await addComment(slug, token, newComment);
            setNewComment({ content: '', parent_id: null }); // Reset form
            const res = await getCommentsBySlug(slug); // Refetch to get updated tree
            setDataComment(res.data.data.comments || []); // Ensure we get the comments array
        } catch (error) {
            console.error('Lỗi khi gửi bình luận:', error);
        }
    };

    const handleReply = (commentId) => {
        setNewComment((prev) => ({
            ...prev,
            parent_id: commentId
        }));
        document.querySelector('.comment-input')?.focus(); // Safe focus
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articleRes = await getArticleBySlug(slug);
                setDataDetail(articleRes.data || {});
                const commentRes = await getCommentsBySlug(slug);
                setDataComment(commentRes.data.data.comments || []); // Ensure we get comments
            } catch (err) {
                console.error('Lỗi khi fetch dữ liệu:', err);
            }
        };
        fetchData();
    }, [slug]);

    console.log('Current comments data:', dataComment);

    return (
        <div className='article-detail'>
            <Header />

            <main className='container main-content'>
                <article className='article-main'>
                    <div className='breadcrumb'>
                        <a href='/'>Trang chủ</a>{' '}
                        <a href='/category'>{dataDetail?.category?.name}</a>
                    </div>
                    <h1 className='article-title'>{dataDetail?.title}</h1>
                    <div className='article-meta'>
                        <span className='publish-date'>
                            {dataDetail?.created_at}
                        </span>
                        <span className='author'>
                            {dataDetail?.author?.display_name}
                        </span>
                    </div>

                    <div className='article-body'>
                        <img src={dataDetail?.thumbnail} alt='' />
                        <p
                            dangerouslySetInnerHTML={{
                                __html: dataDetail?.content || ''
                            }}
                        />
                    </div>
                </article>
            </main>

            {/* Comments Section */}
            <section className='comments-section container'>
                <h3 className='comments-title'>
                    Bình luận ({dataComment?.length || 0})
                </h3>
                <div className='comment-box'>
                    {newComment.parent_id && (
                        <div className='reply-notice'>
                            Đang trả lời bình luận #{newComment.parent_id}
                            <button
                                onClick={() =>
                                    setNewComment((prev) => ({
                                        ...prev,
                                        parent_id: null
                                    }))
                                }
                                className='cancel-reply'
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                    <textarea
                        placeholder='Viết bình luận của bạn...'
                        className='comment-input'
                        value={newComment.content}
                        onChange={(e) =>
                            setNewComment((prev) => ({
                                ...prev,
                                content: e.target.value
                            }))
                        }
                    />
                    <button
                        className='comment-submit'
                        onClick={handleSubmitComment}
                    >
                        Gửi bình luận
                    </button>
                </div>

                {/* Comment List */}
                <div className='comment-list'>
                    {Array.isArray(dataComment) &&
                        dataComment.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                level={0}
                                onReply={handleReply}
                            />
                        ))}
                </div>
            </section>

            <footer className='footer'>
                <div className='container'>
                    <p>© 2024 VnExpress. Bản quyền thuộc về VnExpress.</p>
                    <div className='footer-links'>
                        <a href='/about'>Giới thiệu</a>
                        <a href='/contact'>Liên hệ</a>
                        <a href='/terms'>Điều khoản</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ArticleDetail;
