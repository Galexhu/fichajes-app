from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.incidencia import Incidencia
from app import db
from app.utils.responses import success_response, error_response
from datetime import date

incidencias_bp = Blueprint("incidencias", __name__)


@incidencias_bp.get("/")
@jwt_required()
def listar():
    user_id = int(get_jwt_identity())
    incidencias = (
        Incidencia.query.filter_by(user_id=user_id)
        .order_by(Incidencia.created_at.desc())
        .all()
    )
    return success_response([i.to_dict() for i in incidencias])


@incidencias_bp.post("/")
@jwt_required()
def crear():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    incidencia = Incidencia(
        user_id=user_id,
        fecha=date.fromisoformat(data["fecha"]),
        tipo=data["tipo"],
        descripcion=data.get("descripcion"),
    )
    db.session.add(incidencia)
    db.session.commit()
    return success_response(incidencia.to_dict(), "Incidencia creada", 201)


@incidencias_bp.get("/<int:incidencia_id>")
@jwt_required()
def detalle(incidencia_id):
    user_id = int(get_jwt_identity())
    inc = Incidencia.query.filter_by(id=incidencia_id, user_id=user_id).first_or_404()
    return success_response(inc.to_dict())
