CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS hotel_chains (
    chain_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    num_hotels INT NOT NULL CHECK (num_hotels >= 0)
);

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id UUID REFERENCES hotel_chains(chain_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    category INT NOT NULL CHECK (category BETWEEN 1 AND 5),
    num_rooms INT NOT NULL CHECK (num_rooms >= 0),
    area VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    capacity INT NOT NULL CHECK (capacity >= 0),
    price NUMERIC NOT NULL CHECK (price >= 0),
    view VARCHAR(50) NOT NULL CHECK (view IN ('sea', 'mountain', 'city', 'garden')),
    extendable BOOLEAN NOT NULL
    room_number INT
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ssn VARCHAR(11) UNIQUE NOT NULL CHECK (ssn ~ '^\d{3}-\d{3}-\d{3}$'),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    registration DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    ssn VARCHAR(11) UNIQUE NOT NULL CHECK (ssn ~ '^\d{3}-\d{3}-\d{3}$'),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS manages (
    hotel_id UUID REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    employee_id UUID UNIQUE REFERENCES employees(employee_id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, employee_id)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    date_booked DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS rentings (
    renting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(employee_id),
    room_id UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS amenities (
    amenity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS room_amenities (
    room_id UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(amenity_id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS defects (
    defect_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS room_defects (
    room_id UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    defect_id UUID REFERENCES defects(defect_id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, defect_id)
);

CREATE TABLE IF NOT EXISTS phone_numbers (
    phone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin UUID NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS email_addresses (
    email_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin UUID NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);
