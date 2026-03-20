from app import db
from datetime import datetime


class Ficha(db.Model):
    __tablename__ = "fichas"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    tipo = db.Column(db.String(10), nullable=False)  # entrada | salida | pausa | vuelta
    latitud = db.Column(db.Float, nullable=True)
    longitud = db.Column(db.Float, nullable=True)
    ip = db.Column(db.String(45), nullable=True)
    nota = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat(),
            "tipo": self.tipo,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "nota": self.nota,
        }
