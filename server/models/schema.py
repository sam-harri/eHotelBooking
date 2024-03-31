from datetime import date
from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from uuid import UUID, uuid4
from enum import Enum

class RoomView(str, Enum):
    sea = 'sea'
    mountain = 'mountain'
    city = 'city'
    garden = 'garden'

class HotelChain(BaseModel):
    chain_id: UUID = Field(default_factory=uuid4)
    name: str
    address: str
    num_hotels: int

    @validator('num_hotels')
    def num_hotels_must_be_positive(cls, v):
        assert v >= 0, 'must be greater than or equal to 0'
        return v

class Hotel(BaseModel):
    hotel_id: UUID = Field(default_factory=uuid4)
    chain_id: UUID
    name: str
    address: str
    category: int
    num_rooms: int
    area: str

    @validator('category')
    def category_must_be_valid(cls, v):
        assert 1 <= v <= 5, 'must be between 1 and 5'
        return v

    @validator('num_rooms')
    def num_rooms_must_be_positive(cls, v):
        assert v >= 0, 'must be greater than or equal to 0'
        return v

class Room(BaseModel):
    room_id: UUID = Field(default_factory=uuid4)
    hotel_id: UUID
    capacity: int
    price: float
    view: RoomView
    extendable: bool

    @validator('capacity', 'price')
    def must_be_positive(cls, v):
        assert v >= 0, 'must be greater than or equal to 0'
        return v

class Customer(BaseModel):
    customer_id: UUID = Field(default_factory=uuid4)
    ssn: str
    first_name: str
    last_name: str
    address: str
    registration: date

    @validator('ssn')
    def validate_ssn(cls, v):
        if not (len(v) == 11 and v.count('-') == 2 and all(part.isdigit() for part in v.split('-'))):
            raise ValueError('SSN must be in the format 111-222-333')
        return v

class Employee(BaseModel):
    employee_id: UUID = Field(default_factory=uuid4)
    hotel_id : UUID
    ssn: str
    first_name: str
    last_name: str
    address: str

    @validator('ssn')
    def validate_ssn(cls, v):
        if not (len(v) == 11 and v.count('-') == 2 and all(part.isdigit() for part in v.split('-'))):
            raise ValueError('SSN must be in the format 111-222-333')
        return v

class Manages(BaseModel):
    hotel_id: UUID
    employee_id: UUID

class Booking(BaseModel):
    booking_id: UUID = Field(default_factory=uuid4)
    customer_id: UUID
    room_id: UUID
    start_date: date
    end_date: date
    date_booked: date

    @validator('end_date', 'date_booked')
    def end_date_must_be_after_start_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class Renting(BaseModel):
    renting_id: UUID = Field(default_factory=uuid4)
    customer_id: UUID
    employee_id: UUID
    room_id: UUID
    start_date: date
    end_date: date

    @validator('end_date')
    def end_date_must_be_after_start_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class PhoneNumber(BaseModel):
    phone_id: UUID = Field(default_factory=uuid4)
    origin: UUID
    phone: str

    @validator('phone')
    def validate_phone(cls, v):
        if not (len(v) >= 10 and all(c.isdigit() or c in ['+', '-'] for c in v)):
            raise ValueError('Phone number must be a valid format')
        return v

class EmailAddress(BaseModel):
    email_id: UUID = Field(default_factory=uuid4)
    origin: UUID
    email: EmailStr

class Defect(BaseModel):
    defect_id: UUID = Field(default_factory=uuid4)
    description: str


class Amenity(BaseModel):
    amenity_id: UUID = Field(default_factory=uuid4)
    description: str

class RoomAmenity(BaseModel):
    room_id: UUID
    amenity_id: UUID

class RoomDefect(BaseModel):
    room_id: UUID
    defect_id: UUID