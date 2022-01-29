USE finalProject;

CREATE TABLE products(
    id VARCHAR(36) PRIMARY KEY, 
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(150) NOT NULL,
    value FLOAT NOT NULL
);

INSERT INTO products(id, name, description, value) VALUES 
('1cf641f0-19a1-4699-94f6-5cc45c061ca8', 'Mochila', 'Mochila Black com compartimento para notebook', 200),
('9dc5bbbd-39f2-49ec-a8c2-7294b31e9385', 'Notebook', 'Core i9, 16 Gb DDR5', 3999.99),
('aee94fdd-fa8b-46c7-a6ad-c01e0f1c567e', 'Caneta', 'Bic Vermelha', 1.85),
('e05a9364-8158-11ec-a8a3-0242ac120002', 'Caneta', 'Bic Azul', 1.90),
('eb706544-8158-11ec-a8a3-0242ac120002', 'Caneta', 'Bic Preta', 3.20);

CREATE TABLE orders(
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36),
    product_id VARCHAR(36),
    amount INT(6),
    -- CONSTRAINT FK_ClientOrder FOREIGN KEY (client_id) REFERENCES clients(id),
    CONSTRAINT FK_ProductOrder FOREIGN KEY (product_id) REFERENCES products(id)
);
