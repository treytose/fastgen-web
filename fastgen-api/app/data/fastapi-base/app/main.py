from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel

from .dependencies import db
# routers 
from .routers import customer

app = FastAPI()

# app events #
@app.on_event("startup")
async def startup_event():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await db.disconnect()


# register routers #
app.include_router(customer.router)






























######## URL Args ######
@app.get("/item/search")
async def search_item(query: str, limit: int = 10):
    print(query, limit)
    return [
        Item(name="Chair", price=199.99),
        Item(name="Table", price=499.99),
        Item(name="Candle", price=4.99)
    ]

########## Dynamic Path ##########
@app.get("/item/{item_id}")
def get_item(item_id: int):
    print(item_id)
    return Item(name="Test", price=199.99)


########## Post Example ##########
class Item(BaseModel):    
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/item")
async def create_item(item: Item):
    # create the item here #
    print(item)
    return item



