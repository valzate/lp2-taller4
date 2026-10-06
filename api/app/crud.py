from typing import Optional

from sqlalchemy.orm import Session

from . import models


def obtener_productos(db: Session, categoria_id: Optional[int] = None):
    """Retorna la lista de productos, opcionalmente filtrada por categoría."""
    db_query = db.query(models.Producto) #construye la consulta base
    
    if categoria_id is not None:
        db_query = db_query.filter(models.Producto.categoria_id == categoria_id)
    return db_query.all()


def obtener_producto_por_sku(db: Session, sku: str):
    return db.query(models.Producto).filter(models.Producto.sku == sku).first()


def obtener_categorias(db: Session):
    return db.query(models.Categoria).order_by(models.Categoria.nombre).all()
