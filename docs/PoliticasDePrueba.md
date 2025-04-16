# 🧾 Política de Pruebas – ResQFood

---

## 📑 Índice  
1. 📌 Propósito  
2. 🧑‍🤝‍🧑 Alcance  
3. 🧭 Principios  
4. 🔧 Enfoque de Pruebas  
5. 🧪 Tipos de pruebas a realizar  
6. 👥 Roles y responsabilidades  
7. 🛠 Herramientas y entorno  
8. 📍 Criterios de entrada  
9. ✅ Criterios de salida  
10. 📉 Métricas de calidad  
11. 🔄 Revisión y mantenimiento  

---

## 1. 📌 Propósito  
Establecer las directrices generales que regirán la planificación, ejecución y gestión de las pruebas del proyecto **ResQFood**, una plataforma web MERN para reducir el desperdicio de alimentos a través de donaciones entre usuarios.

---

## 2. 🧑‍🤝‍🧑 Alcance  
Esta política se aplica a todo el equipo de desarrollo y calidad del proyecto, incluyendo desarrolladores, testers, Scrum Master, Product Owner y demás colaboradores involucrados en la validación de calidad del software.

Este documento aplica a todas las fases de prueba del sistema, desde pruebas unitarias hasta pruebas de aceptación. La política se centra principalmente en la funcionalidad de donación entre **usuarios generales**, siendo la funcionalidad de donaciones desde **usuarios locales** considerada secundaria y sujeta a desarrollo si el tiempo lo permite.

Las pruebas abarcarán todos los componentes del sistema:  
- Frontend (React + Vite + Tailwind)  
- Backend (Node.js + Express)  
- Base de datos (MongoDB)  
- APIs REST  
- Interfaces de usuario  
- Integraciones externas (por ejemplo, autenticación con Google)

---

## 3. 🧭 Principios  
Los principios fundamentales que guiarán el proceso de pruebas en ResQFood son:

- ✅ **Prevención de errores sobre detección tardía**: se promueve la revisión temprana de requisitos, historias de usuario y criterios de aceptación.  
- 🤖 **Automatización donde sea posible**: se prioriza el uso de herramientas como Selenium y JMeter para reducir el esfuerzo manual y asegurar pruebas repetibles.  
- 🔄 **Testing continuo**: las pruebas serán parte del proceso de integración continua y se ejecutarán frecuentemente durante el desarrollo.  
- 🤝 **Colaboración activa**: todo el equipo es responsable de la calidad. Los testers, desarrolladores y el Product Owner colaborarán para mejorar el producto.  
- 🧑‍💻 **Orientación al usuario final**: las pruebas se diseñarán con foco en la experiencia del usuario general y local, considerando usabilidad, accesibilidad y dispositivos.  
- ⚙️ **Adaptabilidad**: el enfoque de pruebas será flexible para ajustarse a los cambios del backlog y la planificación por sprints.

---

## 4. 🔧 Enfoque de Pruebas  
El proceso de pruebas se basará en un enfoque ágil, siguiendo las ceremonias y ciclos de Scrum. Las pruebas serán iterativas e incrementales y estarán integradas en el flujo de trabajo desde las primeras etapas de desarrollo.

Las pruebas incluirán:  
- Testing manual  
- Testing automatizado con Selenium (UI/funcional)  
- Pruebas de rendimiento con JMeter  
- Pruebas de integración y pruebas end-to-end  
- Validaciones de responsividad

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

- 🧪 **Tester QA (Encargado de Testing y Documentación – Gonzalo Isaias Bouso)**: Responsable de diseñar los casos de prueba, ejecutar pruebas manuales y automatizadas, mantener esta documentación y supervisar la calidad global del proyecto desde la perspectiva de testing.  
- 👨‍💻 **Desarrollador**: Responsable de realizar pruebas unitarias, apoyar en pruebas de integración y corregir errores detectados.  
- 📊 **Scrum Master / Coordinador QA**: Supervisa la correcta ejecución de las pruebas y asegura la documentación del proceso.  
- 👥 **Cliente (rol simulado)**: Valida los entregables y realiza pruebas de aceptación al final de cada sprint.

---

## 7. 🛠 Herramientas y entorno  
- `Selenium`: Automatización de pruebas de interfaz de usuario  
- `JMeter`: Pruebas de rendimiento y carga  
- `Jira`: Gestión de incidencias y reportes de bugs  
- `Trello`: Organización de tareas por sprint  
- `GitHub`: Control de versiones y CI/CD  
- `MongoDB Atlas`, `Express`, `React (Vite)`, `Node.js`: Tecnologías del stack MERN utilizadas en el proyecto

---

## 8. 📍 Criterios de entrada  
Un ítem es elegible para ser probado cuando:  
- Se ha completado su desarrollo  
- Ha pasado el control de calidad interno del desarrollador  
- Está correctamente integrado al repositorio principal  
- Cuenta con criterios de aceptación definidos en la historia de usuario

---

## 9. ✅ Criterios de salida  
Una funcionalidad se considera validada cuando:  
- Todas sus pruebas pasaron exitosamente  
- Los bugs críticos han sido resueltos  
- Fue revisada por el equipo de QA y aprobada en la demo  
- Cumple con los criterios de aceptación

---

## 10. 📉 Métricas de calidad  
Se controlarán las siguientes métricas:  
- Cobertura de pruebas automatizadas  
- Número de bugs encontrados por sprint  
- Tiempo promedio de resolución de errores  
- Tiempo de respuesta bajo carga

---

## 11. 🔄 Revisión y mantenimiento  
Este documento será revisado al comienzo de cada sprint y podrá ajustarse según las necesidades del equipo, prioridades del proyecto o cambios en la estrategia general de desarrollo.  
Cualquier modificación será documentada por el Encargado de Testing.
