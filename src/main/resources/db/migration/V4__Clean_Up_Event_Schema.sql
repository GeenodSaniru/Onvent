-- Clean up events table schema to match the current entity structure
-- This migration ensures that we have a consistent schema that works with our current code

-- First, check if we have both old and new columns, and consolidate data
DO $$
BEGIN
    -- Handle date fields consolidation
    -- If we have both event_date and date columns, ensure data is synced
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_date') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        -- Update any rows where date is null but event_date has data
        UPDATE events SET date = event_date WHERE date IS NULL AND event_date IS NOT NULL;
        -- Update any rows where event_date is null but date has data
        UPDATE events SET event_date = date WHERE event_date IS NULL AND date IS NOT NULL;
    END IF;
    
    -- Handle seats fields consolidation
    -- If we have both max_attendees and seats columns, ensure data is synced
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'max_attendees') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'seats') THEN
        -- Update any rows where seats is null but max_attendees has data
        UPDATE events SET seats = max_attendees WHERE seats IS NULL AND max_attendees IS NOT NULL;
        -- Update any rows where max_attendees is null but seats has data
        UPDATE events SET max_attendees = seats WHERE max_attendees IS NULL AND seats IS NOT NULL;
    END IF;
END $$;

-- Now drop the old columns if they exist and we have the new ones
-- But only drop if we have the new columns to avoid data loss
DO $$
BEGIN
    -- Only drop event_date if we have the date column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        ALTER TABLE events DROP COLUMN IF EXISTS event_date;
    END IF;
    
    -- Only drop max_attendees if we have the seats column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'seats') THEN
        ALTER TABLE events DROP COLUMN IF EXISTS max_attendees;
    END IF;
END $$;

-- Ensure we have all the required columns with correct names
ALTER TABLE events ADD COLUMN IF NOT EXISTS date TIMESTAMP(6);
ALTER TABLE events ADD COLUMN IF NOT EXISTS seats INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Set NOT NULL constraints where needed (but only if column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date') THEN
        ALTER TABLE events ALTER COLUMN date SET NOT NULL;
    END IF;
END $$;