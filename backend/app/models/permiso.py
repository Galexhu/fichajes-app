from app import db
from datetime import datetime


class Permiso(db.Model):
    __tablename__ = "permisos"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    # tipos: vacaciones | permiso_retribuido | baja_medica | lactancia | matrimonio | fallecimiento | otro
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    dias_habiles = db.Column(db.Integer, nullable=True)
    motivo = db.Column(db.Text, nullable=True)
    estado = db.Column(db.String(20), default="pendiente")
    # pendiente | aprobado | rechazado | cancelado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    aprobado_por = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    comentario_admin = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tipo": self.tipo,
            "fecha_inicio": self.fecha_inicio.isoformat(),
            "fecha_fin": self.fecha_fin.isoformat(),
            "dias_habiles": self.dias_habiles,
            "motivo": self.motivo,
            "estado": self.estado,
            "created_at": self.created_at.isoformat(),
            "comentario_admin": self.comentario_admin,
        }
