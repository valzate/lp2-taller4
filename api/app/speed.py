import json
import os

from .database import Base, SessionLocal, engine
from .models import Categoria, Producto

RUTA_PRODUCTOS = os.path.join(os.path.dirname(__file__), "..", "data", "productos.json")


def cargar_datos():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:

        with open(RUTA_PRODUCTOS, "r", encoding="utf-8") as f:
            datos = json.load(f)

        for item in datos:

            categoria =db.query(Categoria).filter_by(nombre=item["categoria"]).first()

            if categoria is None:
                    categoria = Categoria(nombre=item["categoria"])
                    db.add(categoria)
                    db.flush()  

            producto_existente = db.query(Producto).filter_by(
                sku=item["sku"]
            ).first()
            if producto_existente:
                continue

            producto = Producto(
            sku=item["sku"],
            marca=item.get("marca"),
            nombre=item["nombre"],
            precio=item["precio"],
            foto=item.get("foto"),
            stock=item.get("stock", 0),
            activo=item.get("activo", True),
            categoria_id=categoria.id
            )
            
            db.add(producto)
        
        db.commit()
        
        print(f"Se cargaron {len(datos)} productos.")
    finally:
        db.close()


if __name__ == "__main__":
    cargar_datos()