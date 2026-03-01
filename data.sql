// 공용
// !!! DB 초기화

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE 테이블명;
SET FOREIGN_KEY_CHECKS = 1;


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

"SELECT * FROM cartItems WHERE cartItemId IN (?)"

// delivery insert
"INSERT INTO delivery VALUES (NULL, ?, ?, ?)";

// orders insert
"INSERT INTO orders VALUES (NULL, ?, ?, ?, NULL, ?, ?)";
"INSERT INTO orders VALUES (NULL, 1, 60000, 5, DEFAULT, (SELECT books.title FROM books WHERE books.id = 1), 1)";

// orderedItems insert
"INSERT INTO orderedItems (orderedId, bookId, count) VALUES ?"

// cartItems delete
"DELETE FROM cartItems WHERE id IN (?)";

// getOrder SELECT
"SELECT orders.*, delivery.address,delivery.receiver,delivery.contact 
FROM orders LEFT JOIN delivery
ON orders.deliverId = delivery.id
WHERE userId = 1;"