from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.permiso import Permiso
from app import db
from app.utils.responses import success_response, error_response
from datetime import date
from app.services.dias_habiles import calcular_dias_habiles

permisos_bp = Blueprint("permisos", __name__)

TIPOS_VALIDOS = [
    "vacaciones",
    "permiso_retribuido",
    "baja_medica",
    "lactancia",
    "matrimonio",
    "fallecimiento",
    "otro",
]


@permisos_bp.get("/")
@jwt_required()
def listar():
    user_id = int(get_jwt_identity())
    tipo = request.args.get("tipo")
    estado = request.args.get("estado")

    q = Permiso.query.filter_by(user_id=user_id)
    if tipo:
        q = q.filter_by(tipo=tipo)
    if estado:
        q = q.filter_by(estado=estado)

    permisos = q.order_by(Permiso.created_at.desc()).all()
    return success_response([p.to_dict() for p in permisos])


@permisos_bp.post("/")
@jwt_required()
def solicitar():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if data.get("tipo") not in TIPOS_VALIDOS:
        return error_response(f"Tipo inválido. Válidos: {TIPOS_VALIDOS}", 422)

    fecha_inicio = date.fromisoformat(data["fecha_inicio"])
    fecha_fin = date.fromisoformat(data["fecha_fin"])

    if fecha_fin < fecha_inicio:
        return error_response("La fecha fin no puede ser anterior a la fecha inicio", 422)

    dias = calcular_dias_habiles(fecha_inicio, fecha_fin)

    permiso = Permiso(
        user_id=user_id,
        tipo=data["tipo"],
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        dias_habiles=dias,
        motivo=data.get("motivo"),
    )
    db.session.add(permiso)
    db.session.commit()
    return success_response(permiso.to_dict(), "Solicitud enviada", 201)


@permisos_bp.get("/<int:permiso_id>")
@jwt_required()
def detalle(permiso_id):
    user_id = int(get_jwt_identity())
    permiso = Permiso.query.filter_by(id=permiso_id, user_id=user_id).first_or_404()
    return success_response(permiso.to_dict())


@permisos_bp.delete("/<int:permiso_id>")
@jwt_required()
def cancelar(permiso_id):
    user_id = int(get_jwt_identity())
    permiso = Permiso.query.filter_by(id=permiso_id, user_id=user_id).first_or_404()
    if permiso.estado not in ("pendiente",):
        return error_response("Solo se pueden cancelar solicitudes pendientes", 409)
    permiso.estado = "cancelado"
    db.session.commit()
    return success_response(permiso.to_dict(), "Solicitud cancelada")
