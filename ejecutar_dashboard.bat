@echo off
:: Script de ejecución rápida para el Dashboard de Streamlit (Windows)
:: Grupo 4 - FISC - UTP (2026)
chcp 65001 > nul
title Dashboard Mercado Laboral IT Panamá - UTP

echo ======================================================================
echo    INICIANDO EL DASHBOARD DEL MERCADO LABORAL IT - FISC UTP (2026)
echo ======================================================================
echo.

:: Verificar si existe el entorno virtual
if not exist ".venv" (
    echo [ERROR] No se encontró la carpeta del entorno virtual '.venv'.
    echo Creando entorno virtual e instalando dependencias...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] No se pudo crear el entorno virtual. Asegúrese de tener Python instalado.
        goto error
    )
    call .venv\Scripts\activate
    echo Instalando librerías requeridas...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Falló la instalación de dependencias en requirements.txt.
        goto error
    )
) else (
    echo [INFO] Entorno virtual '.venv' detectado. Activando...
    call .venv\Scripts\activate
)

echo.
echo [INFO] Iniciando el Dashboard con Streamlit...
echo [INFO] Si es la primera vez y le pide un correo, presione ENTER para dejarlo vacío.
echo.

streamlit run src/app.py

if errorlevel 1 (
    echo.
    echo [ERROR] Ocurrió un problema al ejecutar Streamlit.
    goto error
)

goto fin

:error
echo.
echo [INFO] Presione cualquier tecla para salir.
pause > nul

:fin
