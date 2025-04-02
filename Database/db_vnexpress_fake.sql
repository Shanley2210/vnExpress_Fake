-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th4 02, 2025 lúc 05:25 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_vnexpress_fake`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `articles`
--

CREATE TABLE `articles` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `thumbnail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `content`, `thumbnail`, `author_id`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Giới thiệu về Lập trình', 'gioi-thieu-ve-lap-trinh', 'Nội dung bài viết...', 'thumbnail1.jpg', 2, 6, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(2, 'Những tiến bộ mới nhất trong Vật lý', 'nhung-tien-bo-moi-nhat-trong-vat-ly', 'Nội dung bài viết...', 'thumbnail2.jpg', 2, 7, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(3, 'Lợi ích của Thiền đối với Sức khỏe', 'loi-ich-cua-thien-doi-voi-suc-khoe', 'Nội dung bài viết...', 'thumbnail3.jpg', 5, 8, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(4, 'Hiểu về Thị trường Tài chính', 'hieu-ve-thi-truong-tai-chinh', 'Nội dung bài viết...', 'thumbnail4.jpg', 5, 9, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(5, 'Sự phát triển của các nền tảng E-learning', 'su-phat-trien-cua-cac-nen-tang-e-learning', 'Nội dung bài viết...', 'thumbnail5.jpg', 2, 10, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(6, 'Trí tuệ Nhân tạo trong Y học', 'tri-tue-nhan-tao-trong-y-hoc', 'Nội dung bài viết...', 'thumbnail6.jpg', 2, 3, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(7, 'Khám phá Vũ trụ: Biên giới tiếp theo', 'kham-pha-vu-tru-bien-gioi-tiep-theo', 'Nội dung bài viết...', 'thumbnail7.jpg', 5, 2, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(8, 'Tương lai của Năng lượng Tái tạo', 'tuong-lai-cua-nang-luong-tai-tao', 'Nội dung bài viết...', 'thumbnail8.jpg', 2, 2, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(9, 'Tiến bộ trong Máy tính Lượng tử', 'tien-bo-trong-may-tinh-luong-tu', 'Nội dung bài viết...', 'thumbnail9.jpg', 5, 1, '2025-03-31 04:06:30', '2025-03-31 04:06:30'),
(10, 'Tác động của Mạng xã hội đến Xã hội', 'tac-dong-cua-mang-xa-hoi-den-xa-hoi', 'Nội dung bài viết...', 'thumbnail10.jpg', 2, 4, '2025-03-31 04:06:30', '2025-03-31 04:06:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `parent_id`) VALUES
(1, 'Công nghệ', NULL),
(2, 'Khoa học', NULL),
(3, 'Sức khỏe', NULL),
(4, 'Kinh doanh', NULL),
(5, 'Giáo dục', NULL),
(6, 'Lập trình', 1),
(7, 'Vật lý', 2),
(8, 'Y học', 3),
(9, 'Tài chính', 4),
(10, 'E-learning', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `user_id` int DEFAULT NULL,
  `article_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `content`, `user_id`, `article_id`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Bài viết rất hay!', 1, 1, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(2, 'Tôi thấy thông tin này rất hữu ích.', 4, 1, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(3, 'Bạn có thể giải thích thêm về chủ đề này không?', 7, 2, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(4, 'Tôi không đồng ý với một số điểm được đề cập.', 10, 3, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(5, 'Bài viết được viết rất tốt!', 1, 4, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(6, 'Đây chính là những gì tôi đang tìm kiếm.', 4, 5, NULL, '2025-03-31 04:06:54', '2025-03-31 04:06:54'),
(7, 'Quan điểm thú vị.', 7, 6, 1, '2025-03-31 04:06:54', '2025-03-31 14:54:32'),
(8, 'Tôi có một câu hỏi liên quan đến vấn đề này.', 10, 7, 1, '2025-03-31 04:06:54', '2025-03-31 14:54:27'),
(9, 'Thông tin này giúp ích rất nhiều cho tôi.', 1, 8, 1, '2025-03-31 04:06:54', '2025-03-31 14:54:29'),
(10, 'Cảm ơn vì đã chia sẻ!', 4, 9, 9, '2025-03-31 04:06:54', '2025-03-31 14:54:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `revoked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `revoked`) VALUES
(15, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDM0MjgxOTEsImV4cCI6MTc0NDAzMjk5MX0.FqSE0N-EOH1fBV_k26MXupPk1d0y0bZrAPP2_hdqZJQ', '2025-04-07 13:36:31', 1),
(16, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDM0MzAxMDQsImV4cCI6MTc0NDAzNDkwNH0.kr_oQp_uQfi0W4P_i6u5fhmp2D6mB6sCZt42QhnGuhU', '2025-04-07 14:08:24', 0),
(17, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDM0MzI5NTYsImV4cCI6MTc0NDAzNzc1Nn0.Ag0ItnvzxTQcDeQzHe-HzTQgVHYjWatzJgMmtIYEu-g', '2025-04-07 14:55:56', 0),
(18, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDM0MzM5ODYsImV4cCI6MTc0NDAzODc4Nn0.20M2H_3wopbApSrOoQw9vWdkojF2kFkvVVtYTqZ88Ag', '2025-04-07 15:13:06', 0),
(19, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDM1NzE0NTksImV4cCI6MTc0NDE3NjI1OX0.YJOtm3JJBpl3hkpb9FXrv8cbuMyBheicQi1dDJNR_xM', '2025-04-09 05:24:19', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('reader','author','admin') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT NULL,
  `verification_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_password_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `google_id`, `email`, `password`, `display_name`, `role`, `is_verified`, `verification_token`, `reset_password_token`, `reset_token_expiry`, `created_at`, `updated_at`) VALUES
(1, 'google_1', 'nguyenvana@example.com', 'hashed_password_1', 'Nguyễn Văn A', 'reader', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(2, 'google_2', 'tranthib@example.com', 'hashed_password_2', 'Trần Thị B', 'author', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(3, 'google_3', 'lequoc@example.com', 'hashed_password_3', 'Lê Quốc C', 'admin', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(4, 'google_4', 'phamthingoc@example.com', 'hashed_password_4', 'Phạm Thị Ngọc D', 'reader', 0, 'token_4', NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(5, 'google_5', 'dangvanh@example.com', 'hashed_password_5', 'Đặng Văn H', 'author', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(6, 'google_6', 'hoangthian@example.com', 'hashed_password_6', 'Hoàng Thị An', 'admin', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(7, 'google_7', 'buituan@example.com', 'hashed_password_7', 'Bùi Tuấn K', 'reader', 0, 'token_7', NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(8, 'google_8', 'doanminh@example.com', 'hashed_password_8', 'Đoàn Minh L', 'author', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(9, 'google_9', 'ngothithu@example.com', 'hashed_password_9', 'Ngô Thị Thu M', 'admin', 1, NULL, NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(10, 'google_10', 'truongvan@example.com', 'hashed_password_10', 'Trương Văn N', 'reader', 0, 'token_10', NULL, NULL, '2025-03-31 04:05:38', '2025-03-31 04:05:38'),
(11, '110682636650495845528', 'nguyenhieushanley2210@gmail.com', NULL, 'Nguyễn Hiếu [Shanley]', 'reader', 1, NULL, NULL, NULL, '2025-03-31 05:38:17', '2025-03-31 05:38:17'),
(12, NULL, 'test@example.com', '$2b$10$KhB9ldxyk.KbG.bEZi./tuW6xwcXEBL9nmLjCaRJrquMcUjxC19DC', 'Test User', 'reader', 0, '3ed29f6a3b11b3076e9f0c959984e42d3e4ef947e100cd497dc54b87153900dc', '79a32b0469f4831785c66386bf677387767574f3ba154a6e732ac19427531c1b', '2025-03-31 13:02:45', '2025-03-31 08:50:03', '2025-03-31 12:02:45'),
(13, NULL, 'nguyenhieushanley.hoyo@gmail.com', '$2b$10$AWpl1l6X5E.qs/WxZpEnb.ByPRHyJurmUSiwVbbUlxosTRR1D/mz6', 'Test User', 'reader', 0, '1e17c457f1362c64d6267d1adbd71895baea2d19fbebf9b9e4d360a54198c40d', NULL, NULL, '2025-03-31 08:50:46', '2025-03-31 12:31:48'),
(14, NULL, 'test1@example.com', '$2b$10$4u9QhqfGvx7I9KSK/2Frl.eB8grISEwdDioFchd7cxdcuVtyYdVwO', 'Test User', 'reader', 1, NULL, 'a7938dba3973ab211de81f152a4bf92eaaad4759d8ba41e87077f6bbf49c53de', '2025-03-31 13:02:28', '2025-03-31 08:57:50', '2025-03-31 12:02:28');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `article_id` (`article_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`);

--
-- Các ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
