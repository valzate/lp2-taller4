from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/categorias", tags=["categorias"])


@router.get("/", response_model=List[schemas.CategoriaBase])
def listar_categorias(db: Session = Depends(get_db)):
    return crud.obtener_categorias(db)