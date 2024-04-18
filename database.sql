CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(50),
    subscription_expire_date DATE
);

CREATE TABLE "Product" (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES Shop(id),
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER,
    status VARCHAR(20),
    image VARCHAR(255),
    old_price NUMERIC(10, 2),
    weight NUMERIC(10, 2)
);

CREATE TABLE "Order" (
    id SERIAL PRIMARY KEY,
    shop_id INTEGER REFERENCES Shop(id),
    user_id INTEGER REFERENCES "User"(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL
);


CREATE TABLE "Shop" (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES "User"(id),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    support_contact VARCHAR(20),
    constructor VARCHAR(100),
    inn VARCHAR(20),
    kpp VARCHAR(20)
);
