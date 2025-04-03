import styles from './CommentItem.module.scss';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
};

const CommentItem = ({ comment, level, onReply }) => {
    console.log(
        'Rendering comment:',
        comment.id,
        'at level:',
        level,
        'with replies:',
        comment.replies
    );
    const indentStyle = {
        marginLeft: level * 40 + 'px',
        borderLeft: level > 0 ? '2px solid #ddd' : 'none',
        paddingLeft: level > 0 ? '15px' : '0',
        position: 'relative'
    };

    return (
        <div
            className={`${styles['comment-item']} ${
                level > 0 ? styles['reply-item'] : ''
            }`}
            style={indentStyle}
        >
            <div className={styles['comment-header']}>
                <span className={styles['comment-author']}>
                    {comment.user.display_name}
                </span>
                <span className={styles['comment-time']}>
                    {formatDate(comment.created_at)}
                </span>
                <button
                    className={`${styles['reply-button']} reply-button`}
                    onClick={() => onReply(comment.id)}
                >
                    Trả lời
                </button>
            </div>
            <div className={styles['comment-content']}>{comment.content}</div>
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className={styles['replies-container']}>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            level={level + 1}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
