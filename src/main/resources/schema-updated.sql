-- Updated Schema for Onvent Application
-- Matches current entity definitions
-- Last Updated: October 16, 2025

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    max_attendees INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    organizer_id BIGINT NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tickets table (Updated to match Ticket.java entity)
CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    ticket_code VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT chk_ticket_status CHECK (status IN ('ACTIVE', 'CANCELLED'))
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_event_status ON tickets(event_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_status ON tickets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- Comments for documentation
COMMENT ON TABLE tickets IS 'Stores event ticket bookings with status tracking';
COMMENT ON COLUMN tickets.ticket_code IS 'Unique ticket identifier in format TKT-XXXXXXXX';
COMMENT ON COLUMN tickets.status IS 'Ticket status: ACTIVE or CANCELLED';
COMMENT ON COLUMN tickets.purchase_date IS 'Timestamp when the ticket was purchased';

COMMENT ON TABLE events IS 'Stores event information and capacity';
COMMENT ON COLUMN events.max_attendees IS 'Maximum number of attendees allowed';
COMMENT ON COLUMN events.event_date IS 'Date and time when the event takes place';

COMMENT ON TABLE users IS 'User accounts for event organizers and attendees';