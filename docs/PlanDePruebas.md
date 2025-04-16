# Plan de Pruebas – ResQFood
________________________________________
## 📑 Índice
1. 📌 Objetivo del plan
2. 📅 Cronograma estimado
3. 🧩 Alcance de las pruebas
4. 🛠 Estrategia de pruebas
5. 🔍 Diseño de pruebas
6. 📋 Casos de prueba esperados
7. 👥 Responsables
8. 🧰 Herramientas a utilizar
9. 📍 Criterios de entrada y salida
10. 📉 Métricas de evaluación
11. 🔄 Gestión de incidencias
12. 🗂 Artefactos generados
13. 🕵️‍♂️ Seguimiento y revisión
________________________________________

## 1. 📌 Objetivo del plan
Definir una hoja de ruta concreta y operativa para llevar a cabo el proceso de pruebas del sistema ResQFood, garantizando que los entregables cumplan con los criterios de calidad definidos antes del cierre del cuatrimestre y vacaciones de invierno.

## 2. 📅 Cronograma estimado
- **Semana 1-2**: Diseño de pruebas unitarias y automatizadas.
- **Semana 3-4**: Ejecución de pruebas unitarias e integración parcial.
- **Semana 5-6**: Diseño y ejecución de pruebas funcionales, pruebas E2E y pruebas de rendimiento.
- **Semana 7**: Pruebas de aceptación, regresión, revisión de bugs y cierre.
⚠️ Este cronograma se adaptará de acuerdo al avance real del desarrollo y a las reuniones del equipo.

## 3. 🧩 Alcance de las pruebas
- Pruebas funcionales de donación entre usuarios generales (core del proyecto).
- Validaciones de responsividad y experiencia de usuario.
- Automatización de pruebas en los módulos más críticos.
- Pruebas de integración y rendimiento de la API.
- Documentación de casos y resultados.
El módulo de donaciones desde usuarios locales será incluido solo si hay tiempo disponible.

## 4. 🛠 Estrategia de pruebas
El plan de pruebas se basa en el enfoque ágil y ciclos iterativos de Scrum. Las pruebas se integran desde las primeras etapas y se ajustan sprint a sprint. Se realizarán pruebas:
- Manuales y automatizadas (con Selenium)
- De carga (con JMeter)
- En distintos navegadores y dispositivos (responsividad)

## 5. 🔍 Diseño de pruebas
Los casos de prueba se redactarán basados en los criterios de aceptación de las historias de usuario y contemplarán:
- Precondiciones
- Pasos a seguir
- Resultado esperado
- Resultado real

## 6. 📋 Casos de prueba esperados
Ejemplos:
- Registro de usuario (formulario válido, inválido, duplicado)
- Inicio de sesión (con cuenta Google y manual)
- Donación de alimento (flujo completo, errores posibles)
- Visualización correcta en dispositivos móviles
- Carga y respuesta del sistema ante múltiples solicitudes

## 7. 👥 Responsables
- **Encargado de Testing y Documentación**: Gonzalo Isaias Bouso
  - Diseñar, ejecutar y documentar pruebas
  - Supervisar resultados y métricas
  - Reportar bugs
- **Desarrolladores**:
  - Ejecutar pruebas unitarias y solucionar incidencias
- **Scrum Master**:
  - Garantizar que el proceso de testing se mantenga en cada sprint

## 8. 🧰 Herramientas a utilizar
- **Selenium**: Automatización de interfaz
- **JMeter**: Pruebas de carga
- **GitHub Actions**: CI/CD y ejecución automática de tests
- **Jira / Trello**: Gestión de tareas y bugs

## 9. 📍 Criterios de entrada y salida
- **Entrada**: Historia de usuario lista, desarrollo completo, revisión técnica hecha.
- **Salida**: Todas las pruebas pasadas, sin bugs críticos abiertos, revisión en demo.

## 10. 📉 Métricas de evaluación
- Tasa de éxito de casos de prueba
- Cobertura de pruebas automatizadas
- Bugs por sprint y tiempo promedio de resolución
- Tiempo de respuesta en pruebas de carga

## 11. 🔄 Gestión de incidencias
- Cada incidencia será registrada en Jira/Trello
- Se etiquetará por severidad y prioridad
- Se revisará en cada daily y sprint review

## 12. 🗂 Artefactos generados
- Casos de prueba (Excel o Notion)
- Reportes de ejecución
- Evidencias con capturas de pantalla
- Logs de automatización

## 13. 🕵️‍♂️ Seguimiento y revisión
El plan será revisado al comienzo de cada sprint por el Encargado de Testing. Los cambios serán documentados. Se generará un resumen de calidad al final del proyecto junto con la presentación final de ResQFood.
