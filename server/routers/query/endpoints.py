from fastapi import APIRouter,Depends, Query
from database import get_postgres
from typing import Optional
from datetime import date
from models.schema import RoomView
from psycopg2.extensions import cursor

query_router = APIRouter()

@query_router.get("/availableHotels", response_model=None)
async def get_available_hotels(
        start_date: date = Query(..., description="Start date of the availability period"),
        end_date: date = Query(..., description="End date of the availability period"),
        area: str = Query(..., description="Area where the hotel is located"),
        cursor: cursor = Depends(get_postgres)
    ):
    with cursor as c:
        query = """
        SELECT h.hotel_id, h.name AS hotel_name, hc.name AS hotel_chain_name, h.address, h.area, h.category, 
            r.room_id, r.capacity, r.price, r.view, r.extendable, r.room_number,
            array_agg(DISTINCT a.description) FILTER (WHERE a.description IS NOT NULL) AS amenities, 
            array_agg(DISTINCT d.description) FILTER (WHERE d.description IS NOT NULL) AS defects
        FROM hotels h
        JOIN hotel_chains hc ON h.chain_id = hc.chain_id
        JOIN rooms r ON h.hotel_id = r.hotel_id
        LEFT JOIN room_amenities ra ON r.room_id = ra.room_id
        LEFT JOIN amenities a ON ra.amenity_id = a.amenity_id
        LEFT JOIN room_defects rd ON r.room_id = rd.room_id
        LEFT JOIN defects d ON rd.defect_id = d.defect_id
        WHERE h.area = %s AND NOT EXISTS (
            SELECT 1 FROM bookings b WHERE b.room_id = r.room_id AND 
            (b.start_date, b.end_date) OVERLAPS (DATE %s, DATE %s)
        ) AND NOT EXISTS (
            SELECT 1 FROM rentings rg WHERE rg.room_id = r.room_id AND 
            (rg.start_date, rg.end_date) OVERLAPS (DATE %s, DATE %s)
        )
        GROUP BY h.hotel_id, r.room_id, hc.chain_id
        ORDER BY h.name, r.room_id
        """
        c.execute(query, (area, start_date, end_date, start_date, end_date))
        hotels = c.fetchall()
        
        hotels_transformed = [{
            "room_id": room_id,
            "hotel_id": hotel_id,
            "capacity": capacity,
            "view": view,
            "extendable": extendable,
            "room_number": room_number,
            "imageUrl": "",
            "hotelName": hotel_name,
            "hotelChainName": hotel_chain_name,
            "area": area,
            "address": address,
            "price": price,
            "amenities": amenities,
            "defects": defects,
            "rating": category,
        } for hotel_id, hotel_name, hotel_chain_name, address, area, category, room_id, capacity, price, view, extendable, room_number, amenities, defects in hotels]

        return hotels_transformed

@query_router.get("/getchains", response_model=None)
def get_chains(
        cursor : cursor = Depends(get_postgres)
    ):
    with cursor as c:
        c.execute("SELECT chain_id, name FROM hotel_chains;")
        res = c.fetchall()
    return [{"chain_id" : chain_id, "name" : name} for chain_id, name in res]

@query_router.get("/gethotels", response_model=None)
def get_hotels(
        chain_id: str = Query(...),
        cursor : cursor = Depends(get_postgres)
    ):
    with cursor as c:
        c.execute("""
            SELECT h.hotel_id, h.name FROM hotel_chains hc
            JOIN hotels h on hc.chain_id=h.chain_id
            WHERE hc.chain_id=%s
        """, (chain_id,))
        res = c.fetchall()
    return [{"hotel_id" : hotel_id, "name" : name} for hotel_id, name in res]

@query_router.get("/getemployees", response_model=None)
def get_employees(
        hotel_id: str = Query(...),
        cursor : cursor = Depends(get_postgres)
    ):
    with cursor as c:
        c.execute("""
            SELECT e.employee_id, e.first_name, e.last_name FROM hotels h
            JOIN employees e ON e.hotel_id=h.hotel_id
            WHERE e.hotel_id=%s
        """, (hotel_id,))
        res = c.fetchall()
    return [{"employee_id" : employee_id, "name" : first_name + " " + last_name} for employee_id, first_name, last_name in res]

@query_router.get("/getbookings", response_model=None)
def get_bookings(
    hotel_id: str = Query(...),
    cursor : cursor = Depends(get_postgres)
):
    with cursor as c:
        c.execute("""
        SELECT b.booking_id, c.first_name, c.last_name FROM bookings b
        JOIN rooms r ON b.room_id=r.room_id
        JOIN hotels h ON r.hotel_id=h.hotel_id
        JOIN customers c ON b.customer_id=c.customer_id
        WHERE 
            b.start_date=CURRENT_DATE
            AND h.hotel_id=%s
        """, (hotel_id,)
        )
        res = c.fetchall()
    return [{
        "booking_id" : booking_id,
        "name" : first_name + " " + last_name
        } for booking_id, first_name, last_name in res]

@query_router.get("/getrooms", response_model=None)
def get_rooms(
    hotel_id: str = Query(..., description="Hotel ID"),
    capacity: Optional[int] = Query(None, description="Capacity of the room"),
    cursor: cursor = Depends(get_postgres)
):
    with cursor as c:
        if capacity is not None:
            query = """
            SELECT room_id, room_number FROM rooms
            WHERE hotel_id = %s AND capacity = %s
            AND room_id NOT IN (
                SELECT room_id FROM bookings
                WHERE (CURRENT_DATE BETWEEN start_date AND end_date)
                UNION
                SELECT room_id FROM rentings
                WHERE (CURRENT_DATE BETWEEN start_date AND end_date)
            );
            """
            c.execute(query, (hotel_id, capacity))
        else:
            query = """
            SELECT room_id, room_number FROM rooms
            WHERE hotel_id = %s
            AND room_id NOT IN (
                SELECT room_id FROM bookings
                WHERE (CURRENT_DATE BETWEEN start_date AND end_date)
                UNION
                SELECT room_id FROM rentings
                WHERE (CURRENT_DATE BETWEEN start_date AND end_date)
            );
            """
            c.execute(query, (hotel_id,))
        rooms = c.fetchall()
        
        return [{"room_id": room_id, "room_number": room_number} for room_id, room_number in rooms]

@query_router.get("/getamenities", response_model=None)
def get_ammenities(
        cursor: cursor = Depends(get_postgres)
):
    with cursor as c:
        c.execute("SELECT amenity_id, description FROM amenities")
        res = c.fetchall()
    return [{"amenity_id": amenity_id, "description": description} for amenity_id, description in res]

@query_router.get("/getdefects", response_model=None)
def get_defects(
        cursor: cursor = Depends(get_postgres)
):
    with cursor as c:
        c.execute("SELECT defect_id, description FROM defects")
        res = c.fetchall()
    return [{"defect_id": defect_id, "description": description} for defect_id, description in res]