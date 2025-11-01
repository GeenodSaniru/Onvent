-- Add category column to events table if it doesn't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Rename event_date to date in events table if event_date exists and date doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_date') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        ALTER TABLE events RENAME COLUMN event_date TO date;
    END IF;
END $$;

-- Rename max_attendees to seats in events table if max_attendees exists and seats doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'max_attendees') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'seats') THEN
        ALTER TABLE events RENAME COLUMN max_attendees TO seats;
    END IF;
END $$;

-- Add image column to events table if it doesn't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Add quantity column to tickets table if it doesn't exist
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS quantity INTEGER;

-- Add total_price column to tickets table if it doesn't exist
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS total_price DOUBLE PRECISION;

-- Add booking_date column to tickets table if it doesn't exist
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS booking_date TIMESTAMP(6);

-- Rename ticket_code to status in tickets table if ticket_code exists and status doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'ticket_code') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'status') THEN
        ALTER TABLE tickets RENAME COLUMN ticket_code TO status;
    END IF;
END $$;