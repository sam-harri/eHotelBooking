from fastapi import APIRouter, Depends, HTTPException, Body
from database import get_postgres
from datetime import date, datetime
from uuid import uuid4

user_router = APIRouter()

@user_router.post("/book")
async def book_room(
        room_id: str = Body(...),
        start_date: date = Body(...),
        end_date: date = Body(...),
        ssn: str = Body(...),
        first_name: str = Body(...),
        last_name: str = Body(...),
        address: str = Body(...),
        cursor = Depends(get_postgres) 
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

        
            booking_id = uuid4()
            c.execute("""
                INSERT INTO bookings (booking_id, customer_id, room_id, start_date, end_date, date_booked)
                VALUES (%s, %s, %s, %s, %s, CURRENT_DATE);
            """, (str(booking_id), str(customer_id), room_id, start_date, end_date, ))

        
            c.execute("COMMIT;")

            return {"message": "Booking successful", "booking_id": str(booking_id)}
    except Exception as e:
    
        raise HTTPException(status_code=400, detail=str(e))
