CREATE OR REPLACE VIEW available_rooms_per_area AS
SELECT h.area, COUNT(*) AS available_rooms
FROM rooms r
LEFT JOIN hotels h ON r.hotel_id = h.hotel_id
LEFT JOIN bookings b ON r.room_id = b.room_id AND current_date BETWEEN b.start_date AND b.end_date
LEFT JOIN rentings re ON r.room_id = re.room_id AND current_date BETWEEN re.start_date AND re.end_date
WHERE b.booking_id IS NULL AND re.renting_id IS NULL
GROUP BY h.area;

CREATE OR REPLACE VIEW hotel_room_capacity AS
SELECT h.hotel_id, h.name AS hotel_name, SUM(r.capacity) AS total_capacity
FROM rooms r
JOIN hotels h ON r.hotel_id = h.hotel_id
GROUP BY h.hotel_id;
