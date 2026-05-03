
import sys
import os
sys.path.append(os.path.join(os.getcwd(), "backend"))
from app.db import engine
from sqlmodel import Session, select
from app.models import User

try:
    with Session(engine) as session:
        # Just try to execute a simple query
        session.exec(select(User)).first()
        print("Database connection successful")
except Exception as e:
    print(f"Database connection failed: {e}")
