CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    password TEXT NOT NULL,
    birthdate DATE,
    registeredAt TIMESTAMP
);
