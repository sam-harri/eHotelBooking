-- avg price of hotel by category
SELECT h.category, AVG(rooms.price) AS average_price
FROM rooms
JOIN hotels h ON rooms.hotel_id = h.hotel_id
GROUP BY h.category
ORDER BY h.category;

-- list of managers
SELECT e.first_name, e.last_name, h.category, h.name
FROM employees e
JOIN manages m ON e.employee_id = m.employee_id
JOIN hotels h ON e.hotel_id=h.hotel_id
JOIN hotel_chains hc ON h.chain_id=hc.chain_id
ORDER BY h.category;

-- Finds room with WIFI and
SELECT r.room_id, h.name, r.capacity, r.price, r.view
FROM rooms r
JOIN room_amenities ra ON r.room_id = ra.room_id
JOIN amenities a ON ra.amenity_id = a.amenity_id
JOIN hotels h ON r.hotel_id = h.hotel_id
WHERE a.description IN ('Wi-Fi', 'Air Conditioning')
GROUP BY r.room_id, h.name, r.capacity, r.price, r.view
HAVING COUNT(DISTINCT a.description) = 2;