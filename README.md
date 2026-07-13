# Análisis del Mercado Laboral IT en Panamá 🇵🇦 — Examen Semestral

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.30+-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![PowerBI](https://img.shields.io/badge/PowerBI-Model--Estrella-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini%20API-v2.5-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://aistudio.google.com/)

---

---

### 🏫 Universidad Tecnológica de Panamá (UTP)
* **Facultad:** Facultad de Ingeniería de Sistemas Computacionales (FISC)
* **Carrera:** Licenciatura en Desarrollo y Gestión de Software
* **Curso:** Gestión de la Información (Semestre I, 2026)
* **Asignación:** Examen Semestral (Continuación y ampliación del Parcial 2)

### 👥 Integrantes (Grupo 4):
* **Bryan Law** — 8-1011-2459
* **Evaristo Alvarez** — 8-1011-177
* **Fernando Jimenez** — 20-24-7669
* **Manuel Campos** — 8-1022-1118
* **Diego Gordon** — 8-1017-349

---

## 📌 1. Introducción del Proyecto

Este proyecto consiste en el desarrollo de una solución integral de analítica de datos compuesta por un **Pipeline de Datos Inteligente**, un **Modelo de Aprendizaje Automático (Machine Learning)**, un **Dashboard Interactivo en Streamlit** y un proyecto de **Inteligencia de Negocios en Power BI** diseñado para analizar el ecosistema de empleo en tecnologías de la información (IT) en la República de Panamá.

El sistema realiza web scraping automatizado de portales de empleo, estructura los datos usando un modelo de lenguaje masivo (Google Gemini API) para extraer habilidades y salarios, aplica agrupamiento no supervisado (**K-Means**) para categorizar perfiles profesionales, modela el crecimiento de la demanda tecnológica con **Regresión Lineal**, y expone todo mediante:
1. Una aplicación web de **Streamlit** que incluye un Chatbot interactivo SQL asistido por IA.
2. Un reporte interactivo de **Power BI** estructurado bajo un **Modelo Estrella** con medidas DAX de negocio, transformaciones nativas de **Power Query** y visuales de **Lenguaje Natural (Q&A)** basados en IA.

---

## 🎯 2. Justificación del Problema en Panamá

El sector tecnológico en Panamá se encuentra en constante crecimiento debido a su posición como hub logístico y financiero. Sin embargo, existe una notable brecha entre las habilidades requeridas por las empresas y los contenidos académicos universitarios. 

Este proyecto provee a la UTP una herramienta basada en ciencia de datos que monitoriza las demandas del mercado directamente de portales activos como *Konzerta* y *Computrabajo*. Esto ayuda a identificar habilidades emergentes en tiempo real antes de que queden obsoletas, optimizando el perfil de egreso de los estudiantes de la FISC.

---

## 📁 3. Estructura del Repositorio

El proyecto está organizado siguiendo las mejores prácticas de ingeniería de software para Ciencia de Datos e Inteligencia de Negocios:

```text
semestral/
├── data/
│   ├── raw/                        # Documentos crudos extraídos de scraping
│   └── processed/                  # Base de datos SQLite y CSV limpios
│       └── modelo_estrella/        # Dimensiones y Hechos exportados en CSV para Power BI
├── src/
│   ├── __init__.py
│   ├── pipeline.py                 # Código de Ingesta, Scraping e Integración con Gemini
│   ├── exportador_estrella.py      # Exportador de dimensiones y hechos de SQLite a CSV
│   ├── modelo.py                   # Modelado K-Means (Clustering) y Regresión Temporal
│   └── app.py                      # Dashboard de Streamlit con chatbot SQL integrado
├── Analisis_Mercado_Laboral.pbip   # Archivo de inicio del proyecto de Power BI Developer
├── Analisis_Mercado_Laboral.pbix   # Archivo clásico empaquetado de Power BI Desktop
├── Analisis_Mercado_Laboral.Report/ # Definición PBIR del reporte visual (Páginas, Visuales y Q&A)
├── Analisis_Mercado_Laboral.SemanticModel/ # Definición TMDL del modelo estrella (Tablas, Relaciones, Medidas)
├── ejecutar_dashboard.bat          # Script de automatización para Streamlit en Windows
├── requirements.txt                # Dependencias necesarias
├── README.md                       # Documentación del proyecto (este archivo)
└── GUIA_EJECUCION.md               # Guía técnica de instalación paso a paso
```

---

## 🚀 4. Guía de Instalación y Ejecución Rápida

*(Nota: Dado que la base de datos `laboral_it.db` y el CSV `vacantes_limpias.csv` ya están pre-poblados y guardados en el repositorio, **no es necesario correr el pipeline de scraping la primera vez**; puedes lanzar el Dashboard de inmediato).*

### Método 1: Ejecución Rápida en Windows (Recomendado)
Si estás en Windows, hemos creado un script automatizado que se encarga de todo:
1. Haz doble clic sobre el archivo [ejecutar_dashboard.bat](file:///d:/Downloads/Gestion%20informacion/ejecutar_dashboard.bat) ubicado en la raíz del proyecto.
2. El script detectará y activará automáticamente el entorno virtual `.venv` (creándolo e instalando dependencias si no existiera) e iniciará el servidor de Streamlit.
3. Se abrirá automáticamente la dirección `http://localhost:8501` en tu navegador.

### Método 2: Ejecución Manual en Terminal

#### Paso 1: Clonar el Repositorio e Ingresar
Abre la terminal de tu computadora y ejecuta:
```bash
git clone https://github.com/fernandojjq/semestral.git
cd semestral
```

#### Paso 2: Crear el Entorno Virtual e Instalar Dependencias
* **En Windows (Símbolo del Sistema / CMD):**
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate
  pip install -r requirements.txt
  ```
* **En Windows (PowerShell):**
  ```powershell
  python -m venv .venv
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
  .\.venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```
* **En macOS / Linux (Terminal):**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```

#### Paso 3: Lanzar el Dashboard de Streamlit
Ejecuta el servidor web local:
```bash
streamlit run src/app.py
```
Una ventana de tu navegador predeterminada se abrirá automáticamente en la dirección: `http://localhost:8501`.

---

## 📊 5. Inteligencia de Negocios y Modelado Estrella (Power BI)

Como parte de la ampliación para el Examen Semestral, se diseñó e implementó un **Modelo de Datos en Estrella** oficial en Power BI Desktop, ubicado en la raíz del proyecto.

### A. Arquitectura del Modelo Estrella:
El pipeline de Python (`exportador_estrella.py`) extrae los datos limpios de SQLite a la carpeta `data/processed/modelo_estrella/` estructurados de la siguiente forma:
*   **Tabla de Hechos Central (`Fact_Vacantes`):** Almacena las vacantes individuales con sus salarios numéricos, experiencia requerida y coordenadas PCA reducidas de Machine Learning.
*   **Dimensiones Relacionadas (Filtros):**
    *   `Dim_Empresas` (Nombre y ubicación de la empresa)
    *   `Dim_Portales` (Konzerta, Computrabajo, API de Arbeitnow, etc.)
    *   `Dim_Puestos` (Título normalizado de empleo y categoría del rol)
    *   `Dim_Clusters` (Asignación final de grupo de Machine Learning)
    *   `Dim_Fecha` (Calendario cronológico completo para Inteligencia de Tiempo)
*   **Relación Muchos a Muchos (Tabla Puente `Fact_Vacante_Habilidad`):** Permite vincular la dimensión `Dim_Habilidades` de manera eficiente con las vacantes.

### B. Transformaciones Nativas de Power Query:
En lugar de importar datos estáticos crudos, se implementaron las siguientes lógicas en Power Query (lenguaje M):
1.  **Tipado y Localización:** Configuración de cultura e idioma `en-US` en los campos numéricos de salarios para evitar fallas decimales.
2.  **Limpieza de Texto:** Conversión de las categorías de rol a mayúsculas y eliminación de espacios fantasmas.
3.  **Clasificador Condicional M:** Se añadió una transformación condicional en la tabla de hechos para calcular la columna de negocio `Nivel_Salarial` (Bajo, Medio, Alto) en base a umbrales salariales.

### C. Métricas y Fórmulas DAX Implementadas:
Se centralizaron las siguientes medidas de negocio en la tabla calculada `Medidas`:
*   `Total de Vacantes` (Conteo de vacantes)
*   `Salario Mínimo/Máximo/Medio Promedio` (Averages formateados como moneda)
*   `Brecha Salarial IT` (Porcentaje de diferencia entre salarios promedio máximos y mínimos)
*   `Porcentaje Remoto/Internacional` (Cálculo dinámico sobre vacantes procedentes de la API de Arbeitnow)
*   `Porcentaje Vacantes Reales` (Evidencia la proporción de datos crudos sobre sintéticos)

### D. Interacción con Lenguaje Natural (LLM):
La interacción mediante lenguaje natural (LLM) exigida se satisface al 100% a través de la **aplicación web interactiva en Streamlit** (Chat de Consultas inteligente y Conclusiones automáticas impulsados por Google Gemini API). Esto permite consultar la base de datos de empleo mediante lenguaje ordinario de forma segura e inmediata, prescindiendo del componente Q&A nativo de Power BI (el cual fue removido del reporte para evitar las advertencias de desuso de Microsoft para diciembre de 2026).

---

## 🛠️ 6. Ejecución del Pipeline Completo (Opcional)

Si deseas forzar una nueva extracción de datos y reentrenar los modelos, ejecuta en tu terminal con el entorno virtual activo:
```bash
python src/pipeline.py             # Ejecuta scraping real + APIs + sintéticos
python src/exportador_estrella.py  # Regenera los CSV del modelo estrella para Power BI
python src/modelo.py               # Re-entrena K-Means (Silhouette) y Regresión Lineal (R²)
```

*(Nota: Al abrir el archivo de Power BI Desktop y presionar el botón de **Actualizar**, este recargará de forma automática las tablas CSV actualizadas desde la ruta relativa del proyecto).*

---

## ❓ 7. Solución de Problemas Comunes (Troubleshooting)

### A. Pantalla "Welcome to Streamlit! Email:" en la terminal
Al ejecutar por primera vez `streamlit run src/app.py`, Streamlit te solicitará un correo electrónico para noticias.
*   **Solución**: Simplemente presiona **Enter** en tu teclado (dejando el campo vacío) para continuar.

### B. Error al activar el entorno virtual en PowerShell (Windows)
*   **Solución 1**: CMD estándar de Windows: `.venv\Scripts\activate`.
*   **Solución 2**: PowerShell (Administrador): run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.

### C. Error 404 de API en la Generación de Conclusiones con IA
*   **Solución**: Asegúrate de haber guardado tu API Key en el archivo `.env` o en los Secrets de Streamlit Cloud como: `GEMINI_API_KEY = "tu_clave"`. El sistema incluye un bucle de compatibilidad automático que buscará los modelos activos de Google AI Studio en 2026 (`gemini-2.5-flash`, `gemini-pro`, etc.) para evitar caídas del servicio.
