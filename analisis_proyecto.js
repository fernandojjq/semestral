const docx = require("docx");
const fs = require("fs");

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, TabStopPosition, TabStopType,
  PageBreak, ShadingType, Table, TableRow, TableCell,
  WidthType, TableBorders, VerticalAlign
} = docx;

// Helper for horizontal rule
const hrule = () => new Paragraph({
  spacing: { before: 120, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" } }
});

// Helper for body text
const body = (text, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 276 },
  ...opts,
  children: [new TextRun({ text, size: 22, font: "Calibri", ...opts.run })]
});

const bold = (text, opts = {}) => new Paragraph({
  spacing: { after: 80, line: 276 },
  ...opts,
  children: [new TextRun({ text, bold: true, size: 22, font: "Calibri" })]
});

const bullet = (text, level = 0) => new Paragraph({
  spacing: { after: 60 },
  numbering: { reference: "bullets", level },
  children: [new TextRun({ text, size: 22, font: "Calibri" })]
});

const bulletBold = (label, desc) => new Paragraph({
  spacing: { after: 60 },
  numbering: { reference: "bullets", level: 0 },
  children: [
    new TextRun({ text: label, bold: true, size: 22, font: "Calibri" }),
    new TextRun({ text: desc, size: 22, font: "Calibri" })
  ]
});

