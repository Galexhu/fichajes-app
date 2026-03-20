# Sistema de Fichajes Corporativo

Aplicación fullstack para control horario de empleados.

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router v6
- **Backend**: Flask + SQLAlchemy + PostgreSQL + JWT
- **Auth**: JWT (access + refresh tokens)

## Inicio rápido

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Editar con tus credenciales
flask db upgrade
python run.py
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # Editar VITE_API_URL
npm run dev
```

## Módulos

| Módulo | Descripción |
|---|---|
| Registrar | Fichar entrada y salida con reloj en tiempo real |
| Mi historial | Listado de jornadas por mes |
| Mis incidencias | Gestión de ausencias e irregularidades |
| Mi informe | Resumen de horas mensuales |
| Mi calendario | Vista calendárica de la jornada |
| Mis permisos | Solicitud y seguimiento de vacaciones y permisos retribuidos |
| Mi perfil | Datos del empleado |

## Variables de entorno

Ver `backend/.env.example` y `frontend/.env.example`.
