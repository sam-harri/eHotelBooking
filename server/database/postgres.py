import os
from typing import Generator, Optional
from psycopg2.extensions import connection, cursor
from psycopg2.pool import SimpleConnectionPool
from psycopg2 import DatabaseError
import dotenv
from contextlib import contextmanager


dotenv.load_dotenv()


POSTGRES_USER: Optional[str] = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD: Optional[str] = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST: Optional[str] = os.getenv("POSTGRES_HOST")
POSTGRES_PORT: Optional[str] = os.getenv("POSTGRES_PORT")
POSTGRES_DATABASE: Optional[str] = os.getenv("POSTGRES_DATABASE")


if not all([POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE]):
    raise EnvironmentError("Missing required environment variables for database connection.")

conn_pool: Optional[SimpleConnectionPool] = None

def init_postgres() -> None:
    global conn_pool
    try:
        conn_pool = SimpleConnectionPool(
            1, 20,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            database=POSTGRES_DATABASE)
    except (Exception, DatabaseError) as error:
        print(f"Error while connecting to PostgreSQL: {error}")
        raise error  

@contextmanager
def get_postgres() -> Generator[cursor, None, None]:
    if conn_pool is None:
        print("Database not initialized. Call init_postgres() first.")
        raise RuntimeError("Database not initialized.")
    
    conn: connection = conn_pool.getconn()
    if not conn:
        print("Failed to get connection from the pool.")
        raise RuntimeError("Failed to get connection from the pool.")
    
    cur: cursor = conn.cursor()
    try:
        yield cur
    finally:
        conn.commit()
        cur.close()
        conn_pool.putconn(conn)

def close_postgres() -> None:
    if conn_pool:
        conn_pool.closeall()
        print("PostgreSQL connection pool is closed.")
