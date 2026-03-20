from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.ficha import Ficha
from app import db
from app.utils.responses import success_response, error_response
from datetime import datetime, date
import pytz

fichajes_bp = Blueprint("fichajes", __name__)

MADRID_TZ = pytz.timezone("Europe/Madrid")


@fichajes_bp.post("/fichar")
@jwt_required()
def fichar():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    # Determinar tipo automáticamente según último fichaje del día
    hoy = date.today()
    fichajes_hoy = (
        Ficha.query.filter_by(user_id=user_id)
        .filter(db.func.date(Ficha.timestamp) == hoy)
        .order_by(Ficha.timestamp.desc())
        .all()
    )

    tipo_map = {0: "entrada", 1: "salida", 2: "vuelta", 3: "salida"}
    tipo = tipo_map.get(len(fichajes_hoy) % 4, "entrada")

    # Si viene tipo explícito lo respetamos
    if "tipo" in data and data["tipo"] in ["entrada", "salida", "pausa", "vuelta"]:
        tipo = data["tipo"]

    ficha = Ficha(
        user_id=user_id,
        tipo=tipo,
        latitud=data.get("latitud"),
        longitud=data.get("longitud"),
        ip=request.remote_addr,
        nota=data.get("nota"),
    )
    db.session.add(ficha)
    db.session.commit()
    return success_response(ficha.to_dict(), f"Fichaje de {tipo} registrado", 201)


@fichajes_bp.get("/hoy")
@jwt_required()
def fichajes_hoy():
    user_id = int(get_jwt_identity())
    hoy = date.today()
    fichas = (
        Ficha.query.filter_by(user_id=user_id)
        .filter(db.func.date(Ficha.timestamp) == hoy)
        .order_by(Ficha.timestamp.asc())
        .all()
    )
    return success_response([f.to_dict() for f in fichas])


@fichajes_bp.get("/historial")
@jwt_required()
def historial():
    user_id = int(get_jwt_identity())
    mes = request.args.get("mes", datetime.now().month, type=int)
    anio = request.args.get("anio", datetime.now().year, type=int)

    fichas = (
        Ficha.query.filter_by(user_id=user_id)
        .filter(db.extract("month", Ficha.timestamp) == mes)
        .filter(db.extract("year", Ficha.timestamp) == anio)
        .order_by(Ficha.timestamp.asc())
        .all()
    )

    # Agrupar por día
    jornadas = {}
    for f in fichas:
        dia = f.timestamp.date().isoformat()
        jornadas.setdefault(dia, []).append(f.to_dict())

    return success_response({"mes": mes, "anio": anio, "jornadas": jornadas})
