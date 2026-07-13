# Guía de Configuración y Ejecución desde Cero — Examen Semestral 🚀

Esta guía detalla los pasos necesarios para clonar, configurar, instalar dependencias y ejecutar de forma local el proyecto **Examen Semestral de Gestión de la Información** de la **FISC - UTP (Semestre I, 2026)**, el cual es una continuación y expansión del Parcial 2.

---

## 📋 Prerrequisitos

Asegúrate de contar con lo siguiente instalado en tu equipo antes de comenzar:
1. **Python 3.9 o superior** (Durante la instalación en Windows, asegúrate de marcar la casilla *"Add Python to PATH"*).
2. **Git** (Para clonar el repositorio).
3. Conexión a Internet activa.
4. **Power BI Desktop** (Versión de Junio de 2026 o posterior, compatible con proyectos PBIP y traducción de metadatos TMDL).
5. **Opcional:** Una clave API de Google Gemini (puedes obtener una gratis en [Google AI Studio](https://aistudio.google.com/apikey)).

---

## 🛠️ Paso 1: Clonar el Repositorio

Abre la terminal de tu sistema operativo (Símbolo del Sistema / CMD, PowerShell o Terminal de macOS/Linux) y clona esta nueva versión del repositorio:

```bash
git clone https://github.com/fernandojjq/semestral.git
cd semestral
```

---

## ⚙️ Paso 2: Crear y Activar el Entorno Virtual

El entorno virtual aísla las librerías del proyecto para evitar conflictos con otras instalaciones de Python.

* **En Windows (CMD - Símbolo del Sistema):**
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate
  ```

* **En Windows (PowerShell):**
  Si PowerShell te muestra un error indicando que *"la ejecución de scripts está deshabilitada en este sistema"*, primero ejecuta:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
  ```
  Luego, activa el entorno virtual:
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```

* **En macOS / Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

Una vez activado, verás `(.venv)` a la izquierda de la línea de comandos en tu terminal.

---

## 📦 Paso 3: Instalar Dependencias

Con el entorno virtual activado, instala todas las librerías necesarias con el siguiente comando:

```bash
pip install -r requirements.txt
```

*Las dependencias principales instaladas son:*
* **pandas** y **numpy** (Procesamiento de datos).
* **scikit-learn** (Modelos de K-Means y Regresión Lineal).
* **streamlit** (Interfaz web interactiva).
* **plotly** (Visualizaciones dinámicas).
* **cloudscraper** y **beautifulsoup4** (Bypass anti-bot y Web Scraping).
* **google-generativeai** (Llamados al LLM Gemini).
* **python-dotenv** (Gestión de variables de entorno).

---

## 🔑 Paso 4: Configurar la Clave de API de Gemini (Opcional)

Si deseas utilizar la inteligencia artificial para normalizar ofertas en el scraping, generar el informe estratégico ejecutivo en el dashboard, o chatear interactivamente en SQL mediante lenguaje natural:

1. Crea una copia del archivo `.env.example` y llámalo `.env` en la raíz del proyecto.
2. Abre el archivo `.env` recién creado con cualquier editor de texto.
3. Reemplaza el texto de prueba con tu API Key real de Google:
   ```env
   GEMINI_API_KEY="Tu_Clave_Real_De_Google_AI_Studio"
   ```

*Nota: Si no posees una API Key, la aplicación seguirá funcionando perfectamente utilizando un extractor heurístico local basado en expresiones regulares (Regex/NLP) preprogramado.*

---

## 🏃 Paso 5: Métodos de Ejecución

### Método A: Ejecución Directa de la Web App en Windows (El más rápido)
Si utilizas el sistema operativo Windows, hemos creado un script por lotes que automatiza los pasos previos de la aplicación web. Simplemente haz doble clic sobre el archivo:
👉 **`ejecutar_dashboard.bat`** (ubicado en la raíz del proyecto).

Este script de forma automática:
1. Comprueba si existe la carpeta `.venv` (si no existe, la crea e instala dependencias).
2. Activa el entorno virtual.
3. Lanza el dashboard de Streamlit de inmediato.

---

### Método B: Ejecución Manual en Terminal (Cualquier S.O.)

#### A. Iniciar el Dashboard Web de Streamlit
Ejecuta el servidor web local:
```bash
streamlit run src/app.py
```
* Tu navegador predeterminado se abrirá automáticamente en: `http://localhost:8501`.
* Si la consola te solicita ingresar un correo electrónico, presiona **ENTER** dejándolo en blanco.

#### B. Ejecutar el Pipeline de Ingesta y Modelado Estrella (Opcional)
Si deseas borrar los datos existentes y descargar nuevas vacantes reales desde cero, regenerando también las tablas del Modelo Estrella:
```bash
python src/pipeline.py             # Ejecuta scraping real + APIs + simulados
python src/exportador_estrella.py  # Genera dimensiones y hechos CSV en data/processed/modelo_estrella/
python src/modelo.py               # Re-entrena K-Means (Silhouette/PCA) y Regresión Lineal (R2)
```

---

### Método C: Ejecución y Visualización en Power BI Desktop

Hemos integrado el proyecto utilizando las últimas herramientas de desarrollo de Power BI (formato Developer Project PBIP).

1. Abre el archivo **`Analisis_Mercado_Laboral.pbip`** (o en su defecto `Analisis_Mercado_Laboral.pbix`) utilizando Power BI Desktop.
2. Si Power BI solicita actualizar los datos, haz clic en **Actualizar**. Se conectará a las tablas CSV locales de la carpeta `data/processed/modelo_estrella/` de forma relativa.
3. **Revisar Modelado Estrella:** Ve a la vista de Modelo a la izquierda para inspeccionar las relaciones estrella establecidas entre `Fact_Vacantes` y sus dimensiones.
4. **Revisar Transformaciones en Power Query:** Haz clic en **Transformar datos** en la barra superior. Al seleccionar las tablas `Fact_Vacantes` o `Dim_Puestos` o `Dim_Fecha`, podrás ver en el panel derecho los **Pasos aplicados** (ej. `Nivel Salarial Condicional`, `Categoria en Mayusculas`, etc.) codificados en lenguaje M.
5. **Revisar Medidas DAX:** En el panel de campos derecho, la tabla con icono de calculadora `Medidas` centraliza todas las fórmulas DAX implementadas para su validación (ej. *Total de Vacantes*, *Brecha Salarial IT*, *Porcentaje Remoto/Internacional*, etc.).
6. **Consultas de Lenguaje Natural (IA):** Navega hasta la pestaña **"Consultas de Lenguaje Natural"** en el reporte para probar el campo interactivo Q&A y chatear con los datos.

---

## 🛠️ Solución de Problemas Comunes (FAQ / Troubleshooting)

1. **"Streamlit no se reconoce como un comando interno o externo":**
   Asegúrate de que activaste el entorno virtual `.venv` antes de correr el comando. Verás `(.venv)` al inicio de la línea de comandos.

2. **"API key not valid / Límite de Cuota superado (429)":**
   Es un aviso normal si la clave del archivo `.env` está vacía o es errónea. El pipeline continuará su ejecución de manera exitosa usando el parser heurístico de respaldo local sin interrumpir el flujo.

3. **La tabla de fechas de Power BI arroja referencias cíclicas:**
   Esto ocurre si modificas la tabla de fechas en Power Query estando la opción de "Fecha y hora automáticas" habilitada en Power BI Desktop. El proyecto ya ha sido corregido para evitar este conflicto; asegúrate de no aplicar transformaciones en bruto sobre el campo `Mes_Nombre` de `Dim_Fecha` que alteren el ordenamiento.
