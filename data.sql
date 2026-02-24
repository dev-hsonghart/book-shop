INSERT INTO likes (userId, likedProductId) VALUES (?,?)

SELECT EXISTS (SELECT * FROM likes WHERE userId = 8 AND likedProductId = 3) AS liked

SELECT count(*) FROM likes WHERE likedProductId = books.id AS likes