# 🧪 Política de Pruebas – ResQFood

## 📌 Propósito
Establecer las directrices generales que regirán la planificación, ejecución y gestión de las pruebas del proyecto **ResQFood**, una plataforma web MERN para reducir el desperdicio de alimentos a través de donaciones entre usuarios.

## 🧑‍🤝‍🧑 Alcance
Esta política se aplica a todo el equipo de desarrollo y calidad del proyecto: desarrolladores, testers, Scrum Master, Product Owner y demás colaboradores involucrados en la validación de calidad del software.

- Aplica a todas las fases de prueba, desde pruebas unitarias hasta pruebas de aceptación.
- Se prioriza la funcionalidad de donación entre **usuarios generales** como foco principal.
- La funcionalidad de donaciones desde **usuarios locales** será secundaria y se desarrollará solo si el tiempo lo permite.

Las pruebas abarcarán todos los componentes:
- Frontend (React + Vite + Tailwind)
- Backend (Node.js + Express)
- Base de datos (MongoDB)
- APIs REST
- Interfaces de usuario
- Integraciones externas (autenticación con Google)

## 🧭 Principios
Los principios que guiarán el proceso de pruebas en ResQFood son:

- ✅ **Prevención de errores** sobre detección tardía.
- ⚙️ **Automatización** donde sea posible (Selenium, JMeter).
- 🔁 **Testing continuo** en integración con CI/CD.
- 🤝 **Colaboración activa** entre todo el equipo.
- 👨‍💻 **Orientación al usuario final**, considerando usabilidad y accesibilidad.
- 🔄 **Adaptabilidad** al backlog y metodología Scrum.

## 🔧 Enfoque de Pruebas
- Se adopta un enfoque **ágil e iterativo**, alineado con los sprints.
- Pruebas incluidas:
  - Manuales
  - Automatizadas (Selenium)
  - De rendimiento (JMeter)
  - De integración y E2E
  - Validación de diseño **responsive**

## 🧪 Tipos de pruebas a realizar
- Pruebas unitarias  
- Pruebas de integración  
- Pruebas funcionales  
- Pruebas de aceptación  
- Pruebas de regresión  
- Pruebas de rendimiento  
- Pruebas de usabilidad y responsividad

## 👥 Roles y responsabilidades
- **Encargado de Testing (QA): Gonzalo Bouso** – Responsable de esta política, documentación y ejecución general de las pruebas.
- **Tester QA** – Diseña y ejecuta pruebas manuales.
- **Desarrollador** – Realiza pruebas unitarias y corrige errores.
- **Scrum Master / Coordinador QA** – Supervisa la ejecución y asegura el seguimiento.
- **Cliente (rol simulado)** – Valida entregables y prueba historias.

## 🛠️ Herramientas y entorno
- `Selenium` – Automatización de UI
- `JMeter` – Pruebas de carga
- `Jira` – Reporte de bugs
- `Trello` – Tareas por sprint
- `GitHub` – Código y CI/CD
- `MongoDB`, `Express`, `React`, `Node.js`

## 📍 Criterios de entrada
Una funcionalidad se prueba si:
- El desarrollo está completo.
- El desarrollador hizo control de calidad.
- Se integró correctamente al repositorio.
- Tiene criterios de aceptación definidos.

## ✅ Criterios de salida
Una funcionalidad se considera validada si:
- Todas sus pruebas fueron exitosas.
- Los bugs críticos fueron corregidos.
- Revisada y aprobada por QA en la demo.
- Cumple con los criterios de aceptación.

## 📊 Métricas de calidad
- Cobertura de pruebas automatizadas
- Número de bugs por sprint
- Tiempo medio de corrección
- Tiempos de respuesta bajo carga

## 📄 Revisión y mantenimiento
Este documento será revisado al comienzo de cada sprint y podrá ajustarse según las necesidades del equipo o cambios del proyecto.

---
