CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_confirmed BOOLEAN DEFAULT FALSE,
    confirm_token VARCHAR(36)
);

CREATE TABLE "service" (
    id SERIAL PRIMARY KEY,
    Service VARCHAR(255),
    userId INTEGER REFERENCES "user"(id),
    title VARCHAR(255),
    price FLOAT,
    images TEXT,
    videoLink VARCHAR(255),
    description TEXT,
    previewLink VARCHAR(255),
    telegram VARCHAR(255),
    isHighlighted BOOLEAN,
    isPremium BOOLEAN,
    isVisible BOOLEAN
);