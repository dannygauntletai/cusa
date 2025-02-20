from fastapi import FastAPI
from app.api.routes import items, utils, questions

app = FastAPI()

# Core routes
app.include_router(items.router)
app.include_router(utils.router)

# Question-related routes
app.include_router(questions.router)
