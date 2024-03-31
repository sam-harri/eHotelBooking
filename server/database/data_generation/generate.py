import json
import uuid
import random
import datetime
from psycopg2.pool import SimpleConnectionPool

conn_pool = SimpleConnectionPool(
            1, 20,
            user="postgres",
            password="",
            host="localhost",
            port="5432",
            database="")
conn = conn_pool.getconn()
cursor = conn.cursor()

def generate_data() -> None:
    def generate_uuid():
        """Generate a UUID4 string."""
        return str(uuid.uuid4())

    def generate_ssn():
        """Generate a mock SSN (Social Security Number)."""
        return f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(100, 999)}"

    def generate_phone():
        """Generate a mock phone number."""
        return f"{random.randint(200, 999)}-{random.randint(200, 999)}-{random.randint(1000, 9999)}"

    def generate_email(first_name, last_name):
        """Generate a mock email address."""
        domains = ["example.com", "mail.com", "inbox.com"]
        return f"{first_name.lower()}.{last_name.lower()}@{random.choice(domains)}".replace(" ", "")
    
    areas = ["Montreal", "Ottawa", "Toronto"]
    categories = [1, 2, 3, 4, 5]
    num_rooms_choices = [3, 4, 5]
    views = ["sea", "mountain", "city", "garden"]
    first_names = ["Alex", "Jamie", "Chris", "Pat", "Taylor"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones"]

    hotel_chains = [
        {"chain_id": generate_uuid(), "name": f"Hotel Chain {i+1}", "address": f"{i+1} Chain St", "num_hotels": 8}
        for i in range(5)
    ]

    hotels = []
    for chain in hotel_chains:
        for i in range(8):
            area = random.choice(areas)
            category = random.choice(categories)
            num_rooms = random.choice(num_rooms_choices)
            hotels.append({
                "hotel_id": generate_uuid(),
                "chain_id": chain["chain_id"],
                "name": f"Hotel {i+1} of {chain['name']}",
                "address": f"{i+1} Hotel Rd",
                "category": category,
                "num_rooms": num_rooms,
                "area": area
            })

    rooms = []
    for hotel in hotels:
        for _ in range(hotel["num_rooms"]):
            rooms.append({
                "room_id": generate_uuid(),
                "hotel_id": hotel["hotel_id"],
                "capacity": random.randint(1, 4),
                "price": round(random.uniform(100.0, 500.0), 2),
                "view": random.choice(views),
                "extendable": random.choice([True, False])
            })

    employees = []
    manages = []
    for hotel in hotels:
        for i in range(5):
            employee_id = generate_uuid()
            employees.append({
                "employee_id": employee_id,
                "hotel_id": hotel["hotel_id"],
                "ssn": generate_ssn(),
                "first_name": random.choice(first_names),
                "last_name": random.choice(last_names),
                "address": f"{random.randint(1, 9999)} Main St"
            })
            if i == 0:
                manages.append({
                    "hotel_id": hotel["hotel_id"],
                    "employee_id": employee_id
                })

    phones = []
    emails = []

    for entity in hotel_chains + hotels:
        for _ in range(3):
            phones.append({"phone_id": generate_uuid(), "origin": entity["chain_id"] if entity in hotel_chains else entity["hotel_id"], "phone": generate_phone()})
            emails.append({"email_id": generate_uuid(), "origin": entity["chain_id"] if entity in hotel_chains else entity["hotel_id"], "email": generate_email(entity["name"], "Entity")})

    customers = []
    for i in range(100):
        customers.append({
            "customer_id": generate_uuid(),
            "ssn": generate_ssn(),
            "first_name": random.choice(first_names),
            "last_name": random.choice(last_names),
            "address": f"{random.randint(1, 9999)} Customer Rd",
            "registration": datetime.date(2024, random.randint(1,2), random.randint(1,29)).isoformat(),
        })

    bookings = []
    for room in rooms:
        cust = random.choice(customers)
        start_date = datetime.date(2024, random.randint(2,3), random.randint(1,28))
        end_date = start_date + datetime.timedelta(days=1)
        date_booked = start_date - datetime.timedelta(days=2)
        bookings.append({
            "booking_id": generate_uuid(),
            "customer_id": cust["customer_id"],
            "room_id": room["room_id"],
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "date_booked": date_booked.isoformat(),
        })

    room_to_hotel = {room["room_id"]: room["hotel_id"] for room in rooms}

    rentings = []
    for booking in bookings:
        cust = random.choice(customers)
        hotel_id = room_to_hotel[booking["room_id"]]
        hotel_employees = [emp for emp in employees if emp["hotel_id"] == hotel_id]
        employee = random.choice(hotel_employees) if hotel_employees else None
        
        if employee:
            rentings.append({
                "renting_id": generate_uuid(),
                "customer_id": cust["customer_id"],
                "employee_id": employee["employee_id"],
                "room_id": booking["room_id"],
                "start_date": booking["start_date"],
                "end_date": booking["end_date"],
            })

    amenities = [
        {"amenity_id": generate_uuid(), "description": "Wi-Fi"},
        {"amenity_id": generate_uuid(), "description": "Air Conditioning"},
        {"amenity_id": generate_uuid(), "description": "Swimming Pool"},
        {"amenity_id": generate_uuid(), "description": "Room Service"},
        {"amenity_id": generate_uuid(), "description": "Gym Access"}
    ]

    defects = [
        {"defect_id": generate_uuid(), "description": "Leaky Faucet"},
        {"defect_id": generate_uuid(), "description": "Non-Working TV"},
        {"defect_id": generate_uuid(), "description": "Stained Carpet"},
        {"defect_id": generate_uuid(), "description": "Broken Window"},
        {"defect_id": generate_uuid(), "description": "Malfunctioning AC"}
    ]

    room_amenities = []
    room_defects = []

    for room in rooms:
        for amenity in amenities:
            if random.choice([True, False, False, False]):
                room_amenities.append({
                    "room_id": room["room_id"],
                    "amenity_id": amenity["amenity_id"]
                })
        
        for defect in defects:
            if random.choice([True, False, False, False]):
                room_defects.append({
                    "room_id": room["room_id"],
                    "defect_id": defect["defect_id"]
                })

    data_files = {
        "hotel_chains.json": hotel_chains,
        "hotels.json": hotels,
        "rooms.json": rooms,
        "employees.json": employees,
        "manages.json": manages,
        "phones.json": phones,
        "emails.json": emails,
        "customers.json": customers,
        "bookings.json": bookings,
        "rentings.json": rentings,
        "amenities.json": amenities,
        "defects.json": defects,
        "room_amenities.json": room_amenities,
        "room_defects.json": room_defects,
    }   

    for chain in hotel_chains:
        cursor.execute("INSERT INTO hotel_chains (chain_id, name, address, num_hotels) VALUES (%s, %s, %s, %s)", 
                    (chain['chain_id'], chain['name'], chain['address'], chain['num_hotels']))

    for hotel in hotels:
        cursor.execute("INSERT INTO hotels (hotel_id, chain_id, name, address, category, num_rooms, area) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                    (hotel['hotel_id'], hotel['chain_id'], hotel['name'], hotel['address'], hotel['category'], hotel['num_rooms'], hotel['area']))

    for room in rooms:
        cursor.execute("INSERT INTO rooms (room_id, hotel_id, capacity, price, view, extendable) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (room['room_id'], room['hotel_id'], room['capacity'], room['price'], room['view'], room['extendable']))

    for employee in employees:
        cursor.execute("INSERT INTO employees (employee_id, hotel_id, ssn, first_name, last_name, address) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (employee['employee_id'], employee['hotel_id'], employee['ssn'], employee['first_name'], employee['last_name'], employee['address']))

    for manage in manages:
        cursor.execute("INSERT INTO manages (hotel_id, employee_id) VALUES (%s, %s)", 
                    (manage['hotel_id'], manage['employee_id']))

    for customer in customers:
        cursor.execute("INSERT INTO customers (customer_id, ssn, first_name, last_name, address, registration) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (customer['customer_id'], customer['ssn'], customer['first_name'], customer['last_name'], customer['address'], customer['registration']))

    for booking in bookings:
        cursor.execute("INSERT INTO bookings (booking_id, customer_id, room_id, start_date, end_date, date_booked) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (booking['booking_id'], booking['customer_id'], booking['room_id'], booking['start_date'], booking['end_date'], booking['date_booked']))

    for renting in rentings:
        cursor.execute("INSERT INTO rentings (renting_id, customer_id, employee_id, room_id, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (renting['renting_id'], renting['customer_id'], renting['employee_id'], renting['room_id'], renting['start_date'], renting['end_date']))

    for phone in phones:
        cursor.execute("INSERT INTO phone_numbers (phone_id, origin, phone) VALUES (%s, %s, %s)", 
                    (phone['phone_id'], phone['origin'], phone['phone']))

    for email in emails:
        cursor.execute("INSERT INTO email_addresses (email_id, origin, email) VALUES (%s, %s, %s)", 
                    (email['email_id'], email['origin'], email['email']))

    for amenity in amenities:
        cursor.execute("INSERT INTO amenities (amenity_id, description) VALUES (%s, %s)", 
                    (amenity['amenity_id'], amenity['description']))

    for defect in defects:
        cursor.execute("INSERT INTO defects (defect_id, description) VALUES (%s, %s)", 
                    (defect['defect_id'], defect['description']))

    for room_amenity in room_amenities:
        cursor.execute("INSERT INTO room_amenities (room_id, amenity_id) VALUES (%s, %s)", 
                    (room_amenity['room_id'], room_amenity['amenity_id']))

    for room_defect in room_defects:
        cursor.execute("INSERT INTO room_defects (room_id, defect_id) VALUES (%s, %s)", 
                    (room_defect['room_id'], room_defect['defect_id']))
    print("done")
    
    conn.commit()
    cursor.close()
    conn_pool.putconn(conn)
    
generate_data()