// Table helper
function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: "2563EB" },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, bold: true, size: 20, font: "Calibri", color: "FFFFFF" })]
      })]
    }))
  });
  const dataRows = rows.map(r => new TableRow({
    children: r.map((cell, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: String(cell), size: 20, font: "Calibri" })]
      })]
    }))
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [
        { level: 0, format: docx.LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: docx.LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
      ]
    }]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }
    },
    children: [
      // TITLE
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Análisis Técnico del Proyecto", size: 36, bold: true, font: "Calibri", color: "1E3A8A" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Mercado Laboral IT Panamá — Dashboard Interactivo", size: 28, font: "Calibri", color: "4B5563" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Gestión de la Información · Semestre I, 2026 · Grupo 4 (FISC-UTP)", size: 22, font: "Calibri", color: "6B7280" })]
      }),
      hrule(),

      // 1. PROJECT OVERVIEW
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "1. Visión General del Proyecto", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      body("Este proyecto es un sistema end-to-end de análisis del mercado laboral IT en Panamá, construido enteramente en Python. Cubre las cuatro etapas clásicas de un proyecto de ciencia de datos: ingesta de datos (web scraping + APIs), procesamiento con LLM, modelado de Machine Learning, y visualización interactiva mediante un dashboard en Streamlit."),

      body("El objetivo académico es demostrar cómo las técnicas de gestión de la información —desde la captura automatizada hasta la presentación ejecutiva— se integran para producir inteligencia de negocio accionable sobre el ecosistema tecnológico panameño."),

      // 2. ARCHITECTURE
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "2. Arquitectura y Estructura de Archivos", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      makeTable(
        ["Archivo", "Líneas", "Responsabilidad"],
        [
          ["src/pipeline.py", "~856", "Ingesta: scraping (Computrabajo, Konzerta), APIs (Arbeitnow paginada, RemoteOK fallback), extracción con Gemini LLM / heurístico regex, generación de simulados, persistencia SQLite + CSV"],
          ["src/modelo.py", "~275", "ML: K-Means clustering (TF-IDF + PCA 2D + Silhouette Score) y regresión lineal temporal de habilidades con R² y clasificación de confiabilidad"],
          ["src/exportador_estrella.py", "~153", "Power BI: genera modelo estrella (6 dimensiones + 2 tablas de hechos) en CSVs listos para importar"],
          ["src/app.py", "~1121", "Dashboard Streamlit: 5 pestañas (mercado, clusters, tendencias, informe IA, chat SQL), 8 KPIs, filtros interactivos con session_state"],
          ["requirements.txt", "11", "Dependencias: pandas, numpy, scikit-learn, streamlit, plotly, google-generativeai, cloudscraper, beautifulsoup4, pydantic, python-dotenv, requests"],
        ],
        [2800, 900, 5740]
      ),

      new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: "Flujo de datos:", bold: true, size: 22, font: "Calibri" })] }),
      body("Scraping/APIs → Gemini LLM (o heurístico regex como fallback) → SQLite (esquema normalizado con 3 tablas: vacantes, habilidades, vacante_habilidad) → CSV desnormalizado → K-Means + Regresión Lineal → CSVs modelados → Dashboard Streamlit + Modelo Estrella para Power BI."),

      // 3. PIPELINE
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "3. Pipeline de Ingesta (pipeline.py)", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "3.1 Fuentes de datos", bold: true, size: 24, font: "Calibri" })] }),

      makeTable(
        ["Fuente", "Tipo", "Clasificación", "Detalle"],
        [
          ["Computrabajo Panamá", "Web scraping", "Panamá", "cloudscraper para bypass Cloudflare, múltiples selectores CSS robustos, max 15 tarjetas"],
          ["Konzerta Panamá", "Web scraping", "Panamá", "3 URLs de fallback, selectores genéricos por regex, max 15 tarjetas"],
          ["Arbeitnow API", "API REST pública", "Externos", "Paginación hasta 5 páginas, filtro por keywords técnicas (27 términos), sin auth"],
          ["RemoteOK API", "API REST pública", "Externos", "Fallback si Arbeitnow falla, primeros 40 registros"],
          ["Generador simulado", "Sintético", "Mixto", "~200 vacantes con distribución uniforme de skills (sin sesgo temporal), 17 empresas panameñas reales, rango de 6 meses"],
        ],
        [2200, 1600, 1400, 4240]
      ),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "3.2 Extracción inteligente con LLM", bold: true, size: 24, font: "Calibri" })] }),
      body("Cada vacante cruda pasa por Gemini (probando una cadena de modelos: gemini-3.1-flash-lite → gemini-2.5-flash-lite → gemini-3.5-flash → gemini-3-flash → gemini-2.5-flash) para extraer campos estructurados via JSON: puesto normalizado, habilidades técnicas, rango salarial en USD, años de experiencia, y categoría de rol (8 categorías: Frontend, Backend, Fullstack, Data & Analytics, Mobile, DevOps & Cloud, Soporte & IT, Gestión & Agile)."),
      body("Si la API Key no está disponible o la cuota se agota (error 429), se activa un parser heurístico local basado en regex: un diccionario de ~45 habilidades técnicas con nombre normalizado, extracción de salarios en formato B/./USD/$, y clasificación de categoría por keywords. Este fallback garantiza que el pipeline nunca falla por dependencia externa."),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "3.3 Persistencia", bold: true, size: 24, font: "Calibri" })] }),
      body("Los datos se guardan en SQLite con esquema normalizado (3 tablas con foreign keys y ON DELETE CASCADE). Se exporta un CSV desnormalizado con habilidades concatenadas por coma para consumo directo por pandas/ML. La columna es_simulado (0/1) permite distinguir datos reales de simulados en cualquier punto del análisis."),

      // 4. ML
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "4. Modelos de Machine Learning (modelo.py)", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "4.1 K-Means Clustering", bold: true, size: 24, font: "Calibri" })] }),
      bulletBold("Vectorización: ", "TF-IDF sobre las habilidades de cada vacante (tokenizer que acepta puntos, # y guiones para capturar tokens como C#, .NET, Node.js)."),
      bulletBold("Agrupamiento: ", "K-Means con k=4 clusters, n_init=10, random_state=42."),
      bulletBold("Evaluación: ", "Silhouette Score (métrica coseno). Se clasifica como buena (>0.5), débil (0.2–0.5), o pobre (<0.2)."),
      bulletBold("Visualización: ", "PCA de 2 componentes sobre la matriz TF-IDF para proyección en plano cartesiano interactivo."),
      bulletBold("Etiquetado: ", "Asignación greedy de etiquetas únicas (Frontend/UI Web, Data & Analytics/BI, DevOps & Cloud, Backend/Core Systems) basada en scoring de keywords contra los top 10 términos de cada centroide. Garantiza que dos clusters nunca reciben la misma etiqueta."),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "4.2 Regresión Lineal Temporal", bold: true, size: 24, font: "Calibri" })] }),
      bulletBold("Granularidad adaptativa: ", "si el rango de fechas < 90 días, agrupa por semana; si ≥ 90 días, agrupa por quincena."),
      bulletBold("Métrica: ", "R² por habilidad. Si R² < 0.2 o hay menos de 3 periodos, la tendencia se marca como 'No confiable' en lugar de afirmarla — honestidad estadística."),
      bulletBold("Clasificación: ", "Emergente/Crecimiento Rápido (pendiente > 0.3), Crecimiento Estable (> 0.05), Madura/Estable, En Declive (< -0.3)."),
      bulletBold("Predicción: ", "Proyecta la demanda porcentual al siguiente periodo usando el modelo lineal ajustado, con floor en 0%."),

      // 5. STAR SCHEMA
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "5. Modelo Estrella para Power BI (exportador_estrella.py)", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),
      body("Genera 8 archivos CSV en data/processed/modelo_estrella/ con un esquema de estrella clásico para importación directa en Power BI:"),

      makeTable(
        ["Tabla", "Tipo", "Campos clave"],
        [
          ["Dim_Empresas", "Dimensión", "ID_Empresa, Nombre_Empresa"],
          ["Dim_Portales", "Dimensión", "ID_Portal, Nombre_Portal"],
          ["Dim_Puestos", "Dimensión", "ID_Puesto, Nombre_Puesto, categoria_rol"],
          ["Dim_Clusters", "Dimensión", "ID_Cluster, Nombre_Cluster"],
          ["Dim_Fecha", "Dimensión", "ID_Fecha, Fecha, Año, Trimestre, Mes, Semana, Día"],
          ["Dim_Habilidades", "Dimensión", "ID_Habilidad, Nombre_Habilidad"],
          ["Fact_Vacantes", "Hechos", "ID_Vacante, FK a todas las dimensiones, Salario_Min/Max/Medio, Experiencia, Es_Simulado, PCA_X/Y"],
          ["Fact_Vacante_Habilidad", "Puente M:N", "ID_Vacante, ID_Habilidad"],
        ],
        [3000, 1400, 5040]
      ),

      // 6. DASHBOARD
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "6. Dashboard Interactivo (app.py)", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "6.1 Sistema de filtros del sidebar", bold: true, size: 24, font: "Calibri" })] }),
      body("Todos los filtros usan st.session_state con keys centralizados en FILTER_DEFAULTS, lo que permite un botón 'Restablecer todos los filtros' que resetea todo en un solo click. Cada multiselect tiene botones 'Todas'/'Ninguna' para selección/deselección masiva."),
      bullet("Búsqueda de texto libre (puesto o título original)"),
      bullet("Categorías de Rol — multiselect con atajos Todas/Ninguna"),
      bullet("Portales de Origen — multiselect con atajos Todos/Ninguno"),
      bullet("Origen de Ofertas — radio button: Todos / Panamá / Externos"),
      bullet("Habilidades Técnicas — multiselect con atajos Todas/Ninguna"),
      bullet("Rango Salarial Mensual (slider USD $500–$10,000)"),
      bullet("Años de Experiencia (slider 0–10)"),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "6.2 KPIs (8 tarjetas con gradientes y hover)", bold: true, size: 24, font: "Calibri" })] }),
      body("Fila 1: Ofertas Activas, Salario Mínimo Promedio, Salario Máximo Promedio, Habilidad Más Solicitada. Fila 2: Experiencia Promedio, Brecha Salarial Máx-Mín (%), Valor por Año de Experiencia, Porcentaje de Empleo Remoto/Internacional. Todos reactivos a los filtros."),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "6.3 Pestañas", bold: true, size: 24, font: "Calibri" })] }),
      bulletBold("Visión General del Mercado: ", "Top 10 habilidades (barras horizontales), distribución salarial por categoría (box plot), tabla de detalle filtrable."),
      bulletBold("Clustering de Perfiles (ML): ", "Scatter plot PCA 2D interactivo con Plotly, Silhouette Score métrico, 4 tarjetas de cluster con top skills y estadísticas."),
      bulletBold("Habilidades Emergentes: ", "Tabla de tendencias con pendiente, R², frecuencia actual y proyectada; bar chart del top 5 habilidades emergentes."),
      bulletBold("Conclusiones con IA: ", "Botón para generar informe ejecutivo vía Gemini (cadena de 5 modelos); fallback a informe heurístico si no hay API Key."),
      bulletBold("Chat de Consultas (IA): ", "Interfaz tipo chatbot donde el usuario escribe preguntas en lenguaje natural. Gemini genera SQL, lo ejecuta contra SQLite, y responde con explicación + dataframe + query expandible."),

      // 7. CSS
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "6.4 CSS personalizado", bold: true, size: 24, font: "Calibri" })] }),
      bullet("Tarjetas de métricas con gradientes (4 variantes de color) + efectos hover (translateY + sombra) + soporte dark mode vía @media prefers-color-scheme"),
      bullet("Tarjetas de cluster con colores fijos (!important) para legibilidad independiente del tema"),
      bullet("Icono '+' azul circular reemplazando la flecha de dropdown en los multiselect del sidebar"),
      bullet("Ocultación del botón 'Clear all' (x) en los multiselect"),
      bullet("Contenedor de insights IA con gradientes adaptativos claro/oscuro"),

      // PAGE BREAK
      new Paragraph({ children: [new PageBreak()] }),

      // 8. NEW FEATURES
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "7. Mejoras Implementadas sobre la Versión Anterior", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),
      body("La versión anterior del proyecto (analisis-mercado-laboral-it-panama-main, ~855 líneas en app.py) fue mejorada en una sesión de trabajo previa. Estas mejoras se portaron a la versión actual (semestral-main) junto con nuevas adiciones propias de esta versión."),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "7.1 Mejoras portadas desde la versión anterior", bold: true, size: 24, font: "Calibri" })] }),

      bulletBold("Botones de atajo en sidebar: ", "Todas/Ninguna para Categorías y Portales, botón de reset global. Implementados con callbacks on_click sobre st.session_state para evitar race conditions con los widgets de Streamlit."),
      bulletBold("CSS de cluster cards con colores fijos: ", "Se reemplazaron las CSS variables (var(--secondary-background-color)) por valores !important fijos (#F3F4F6 fondo, #111827 texto), eliminando problemas de legibilidad cuando el usuario tiene Streamlit en modo oscuro."),
      bulletBold("Icono '+' personalizado en multiselects: ", "CSS que oculta la flecha SVG nativa y dibuja un círculo azul con '+' usando ::after pseudo-element. Incluye efecto hover (scale + color shift). Usa el selector :has() (Chrome/Edge modernos)."),
      bulletBold("Ocultación del botón 'Clear all': ", "CSS que oculta el SVG con title='Clear all' en los multiselect del sidebar, reemplazado por los botones Todas/Ninguna explícitos."),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "7.2 Funcionalidades nuevas de semestral-main", bold: true, size: 24, font: "Calibri" })] }),

      bulletBold("Fila 2 de KPIs: ", "4 tarjetas adicionales (Experiencia Promedio, Brecha Salarial, Valor/Año Experiencia, % Empleo Remoto) que no existían en la versión anterior."),
      bulletBold("Pestaña de Chat SQL con IA: ", "Interfaz tipo chatbot donde Gemini convierte preguntas en lenguaje natural a SQL, ejecuta contra SQLite, y presenta resultados con explicación. Incluye historial de mensajes persistido en session_state."),
      bulletBold("Exportador de Modelo Estrella: ", "Nuevo módulo exportador_estrella.py que genera 8 CSVs con esquema dimensional para Power BI (6 dimensiones + 2 tablas de hechos)."),
      bulletBold("Paginación de Arbeitnow API: ", "La versión anterior consultaba una sola página (~8 vacantes IT); ahora pagina hasta 5 páginas, multiplicando la cantidad de datos reales."),
      bulletBold("Pipeline ejecutable desde UI: ", "Botón en el dashboard que ejecuta pipeline + modelado + exportación estrella cuando no hay datos procesados, sin necesidad de terminal."),
      bulletBold("Filtro de Origen Geográfico: ", "Radio button en sidebar para separar ofertas de Panamá (Computrabajo + Konzerta) de ofertas externas (Arbeitnow API). LinkedIn/simulados pasan siempre para mantener volumen."),
      bulletBold("Botones Todas/Ninguna en Habilidades: ", "El filtro de habilidades técnicas ahora tiene los mismos atajos de selección masiva que categorías y portales, uniformizando la experiencia."),
      bulletBold("Rangos de filtro ampliados: ", "Salario hasta $10,000 (antes $5,000) y experiencia hasta 10 años (antes 5), reflejando mejor la realidad del mercado IT."),

      // 8. TECH STACK
      new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: "8. Stack Tecnológico", bold: true, size: 28, font: "Calibri", color: "1E3A8A" })] }),

      makeTable(
        ["Capa", "Tecnologías"],
        [
          ["Scraping", "cloudscraper (bypass Cloudflare), BeautifulSoup4, requests"],
          ["APIs", "Arbeitnow REST (paginada), RemoteOK REST (fallback)"],
          ["NLP / LLM", "Google Gemini API (cadena de 5 modelos), Pydantic para validación JSON, regex heurístico como fallback"],
          ["Base de datos", "SQLite (esquema normalizado 3NF con FK y CASCADE)"],
          ["Machine Learning", "scikit-learn (KMeans, PCA, LinearRegression, TfidfVectorizer, silhouette_score)"],
          ["Visualización", "Streamlit (dashboard), Plotly Express (gráficos interactivos)"],
          ["BI Export", "pandas → CSVs de modelo estrella para Power BI"],
          ["Validación", "Pydantic v2 (schema de VacanteProcesada)"],
          ["Config", "python-dotenv (.env para GEMINI_API_KEY)"],
        ],
        [2200, 7240]
      ),

      hrule(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "Grupo 4 — FISC-UTP — Gestión de la Información — Julio 2026", size: 20, font: "Calibri", color: "6B7280", italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const outPath = "/sessions/eager-modest-bell/mnt/Gestion de la Informacion/Proyecto Final/semestral-main/Analisis_Tecnico_Proyecto.docx";
  fs.writeFileSync(outPath, buf);
  console.log("DOCX written to:", outPath);
});
