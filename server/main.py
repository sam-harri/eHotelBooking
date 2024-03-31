from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin_router, query_router, user_router
from contextlib import asynccontextmanager
from database import close_postgres, init_postgres
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_postgres()
    yield
    close_postgres()

app : FastAPI = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router, prefix="")
app.include_router(query_router, prefix="")
app.include_router(user_router, prefix="")


@app.get(path="/ping")
def ping():
    return {"status": "active"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
    
# SELECT * FROM hotel_room_capacity
# SELECT * FROM available_rooms_per_area