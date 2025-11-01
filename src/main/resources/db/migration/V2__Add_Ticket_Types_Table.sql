-- Create ticket_types table
CREATE TABLE ticket_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    event_id BIGINT NOT NULL,
    CONSTRAINT fk_ticket_types_event FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Add ticket_type_id column to tickets table
ALTER TABLE tickets ADD COLUMN ticket_type_id BIGINT;
ALTER TABLE tickets ADD CONSTRAINT fk_tickets_ticket_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id);