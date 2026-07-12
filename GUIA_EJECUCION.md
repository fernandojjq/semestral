# Guía de Configuración y Ejecución desde Cero 🚀

Esta guía detalla los pasos necesarios para clonar, configurar, instalar dependencias y ejecutar de forma local el proyecto **Parcial 2 de Gestión de la Información** de la **FISC - UTP (Semestre I, 2026)**.

---

## 📋 Prerrequisitos

Asegúrate de contar con lo siguiente instalado en tu equipo antes de comenzar:
1. **Python 3.9 o superior** (Durante la instalación en Windows, asegúrate de marcar la casilla *"Add Python to PATH"*).
2. **Git** (Para clonar el repositorio).
3. Conexión a Internet activa.
4. **Opcional:** Una clave API de Google Gemini (puedes obtener una gratis en [Google AI Studio](https://aistudio.google.com/apikey)).

---

## 🛠️ Paso 1: Clonar el Repositorio

Abre la terminal de tu sistema operativo (Símbolo del Sistema / CMD, PowerShell o Terminal de macOS/Linux) y clona esta nueva versión del repositorio:

```bash
git clone https://github.com/Shazzy004/Parcial2Gestion.git
cd Parcial2Gestion
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

Si deseas utilizar la inteligencia artificial para normalizar ofertas en el scraping o generar el informe estratégico ejecutivo en el dashboard:

1. Crea una copia del archivo `.env.example` y llámalo `.env` en la raíz del proyecto.
2. Abre el archivo `.env` recién creado con cualquier editor de texto.
3. Reemplaza el texto de prueba con tu API Key real de Google:
   ```env
   GEMINI_API_KEY="Tu_Clave_Real_De_Google_AI_Studio"
   ```

*Nota: Si no posees una API Key, la aplicación seguirá funcionando perfectamente utilizando un robusto extractor heurístico local basado en expresiones regulares (Regex/NLP) preprogramado.*

---

## 🏃 Paso 5: Métodos de Ejecución

### Método A: Ejecución Directa en Windows (El más rápido)
Si utilizas el sistema operativo Windows, hemos creado un script por lotes que automatiza los pasos previos. Simplemente haz doble clic sobre el archivo:
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
* Si la consola te solicita ingresar un correo electrónico (*"Welcome to Streamlit! Email:"*), puedes **presionar ENTER** dejándolo en blanco para continuar.

#### B. Ejecutar el Pipeline de Ingesta desde Cero (Opcional)
Si deseas borrar la base de datos pre-cargada y forzar una nueva descarga en vivo de vacantes de empleo mediante scraping y APIs:
```bash
python src/pipeline.py
```
Este pipeline:
* Realiza web scraping real en *Computrabajo* y *Konzerta*.
* Consume la API pública de *Arbeitnow* paginando hasta 5 páginas e intenta *RemoteOK* como fallback real.
* Añade un bloque de 150 registros simulados para análisis histórico temporal de tendencias.
* Estructura los datos con Gemini (o el parser heurístico local) y los guarda en SQLite y CSV.

#### C. Entrenar los Modelos de Machine Learning (Opcional)
Para re-entrenar el K-Means y calcular la Regresión Lineal de tendencias de habilidades sobre los nuevos datos guardados:
```bash
python src/modelo.py
```

---

## 🛠️ Solución de Problemas Comunes (FAQ / Troubleshooting)

1. **"Streamlit no se reconoce como un comando interno o externo":**
   Asegúrate de que activaste el entorno virtual `.venv` antes de correr el comando. Verás `(.venv)` al inicio de la línea de comandos.

2. **"API key not valid / Límite de Cuota superado (429)":**
   Es un aviso normal si la clave del archivo `.env` está vacía o es errónea. El pipeline continuará su ejecución de manera exitosa usando el parser heurístico de respaldo local sin interrumpir el flujo.

3. **No se ven reflejados los nuevos datos en el Dashboard:**
   Si corriste el pipeline de nuevo por consola y no ves los cambios en la página web, haz clic en el botón **`🔄 Recargar datos`** en la barra lateral izquierda del Dashboard para limpiar la caché de Streamlit.
