
-- update number of hotels in a chain hotel addition
CREATE OR REPLACE FUNCTION update_num_hotels_add()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel_chains
    SET num_hotels = num_hotels + 1
    WHERE chain_id = NEW.chain_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_num_hotels_add
AFTER INSERT ON hotels
FOR EACH ROW
EXECUTE FUNCTION update_num_hotels_add();

-- update number of hotels in a chain hotel deletion
CREATE OR REPLACE FUNCTION update_num_hotels_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotel_chains
    SET num_hotels = num_hotels - 1
    WHERE chain_id = OLD.chain_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_num_hotels_delete
AFTER DELETE ON hotels
FOR EACH ROW
EXECUTE FUNCTION update_num_hotels_delete();

-- update number of rooms in a hotel room addition
CREATE OR REPLACE FUNCTION update_num_rooms_add()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotels
    SET num_rooms = num_rooms + 1
    WHERE hotel_id = NEW.hotel_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_num_rooms_add
AFTER INSERT ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_num_rooms_add();

-- update number of rooms in a hotel room deletion
CREATE OR REPLACE FUNCTION update_num_rooms_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hotels
    SET num_rooms = num_rooms - 1
    WHERE hotel_id = OLD.hotel_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_update_num_rooms_delete
AFTER DELETE ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_num_rooms_delete();

-- delete email for chain
CREATE OR REPLACE FUNCTION delete_email_addresses_for_chain()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM email_addresses WHERE origin = OLD.chain_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_email_addresses_for_chain
AFTER DELETE ON hotel_chains
FOR EACH ROW
EXECUTE FUNCTION delete_email_addresses_for_chain();

-- delete email for hotel
CREATE OR REPLACE FUNCTION delete_email_addresses_for_hotel()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM email_addresses WHERE origin = OLD.hotel_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_email_addresses_for_hotel
AFTER DELETE ON hotels
FOR EACH ROW
EXECUTE FUNCTION delete_email_addresses_for_hotel();

--delete phone numbers for chain
CREATE OR REPLACE FUNCTION delete_phone_numbers_for_chain()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM phone_numbers WHERE origin = OLD.chain_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_phone_numbers_for_chain
AFTER DELETE ON hotel_chains
FOR EACH ROW
EXECUTE FUNCTION delete_phone_numbers_for_chain();

-- delete phone numbers for hotel
CREATE OR REPLACE FUNCTION delete_phone_numbers_for_hotel()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM phone_numbers WHERE origin = OLD.hotel_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_phone_numbers_for_hotel
AFTER DELETE ON hotels
FOR EACH ROW
EXECUTE FUNCTION delete_phone_numbers_for_hotel();
