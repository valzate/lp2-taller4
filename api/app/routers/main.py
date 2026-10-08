
from fastapi import FastAPI

from database import Base, engine


import models
from routers import productos, categorias

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de productos y categorías",
    description="API para consultar productos y categorías",
    version="1.0.0"
)

app.include_router(productos.router)
app.include_router(categorias.router)


@app.get("/")
def inicio():
    return {"mensaje": "API funcionando correctamente"}