CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_hotels_chain_id ON hotels(chain_id);
CREATE INDEX idx_bookings_date_room ON bookings(start_date, end_date, room_id);
CREATE INDEX idx_rentings_room_id ON rentings(room_id, start_date, end_date);