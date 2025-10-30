-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('USER', 'ADMIN'))
);

-- Create events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMP(6) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    max_attendees INTEGER NOT NULL,
    organizer_id BIGINT NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Create tickets table
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    purchase_date TIMESTAMP(6) NOT NULL,
    ticket_code VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(255) NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED')),
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id)
);