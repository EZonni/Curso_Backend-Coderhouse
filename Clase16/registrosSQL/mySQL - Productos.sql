CREATE DATABASE clase16;
USE clase16;

CREATE TABLE productos (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    img VARCHAR(500) NOT NULL
);
    
INSERT INTO productos (title, price, img) VALUES ('Laptop', '1450', 'https://cdn0.iconfinder.com/data/icons/electronics-line-style/64/Laptop-512.png');
INSERT INTO productos (title, price, img) VALUES ('Joystick', '147', 'https://cdn0.iconfinder.com/data/icons/electronics-line-style/64/Joystick-512.png');

SELECT * FROM productos;