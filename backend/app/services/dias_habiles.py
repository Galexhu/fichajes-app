from datetime import date, timedelta

# Festivos nacionales España 2024/2025/2026 (simplificado)
FESTIVOS_ES = {
    date(2024, 1, 1), date(2024, 1, 6), date(2024, 3, 29), date(2024, 4, 1),
    date(2024, 5, 1), date(2024, 8, 15), date(2024, 10, 12), date(2024, 11, 1),
    date(2024, 12, 6), date(2024, 12, 8), date(2024, 12, 25),
    date(2025, 1, 1), date(2025, 1, 6), date(2025, 4, 17), date(2025, 4, 18),
    date(2025, 5, 1), date(2025, 8, 15), date(2025, 10, 12), date(2025, 11, 1),
    date(2025, 12, 6), date(2025, 12, 8), date(2025, 12, 25),
    date(2026, 1, 1), date(2026, 1, 6), date(2026, 4, 2), date(2026, 4, 3),
    date(2026, 5, 1), date(2026, 8, 15), date(2026, 10, 12), date(2026, 11, 1),
    date(2026, 12, 7), date(2026, 12, 8), date(2026, 12, 25),
}


def calcular_dias_habiles(fecha_inicio: date, fecha_fin: date) -> int:
    """Cuenta los días hábiles (lunes-viernes excluyendo festivos)."""
    dias = 0
    current = fecha_inicio
    while current <= fecha_fin:
        if current.weekday() < 5 and current not in FESTIVOS_ES:
            dias += 1
        current += timedelta(days=1)
    return dias
