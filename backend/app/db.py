from sqlmodel import Session, SQLModel, create_engine
from .core.config.settings import settings
from .models import Profile, User, Feedback

engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
