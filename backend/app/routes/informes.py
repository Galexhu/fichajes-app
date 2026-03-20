from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.ficha import Ficha
from app import db
from app.utils.responses import success_response
from datetime import datetime
from collections import defaultdict

informes_bp = Blueprint("informes", __name__)


@informes_bp.get("/mensual")
@jwt_required()
def informe_mensual():
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

    # Calcular horas por día
    jornadas = defaultdict(list)
    for f in fichas:
        jornadas[f.timestamp.date().isoformat()].append(f)

    resumen_dias = []
    total_minutos = 0

    for dia, fichas_dia in sorted(jornadas.items()):
        minutos_dia = 0
        entradas = [f for f in fichas_dia if f.tipo in ("entrada", "vuelta")]
        salidas = [f for f in fichas_dia if f.tipo in ("salida", "pausa")]

        pares = zip(entradas, salidas)
        for entrada, salida in pares:
            delta = salida.timestamp - entrada.timestamp
            minutos_dia += int(delta.total_seconds() / 60)

        total_minutos += minutos_dia
        resumen_dias.append(
            {
                "fecha": dia,
                "minutos": minutos_dia,
                "horas": round(minutos_dia / 60, 2),
                "fichajes": len(fichas_dia),
            }
        )

    return success_response(
        {
            "mes": mes,
            "anio": anio,
            "total_minutos": total_minutos,
            "total_horas": round(total_minutos / 60, 2),
            "dias_trabajados": len(resumen_dias),
            "detalle": resumen_dias,
        }
    )
