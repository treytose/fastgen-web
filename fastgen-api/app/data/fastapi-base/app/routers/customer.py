from fastapi import APIRouter
from app.libraries.libcustomer import Customer
from app.schemas.customer import CustomerModel

router = APIRouter()
oCustomer = Customer()

@router.get("/customer/{customerid}")
async def get_customer(customerid: int):
  return await oCustomer.get_customer(customerid)

@router.post("/customer")
async def create_customer(customer: CustomerModel):
  return await oCustomer.create_customer(customer.dict())

@router.put("/customer/{customerid}")
async def update_customer(customerid: int, customer: CustomerModel):
  customer.customerid = customerid
  return await oCustomer.update_customer(customerid, customer.dict()) 

@router.delete("/customer/{customerid}")
async def delete_customer(customerid: int):
  return await oCustomer.delete_customer(customerid)