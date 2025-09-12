# 🧪 Plan de Pruebas – ResQFood (Versión Corregida)

## 📑 Índice
- [🎯 Objetivos y Alcance](#1--objetivos-y-alcance)
- [🧠 Estrategia de Pruebas](#2--estrategia-de-pruebas)
- [🚦 Criterios de Entrada y Salida](#3--criterios-de-entrada-y-salida)
- [🧰 Recursos y Herramientas](#4--recursos-y-herramientas)
- [📊 Cronograma](#5--cronograma)
- [⚠️ Riesgos y Contingencias](#6--riesgos-y-contingencias)
- [✅ Criterios de Aceptación](#7--criterios-de-aceptación)
- [🥇 Priorización de Casos de Prueba](#8--priorización-de-casos-de-prueba)
- [📝 Documentación y Registro de Resultados](#9--documentación-y-registro-de-resultados)

---

## 1. 🎯 Objetivos y Alcance
### Objetivo
Validar que las funcionalidades implementadas en la plataforma **ResQFood** cumplan con los requisitos funcionales y no funcionales establecidos, enfocándose en los flujos completos de donación y solicitud para los roles de Usuario General y Usuario Local.

### Alcance
- Funcionalidades de registro, autenticación y gestión de perfiles para todos los roles.  
- Funcionalidades de creación, gestión y entrega de donaciones.  
- Funcionalidades de búsqueda, solicitud y recepción de donaciones.  
- Validación del sistema de calificaciones.  
- Pruebas de integración entre los diferentes módulos y roles.  
- Pruebas automatizadas con **Selenium**.  
- Pruebas de rendimiento con **JMeter**.  

---

## 2. 🧠 Estrategia de Pruebas
El enfoque general será:

- 🔹 **Pruebas Funcionales:** Validar operaciones CRUD y flujos de negocio.  
- 🔹 **Pruebas de Integración:** Verificar la correcta interacción entre módulos.  
- 🔹 **Pruebas Automatizadas:** Utilizar Selenium para automatizar escenarios críticos.  
- 🔹 **Pruebas de Rendimiento:** Evaluar el comportamiento bajo carga con JMeter.  
- 🔹 **Pruebas Exploratorias:** Detectar errores inesperados mediante uso libre de la app.  
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
- **Equipo de trabajo:** Testers, desarrolladores y responsable QA.  
- **Herramientas:** Postman, MongoDB Compass, Selenium, JMeter, Jira.  
- **Entorno:** Docker, ambiente de *staging* en la nube.  

---

## 5. 📊 Cronograma

| Fase                       | Duración  | Actividades principales                                |
|-----------------------------|-----------|-------------------------------------------------------|
| Configuración de entorno    | 1 semana  | Setup de MongoDB, Selenium, JMeter                    |
| Pruebas funcionales         | 2 semanas | Validación de funciones clave para todos los roles     |
| Pruebas de integración      | 1 semana  | Testing entre módulos (Donante/Receptor)              |
| Automatización con Selenium | 1 semana  | Scripts de prueba para flujos principales             |
| Pruebas de rendimiento      | 1 semana  | Carga con JMeter, análisis de resultados              |
| Análisis y documentación    | 1 semana  | Registro de resultados, informe final                 |

---

## 6. ⚠️ Riesgos y Contingencias

| Riesgo                                | Contingencia                                           |
|--------------------------------------|-------------------------------------------------------|
| Cambios en requerimientos funcionales | Replanificación del testing y revisión de casos        |
| Integración defectuosa entre componentes | Aislamiento del error y pruebas por unidad             |
| Falta de tiempo para automatización completa | Priorización de casos críticos para Selenium           |
| Problemas de rendimiento en entorno de pruebas | Ajustes en infraestructura o pruebas en horarios no pico |

---

## 7. ✅ Criterios de Aceptación
- ✔️ Todas las funcionalidades críticas probadas y validadas para todos los roles.  
- ✔️ Defectos críticos solucionados antes de la entrega.  
- ✔️ Reportes completos de pruebas funcionales y automatizadas.  
- ✔️ Validación del rendimiento bajo carga aceptable.  

---

## 8. 🥇 Priorización de Casos de Prueba
- 🔺 **Alta Prioridad:**  
  - Registro de usuarios (General y Local) e inicio de sesión.  
  - Flujo completo de creación y gestión de una donación.  
  - Flujo completo de solicitud y recepción de una donación.  

- 🔸 **Media Prioridad:**  
  - Edición del perfil de usuario.  
  - Sistema de calificaciones.  
  - Filtros y búsqueda de donaciones.  

- 🔻 **Baja Prioridad:**  
  - Funcionalidades administrativas o reportes.  
  - Casos de borde no críticos.  

---

## 9. 📝 Documentación y Registro de Resultados
- Evidencia de pruebas: Capturas de pantalla, logs y grabaciones.  
- Formato de resultados: Planilla compartida para registrar ejecución, estado y errores.  
- Control de versiones: El documento se actualizará en cada iteración del testing.  
- Repositorio: Toda la documentación estará en el repositorio de GitHub del proyecto.  

---

