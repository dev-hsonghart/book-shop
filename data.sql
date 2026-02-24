INSERT INTO likes (userId, likedProductId) VALUES (?,?)

SELECT EXISTS (SELECT * FROM likes WHERE userId = 8 AND likedProductId = 3) AS liked

SELECT count(*) FROM likes WHERE likedProductId = books.id AS likes

INSERT INTO cartItems (bookId, count, userId) VALUES (2,2,1);
INSERT INTO cartItems (bookId, count, userId) VALUES (3,1,1);
INSERT INTO cartItems (bookId, count, userId) VALUES (1,1,1);
INSERT INTO cartItems (bookId, count, userId) VALUES (1,2,3);
INSERT INTO cartItems (bookId, count, userId) VALUES (2,2,3);

SELECT cartItems.*, books.title,books.summary,books.price 
FROM cartItems LEFT JOIN books 
ON cartItems.bookId = books.id;

SELECT * FROM cartItems WHERE cartItemId IN (?)