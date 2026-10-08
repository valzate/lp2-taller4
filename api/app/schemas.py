from pydantic import BaseModel


class CategoriaBase(BaseModel):

    id: int
    nombre : str
    

    class Config:
        from_attributes = True


class ProductoBase(BaseModel):
    
    id: int
    sku: str
    precio : float
    marca : str
    nombre : str
    foto : str | None = None
    stock : int
    activo : bool
    disponible : bool
    categoria : CategoriaBase

    class Config:
        from_attributes = True