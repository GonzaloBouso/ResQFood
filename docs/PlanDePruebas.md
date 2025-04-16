# 🧪 Plan de Pruebas – ResQFood

## 📑 Índice

1. 🎯 [Objetivos y Alcance](#1-objetivos-y-alcance)  
2. 🧠 [Estrategia de Pruebas](#2-estrategia-de-pruebas)  
3. 🚦 [Criterios de Entrada y Salida](#3-criterios-de-entrada-y-salida)  
4. 🧰 [Recursos y Herramientas](#4-recursos-y-herramientas)  
5. 📊 [Cronograma](#5-cronograma)  
6. ⚠️ [Riesgos y Contingencias](#6-riesgos-y-contingencias)  
7. ✅ [Criterios de Aceptación](#7-criterios-de-aceptación)  
8. 🥇 [Priorización de Casos de Prueba](#8-priorización-de-casos-de-prueba)  
9. 📝 [Documentación y Registro de Resultados](#9-documentación-y-registro-de-resultados)  

---

## 1. 🎯 Objetivos y Alcance

### Objetivo  
Validar que las funcionalidades implementadas en la plataforma ResQFood cumplan con los requisitos funcionales y no funcionales establecidos, enfocándose especialmente en la funcionalidad principal: **la donación de alimentos entre usuarios generales**.

### Alcance  
- Funcionalidades CRUD para registro de alimentos.  
- Funcionalidades de gestión de donaciones.  
- Validación de comentarios y calificaciones.  
- Pruebas de integración entre usuarios y el sistema de donación.  
- Pruebas automatizadas con Selenium.  
- Pruebas de rendimiento con JMeter.

---

## 2. 🧠 Estrategia de Pruebas

El enfoque general será el siguiente:

- 🔹 **Pruebas Funcionales:** Validar operaciones CRUD sobre alimentos y donaciones.
- 🔹 **Pruebas de Integración:** Verificar el flujo entre usuarios, alimentos y donaciones.
- 🔹 **Pruebas Automatizadas:** Utilizar Selenium para automatizar escenarios clave.
- 🔹 **Pruebas de Rendimiento:** Evaluar el comportamiento bajo carga con JMeter.
- 🔹 **Pruebas Exploratorias:** Detectar errores inesperados durante el uso general.
- 🔹 **Pruebas de Usabilidad:** Asegurar que la interfaz sea intuitiva y accesible.

---

## 3. 🚦 Criterios de Entrada y Salida

### Criterios de Entrada  
- Desarrollo del sistema en una etapa estable.  
- Base de datos y servicios en funcionamiento.  
- Herramientas de testing configuradas correctamente.  

### Criterios de Salida  
- Todas las pruebas funcionales y automatizadas completadas.  
- Los defectos críticos y altos resueltos.  
- Informes de pruebas documentados y revisados.  

---

## 4. 🧰 Recursos y Herramientas

- 👨‍💻 **Equipo de trabajo:** Testers, desarrolladores y responsable QA.  
- 🔧 **Herramientas:**  
  - Postman (APIs)  
  - MongoDB Compass (BD)  
  - Selenium (pruebas automatizadas)  
  - JMeter (pruebas de carga)  
  - GitHub Projects / Jira (gestión de tareas)  
- 💻 **Entorno:** Docker, ambiente de staging en la nube.

---

## 5. 📊 Cronograma

| Fase                      | Duración     | Actividades principales                                |
|---------------------------|--------------|--------------------------------------------------------|
| Configuración de entorno  | 1 semana     | Setup de MongoDB, Selenium, JMeter                    |
| Pruebas funcionales       | 2 semanas    | Validación de funciones clave                         |
| Pruebas de integración    | 1 semana     | Testing entre módulos de usuario y donaciones         |
| Automatización con Selenium | 1 semana  | Scripts de prueba y validación de flujos principales  |
| Pruebas de rendimiento    | 1 semana     | Carga con JMeter, análisis de resultados              |
| Análisis y documentación  | 1 semana     | Registro de resultados, informe final                 |

---

## 6. ⚠️ Riesgos y Contingencias

| Riesgo                                              | Contingencia                                                  |
|-----------------------------------------------------|----------------------------------------------------------------|
| Cambios en requerimientos funcionales               | Replanificación del testing y revisión de casos de prueba      |
| Integración defectuosa entre componentes            | Aislamiento del error y pruebas por unidad                     |
| Falta de tiempo para automatización completa        | Priorización de casos críticos para Selenium                   |
| Problemas de rendimiento en el entorno de pruebas   | Ajustes en infraestructura de testing o pruebas en horarios no pico |

---

## 7. ✅ Criterios de Aceptación

- ✔️ Todas las funcionalidades críticas probadas y validadas.  
- ✔️ Defectos críticos solucionados antes de la entrega.  
- ✔️ Reportes completos de pruebas funcionales y automatizadas.  
- ✔️ Validación del rendimiento bajo carga aceptable.

---

## 8. 🥇 Priorización de Casos de Prueba

- 🔺 Alta Prioridad:  
  - Registro y visualización de alimentos.  
  - Donación entre usuarios generales.  
  - Registro de usuarios e inicio de sesión.  

- 🔸 Media Prioridad:  
  - Comentarios y calificaciones.  
  - Actualización o eliminación de alimentos.  

- 🔻 Baja Prioridad:  
  - Funcionalidades secundarias no esenciales para MVP.  
  - Acciones administrativas o reportes.

---

## 9. 📝 Documentación y Registro de Resultados

- 📋 **Evidencia de pruebas:** Capturas de pantalla, logs y grabaciones de pruebas automatizadas.  
- 📁 **Formato de resultados:** Se utilizará una planilla compartida para registrar cada ejecución de prueba, estado, errores encontrados y evidencia asociada.  
- 🔄 **Control de versiones:** El documento se actualizará en cada iteración del testing con fecha y cambios realizados.  
- 📌 **Repositorio:** Toda la documentación estará en el repositorio de GitHub del proyecto.

---
