from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    # Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Blueprints
    from app.routes.auth import auth_bp
    from app.routes.fichajes import fichajes_bp
    from app.routes.incidencias import incidencias_bp
    from app.routes.permisos import permisos_bp
    from app.routes.informes import informes_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(fichajes_bp, url_prefix="/api/fichajes")
    app.register_blueprint(incidencias_bp, url_prefix="/api/incidencias")
    app.register_blueprint(permisos_bp, url_prefix="/api/permisos")
    app.register_blueprint(informes_bp, url_prefix="/api/informes")

    return app
