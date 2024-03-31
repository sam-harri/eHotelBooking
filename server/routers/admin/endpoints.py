from fastapi import APIRouter, Depends, HTTPException, Body, Path
from database import get_postgres
from datetime import date
from uuid import uuid4
from psycopg2.extensions import cursor
from pydantic import BaseModel, EmailStr
from typing import List
from fastapi.encoders import jsonable_encoder

admin_router = APIRouter()

@admin_router.post("/converttorenting")
async def convert_to_renting(
        booking_id: str = Body(...),
        employee_id: str = Body(...),
        cursor = Depends(get_postgres)
    ):
    try:
        with cursor as c:
            c.execute("BEGIN;")

            
            c.execute("""
                SELECT customer_id, room_id, start_date, end_date 
                FROM bookings 
                WHERE booking_id = %s;
            """, (booking_id,))
            booking = c.fetchone()
            if not booking:
                raise HTTPException(status_code=404, detail="Booking not found")

            customer_id, room_id, start_date, end_date = booking

            
            renting_id = uuid4()

            
            c.execute("""
                INSERT INTO rentings (renting_id, customer_id, employee_id, room_id, start_date, end_date)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (str(renting_id), str(customer_id), employee_id, str(room_id), start_date, end_date))

            
            
            c.execute("COMMIT;")

            return {"message": "Successfully converted booking to renting", "renting_id": str(renting_id)}
    except Exception as e:
        c.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.post("/createrenting")
async def create_renting(
    room_id: str = Body(...),
    employee_id: str = Body(...),
    first_name: str = Body(...),
    last_name: str = Body(...),
    address: str = Body(...),
    ssn: str = Body(...),
    cursor: cursor = Depends(get_postgres)
):
    try:
        with cursor as c:
            c.execute("BEGIN;")

            
            c.execute("SELECT customer_id FROM customers WHERE ssn = %s;", (ssn,))
            customer_result = c.fetchone()

            if customer_result:
                customer_id = customer_result[0]
            else:
                
                customer_id = uuid4()
                c.execute("""
                    INSERT INTO customers (customer_id, ssn, first_name, last_name, address, registration)
                    VALUES (%s, %s, %s, %s, %s, CURRENT_DATE);
                """, (str(customer_id), ssn, first_name, last_name, address))

            
            renting_id = uuid4()
            c.execute("""
                INSERT INTO rentings (renting_id, customer_id, employee_id, room_id, start_date, end_date)
                VALUES (%s, %s, %s, %s, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day');
            """, (str(renting_id), str(customer_id), employee_id, room_id))

            c.execute("COMMIT;")
            
            return {"message": "Renting created successfully", "renting_id": str(renting_id)}
    except Exception as e:
        c.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.post("/addemployee")
async def add_employee(
    hotel_id: str = Body(...),
    first_name: str = Body(...),
    last_name: str = Body(...),
    ssn: str = Body(...),
    address: str = Body(...),
    is_manager: bool = Body(...),
    db_cursor: cursor = Depends(get_postgres)
):
    try:
        with db_cursor as cursor:
            cursor.execute("BEGIN;")

            employee_id = uuid4()
            cursor.execute("""
                INSERT INTO employees (employee_id, hotel_id, ssn, first_name, last_name, address)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (str(employee_id), hotel_id, ssn, first_name, last_name, address))

            if is_manager:
                cursor.execute("""
                    INSERT INTO manages (hotel_id, employee_id)
                    VALUES (%s, %s);
                """, (hotel_id, str(employee_id)))

            cursor.execute("COMMIT;")

            return {"message": "Employee added successfully", "employee_id": str(employee_id)}

    except Exception as e:
        cursor.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.post("/addhotelchain")
async def add_hotel_chain(
    name: str = Body(..., embed=True),
    address: str = Body(..., embed=True),
    phone_numbers: List[dict] = Body(..., embed=True),  
    email_addresses: List[dict] = Body(..., embed=True),  
    cursor: cursor = Depends(get_postgres)
):
    try:
        chain_id = uuid4()
        with cursor as c:
            c.execute("BEGIN;")

            
            c.execute("""
                INSERT INTO hotel_chains (chain_id, name, address, num_hotels)
                VALUES (%s, %s, %s, 0);
            """, (str(chain_id), name, address))

            
            for phone_number in phone_numbers:
                c.execute("""
                    INSERT INTO phone_numbers (phone_id, origin, phone)
                    VALUES (%s, %s, %s);
                """, (str(uuid4()), str(chain_id), phone_number['phone']))

            
            for email_address in email_addresses:
                c.execute("""
                    INSERT INTO email_addresses (email_id, origin, email)
                    VALUES (%s, %s, %s);
                """, (str(uuid4()), str(chain_id), email_address['email']))

            c.execute("COMMIT;")
            return {"message": "Hotel chain added successfully", "chain_id": str(chain_id)}
    except Exception as e:
        c.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.post("/addhotel")
async def add_hotel(
    chain_id: str = Body(..., embed=True),
    name: str = Body(..., embed=True),
    address: str = Body(..., embed=True),
    category: int = Body(..., embed=True),
    area: str = Body(..., embed=True),
    cursor: cursor = Depends(get_postgres)
):
    try:
        with cursor as c:
            hotel_id = uuid4()
            c.execute("""
                INSERT INTO hotels (hotel_id, chain_id, name, address, category, num_rooms, area)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (str(hotel_id), chain_id, name, address, category, 0, area))
            return {"message": "Hotel added successfully", "hotel_id": str(hotel_id)}
    except Exception as e:
        c.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))


@admin_router.post("/addroom")
async def add_room(
    hotel_id: str = Body(...),
    capacity: int = Body(...),
    price: float = Body(...),
    view: str = Body(...),
    extendable: bool = Body(...),
    room_number: int = Body(...),
    amenities: List[str] = Body(default=[]),
    defects: List[str] = Body(default=[]),
    cursor: cursor = Depends(get_postgres)
):
    try:
        with cursor as c:
            c.execute("BEGIN;")
            
            
            room_id = uuid4()
            c.execute("""
                INSERT INTO rooms (room_id, hotel_id, capacity, price, view, extendable, room_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (str(room_id), hotel_id, capacity, price, view, extendable, room_number))
            
            
            for amenity_id in amenities:
                c.execute("""
                    INSERT INTO room_amenities (room_id, amenity_id)
                    VALUES (%s, %s);
                """, (str(room_id), amenity_id))
                
            
            for defect_id in defects:
                c.execute("""
                    INSERT INTO room_defects (room_id, defect_id)
                    VALUES (%s, %s);
                """, (str(room_id), defect_id))
            
            c.execute("COMMIT;")
            return {"message": "Room added successfully", "room_id": str(room_id)}
    except Exception as e:
        c.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=str(e))
    

@admin_router.delete("/deleteroom/{room_id}")
async def delete_room(
    room_id: str = Path(...),
    cursor: cursor = Depends(get_postgres)
):
    try:
        with cursor as c:
            
            c.execute("DELETE FROM rooms WHERE room_id = %s;", (str(room_id),))
            return {"message": "Room deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@admin_router.delete("/deletehotel/{hotel_id}")
async def delete_hotel(
    hotel_id: str = Path(...),
    db_cursor: cursor = Depends(get_postgres)
):
    try:
        with db_cursor as cursor:
            
            cursor.execute("""
                DELETE FROM hotels WHERE hotel_id = %s;
            """, (hotel_id,))

            return {"message": "Hotel deleted successfully"}

    except Exception as e:
        cursor.execute("ROLLBACK;")
        raise HTTPException(status_code=400, detail=f"Failed to delete hotel: {e}")
    
@admin_router.delete("/deletechain/{chain_id}")
async def delete_hotel_chain(
    chain_id: str = Path(...),
    db_cursor: cursor = Depends(get_postgres)
):
    try:
        with db_cursor as cursor:
            cursor.execute("DELETE FROM hotel_chains WHERE chain_id = %s;", (chain_id,))
            return {"message": "Hotel chain deleted successfully"}
    except Exception as e:
        cursor.execute("ROLLBACK;")
        raise HTTPException(status_code=500, detail=f"Failed to delete hotel chain: {e}")