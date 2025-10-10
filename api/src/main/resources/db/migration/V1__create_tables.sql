CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    bill_name VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    receiver VARCHAR(100),
    due_date DATE,
    paid BOOLEAN DEFAULT FALSE,
    category VARCHAR(100)
);
