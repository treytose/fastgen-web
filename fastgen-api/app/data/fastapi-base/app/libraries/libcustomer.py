from app.tools.p3tools import excHandler
from app.dependencies import db
from app.schemas.customer import CustomerModel

class Customer:
    async def get_customer(self, customerid: int):
        customer = await db.fetchone("SELECT * FROM customer WHERE customerid=:customerid", {"customerid": customerid})
        return customer

    async def create_customer(self, customer: CustomerModel):
        customerid = await db.insert("customer", customer)
        return customerid

    async def update_customer(self, customerid: int, customer: CustomerModel):
        error_no = await db.update("customer", "customerid", customerid, customer)
        return error_no

    async def delete_customer(self, customerid: int):
        error_no = await db.delete("customer", "customerid", customerid)
        return error_no