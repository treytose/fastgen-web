from pydantic import BaseModel
from typing import Optional

class CustomerModel(BaseModel):
  customerid: Optional[int] = None
  name: str