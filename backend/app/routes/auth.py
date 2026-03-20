from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app.models.user import User
from app import db
from app.utils.responses import success_response, error_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")

    user = User.query.filter_by(email=email, activo=True).first()
    if not user or not user.check_password(password):
        return error_response("Credenciales incorrectas", 401)

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return success_response(
        {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict(),
        }
    )


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return success_response({"access_token": access_token})


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    return success_response(user.to_dict())


@auth_bp.post("/register")
def register():
    """Solo para setup inicial / uso interno."""
    data = request.get_json()
    if User.query.filter_by(email=data.get("email", "").lower()).first():
        return error_response("El email ya está registrado", 409)

    user = User(
        email=data["email"].lower().strip(),
        nombre=data["nombre"],
        apellidos=data["apellidos"],
        rol=data.get("rol", "empleado"),
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return success_response(user.to_dict(), "Usuario creado", 201)
