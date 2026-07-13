#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
exportador_estrella.py - Genera el modelo estrella (tablas de dimensiones y hechos)
para Power BI a partir de los datos procesados e inferidos de vacantes.
Grupo 4 - Gestión de la Información (Semestre I, 2026)
"""

import os
import logging
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PROC_DIR = os.path.join(BASE_DIR, "data", "processed")
MODEL_JOBS_PATH = os.path.join(DATA_PROC_DIR, "vacantes_modeladas.csv")
STAR_SCHEMA_DIR = os.path.join(DATA_PROC_DIR, "modelo_estrella")

os.makedirs(STAR_SCHEMA_DIR, exist_ok=True)

def generar_modelo_estrella():
    log.info("Iniciando exportación al Modelo Estrella para Power BI...")
    
    if not os.path.exists(MODEL_JOBS_PATH):
        log.error(f"No se encontró el archivo {MODEL_JOBS_PATH}. Ejecuta el pipeline y modelo de ML primero.")
        return
        
    df = pd.read_csv(MODEL_JOBS_PATH)
    log.info(f"Cargados {len(df)} registros de vacantes modeladas.")
    
    # 1. Dimensión: Dim_Empresas
    empresas_unicas = df["empresa"].fillna("Empresa Confidencial").unique()
    dim_empresas = pd.DataFrame({
        "ID_Empresa": range(1, len(empresas_unicas) + 1),
        "Nombre_Empresa": empresas_unicas
    })
    empresa_to_id = dict(zip(dim_empresas["Nombre_Empresa"], dim_empresas["ID_Empresa"]))
    
    # 2. Dimensión: Dim_Portales
    portales_unicos = df["portal"].fillna("Portal IT").unique()
    dim_portales = pd.DataFrame({
        "ID_Portal": range(1, len(portales_unicos) + 1),
        "Nombre_Portal": portales_unicos
    })
    portal_to_id = dict(zip(dim_portales["Nombre_Portal"], dim_portales["ID_Portal"]))
    
    # 3. Dimensión: Dim_Puestos
    puestos_df = df[["puesto", "categoria_rol"]].drop_duplicates().reset_index(drop=True)
    puestos_df["ID_Puesto"] = puestos_df.index + 1
    dim_puestos = puestos_df[["ID_Puesto", "puesto", "categoria_rol"]].rename(columns={"puesto": "Nombre_Puesto"})
    puesto_to_id = dict(zip(zip(dim_puestos["Nombre_Puesto"], dim_puestos["categoria_rol"]), dim_puestos["ID_Puesto"]))
    
    # 4. Dimensión: Dim_Clusters
    # Mapear de código de cluster y nombre a tabla única
    clusters_df = df[["cluster", "nombre_cluster"]].drop_duplicates().reset_index(drop=True)
    clusters_df.columns = ["ID_Cluster", "Nombre_Cluster"]
    # Rellenar nulos si hay
    clusters_df["ID_Cluster"] = clusters_df["ID_Cluster"].fillna(-1).astype(int)
    clusters_df["Nombre_Cluster"] = clusters_df["Nombre_Cluster"].fillna("Sin Clasificar")
    dim_clusters = clusters_df.sort_values(by="ID_Cluster").reset_index(drop=True)
    
    # 5. Dimensión: Dim_Fecha
    # Extraer fechas únicas
    df["fecha_publicacion"] = pd.to_datetime(df["fecha_publicacion"])
    fechas_unicas = df["fecha_publicacion"].dt.date.unique()
    # Generar rango de fechas continuo
    min_date = min(fechas_unicas)
    max_date = max(fechas_unicas)
    fechas_rango = pd.date_range(start=min_date, end=max_date)
    
    dim_fecha = pd.DataFrame({
        "ID_Fecha": fechas_rango.strftime("%Y-%m-%d"),
        "Fecha": fechas_rango,
        "Anio": fechas_rango.year,
        "Trimestre": fechas_rango.quarter,
        "Mes": fechas_rango.month,
        "Mes_Nombre": fechas_rango.strftime("%B"),
        "Semana": fechas_rango.isocalendar().week,
        "Dia": fechas_rango.day,
        "Dia_Semana_Nombre": fechas_rango.strftime("%A")
    })
    
    # 6. Dimensión: Dim_Habilidades
    all_skills = set()
    for s_list in df["habilidades"].dropna().str.split(","):
        for s in s_list:
            if s.strip():
                all_skills.add(s.strip())
    
    dim_habilidades = pd.DataFrame({
        "ID_Habilidad": range(1, len(all_skills) + 1),
        "Nombre_Habilidad": sorted(list(all_skills))
    })
    habilidad_to_id = dict(zip(dim_habilidades["Nombre_Habilidad"], dim_habilidades["ID_Habilidad"]))

    # 7. Tabla de Hechos: Fact_Vacantes
    fact_vacantes = pd.DataFrame()
    fact_vacantes["ID_Vacante"] = df["id"]
    
    # Mapear llaves foráneas
    fact_vacantes["ID_Empresa"] = df["empresa"].fillna("Empresa Confidencial").map(empresa_to_id)
    fact_vacantes["ID_Portal"] = df["portal"].fillna("Portal IT").map(portal_to_id)
    
    # Mapear ID Puesto
    puesto_tuples = list(zip(df["puesto"], df["categoria_rol"]))
    fact_vacantes["ID_Puesto"] = [puesto_to_id.get(t, -1) for t in puesto_tuples]
    
    fact_vacantes["ID_Cluster"] = df["cluster"].fillna(-1).astype(int)
    fact_vacantes["ID_Fecha"] = df["fecha_publicacion"].dt.strftime("%Y-%m-%d")
    
    # Métricas y dimensiones de hechos
    fact_vacantes["Salario_Min"] = df["salario_min"]
    fact_vacantes["Salario_Max"] = df["salario_max"]
    fact_vacantes["Salario_Medio"] = (df["salario_min"] + df["salario_max"]) / 2
    fact_vacantes["Experiencia_Anios"] = df["experiencia_anios"].round().astype(int)
    fact_vacantes["Es_Simulado"] = df["es_simulado"].astype(int)
    fact_vacantes["PCA_X"] = df["pca_x"]
    fact_vacantes["PCA_Y"] = df["pca_y"]
    
    # 8. Tabla de Hechos / Puente: Fact_Vacante_Habilidad
    vacante_habilidad_list = []
    for _, row in df.iterrows():
        v_id = row["id"]
        skills_str = row["habilidades"]
        if pd.isna(skills_str) or not skills_str.strip():
            continue
        skills = [s.strip() for s in skills_str.split(",") if s.strip()]
        for skill in skills:
            h_id = habilidad_to_id.get(skill)
            if h_id:
                vacante_habilidad_list.append({
                    "ID_Vacante": v_id,
                    "ID_Habilidad": h_id
                })
    fact_vacante_habilidad = pd.DataFrame(vacante_habilidad_list)
    
    # Guardar en CSV
    dim_empresas.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Empresas.csv"), index=False, encoding="utf-8-sig")
    dim_portales.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Portales.csv"), index=False, encoding="utf-8-sig")
    dim_puestos.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Puestos.csv"), index=False, encoding="utf-8-sig")
    dim_clusters.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Clusters.csv"), index=False, encoding="utf-8-sig")
    dim_fecha.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Fecha.csv"), index=False, encoding="utf-8-sig")
    dim_habilidades.to_csv(os.path.join(STAR_SCHEMA_DIR, "Dim_Habilidades.csv"), index=False, encoding="utf-8-sig")
    fact_vacantes.to_csv(os.path.join(STAR_SCHEMA_DIR, "Fact_Vacantes.csv"), index=False, encoding="utf-8-sig")
    fact_vacante_habilidad.to_csv(os.path.join(STAR_SCHEMA_DIR, "Fact_Vacante_Habilidad.csv"), index=False, encoding="utf-8-sig")
    
    log.info(f"Modelo Estrella exportado exitosamente en: {STAR_SCHEMA_DIR}")

if __name__ == "__main__":
    generar_modelo_estrella()
