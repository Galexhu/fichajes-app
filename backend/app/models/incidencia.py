from app import db
from datetime import datetime


class Incidencia(db.Model):
    __tablename__ = "incidencias"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    # tipos: olvido_entrada | olvido_salida | error_horario | ausencia_justificada | otro
    descripcion = db.Column(db.Text, nullable=True)
    estado = db.Column(db.String(20), default="pendiente")
    # estados: pendiente | aprobada | rechazada
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolucion = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "fecha": self.fecha.isoformat(),
            "tipo": self.tipo,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "created_at": self.created_at.isoformat(),
            "resolucion": self.resolucion,
        }
