# 🧾 Política de Pruebas – ResQFood (Versión Corregida)

## 📑 Índice
- [📌 Propósito](#1--propósito)
- [🧑‍🤝‍🧑 Alcance](#2--alcance)
- [🧭 Principios](#3--principios)
- [🔧 Enfoque de Pruebas](#4--enfoque-de-pruebas)
- [🧪 Tipos de pruebas a realizar](#5--tipos-de-pruebas-a-realizar)
- [👥 Roles y responsabilidades](#6--roles-y-responsabilidades)
- [🛠 Herramientas y entorno](#7--herramientas-y-entorno)
- [📍 Criterios de entrada](#8--criterios-de-entrada)
- [✅ Criterios de salida](#9--criterios-de-salida)
- [📉 Métricas de calidad](#10--métricas-de-calidad)
- [🔄 Revisión y mantenimiento](#11--revisión-y-mantenimiento)
- [📝 Priorización de Casos de Prueba](#12--priorización-de-casos-de-prueba)
- [📋 Documentación y Registro de Resultados](#13--documentación-y-registro-de-resultados)

---

## 1. 📌 Propósito
Establecer las directrices generales que regirán la planificación, ejecución y gestión de las pruebas del proyecto **ResQFood**.

---

## 2. 🧑‍🤝‍🧑 Alcance
Esta política se aplica a todo el equipo de desarrollo y calidad del proyecto.  
Cubre todas las fases de prueba, desde **unitarias** hasta **aceptación**.  

Incluye los flujos críticos: donación y solicitud para los roles de **Usuario General** y **Usuario Local**.  

### Componentes cubiertos:
- Frontend (**React**)  
- Backend (**Node.js**)  
- Base de datos (**MongoDB**)  
- APIs REST  
- Interfaces de usuario  
- Integraciones externas  

---

## 3. 🧭 Principios
- **Prevención sobre detección:** Revisión temprana de requisitos.  
- **Automatización inteligente:** Automatizar pruebas repetitivas y críticas.  
- **Testing continuo:** Integrar pruebas en el pipeline de CI/CD.  
- **Colaboración activa:** La calidad es responsabilidad de todo el equipo.  
- **Orientación al usuario final:** Pruebas con foco en la experiencia de usuarios.  
- **Adaptabilidad:** Flexibilidad para ajustarse a cambios del backlog.  

---

## 4. 🔧 Enfoque de Pruebas
El proceso se basará en un enfoque **ágil**, integrando:  
- Pruebas manuales  
- Pruebas automatizadas (**Selenium, JMeter**)  
- Pruebas de integración  
- Pruebas de responsividad  
Enmarcadas dentro del flujo de trabajo de **Scrum**.  

---

## 5. 🧪 Tipos de pruebas a realizar
- Pruebas unitarias  
- Pruebas de integración  
- Pruebas funcionales  
- Pruebas de aceptación  
- Pruebas de regresión  
- Pruebas de rendimiento  
- Pruebas de usabilidad y responsividad  

---

## 6. 👥 Roles y responsabilidades
- **Tester QA:** Diseñar y ejecutar casos de prueba, documentar resultados, supervisar calidad.  
- **Desarrollador:** Realizar pruebas unitarias, apoyar en integración y corregir errores.  
- **Scrum Master / Coordinador QA:** Supervisar la ejecución de pruebas.  
- **Cliente (rol simulado):** Realizar pruebas de aceptación.  

---

## 7. 🛠 Herramientas y entorno
- **Automatización UI:** Selenium  
- **Rendimiento:** JMeter  
- **Gestión de incidencias:** Jira  
- **Control de versiones:** GitHub  
- **Stack tecnológico:** MERN (MongoDB, Express, React, Node.js)  

---

## 8. 📍 Criterios de entrada
Un ítem es elegible para ser probado cuando:
- Su desarrollo está completo.  
- Ha pasado el control de calidad del desarrollador.  
- Cuenta con criterios de aceptación definidos.  

---

## 9. ✅ Criterios de salida
Una funcionalidad se considera validada cuando:  
- Todas sus pruebas pasaron.  
- Los bugs críticos fueron resueltos.  
- Cumple con los criterios de aceptación.  

---

## 10. 📉 Métricas de calidad
- Cobertura de pruebas automatizadas.  
- Número de bugs encontrados por sprint.  
- Tiempo promedio de resolución de errores.  
- Tiempo de respuesta bajo carga.  

---

## 11. 🔄 Revisión y mantenimiento
Este documento será revisado al inicio de cada sprint y podrá ajustarse según las necesidades del proyecto.  

---

## 12. 📝 Priorización de Casos de Prueba
Se priorizarán con base en:  
- Riesgo de la funcionalidad  
- Complejidad  
- Impacto en el usuario final  
- Cambios recientes en el código  
- Frecuencia de uso  

---

## 13. 📋 Documentación y Registro de Resultados
- Casos de prueba documentados con detalle.  
- Registro de resultados (pasó/falló).  
- Trazabilidad con los requisitos.  
- Informes generados al final de cada ciclo.  
