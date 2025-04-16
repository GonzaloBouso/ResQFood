# Estrategia de Pruebas – Proyecto ResQFood

## Índice
1. Pruebas Unitarias
2. Pruebas de Integración
3. Pruebas de Rendimiento
4. Pruebas de Seguridad
5. Pruebas de Resiliencia
6. Pruebas de Contrato
7. Implementación en CI/CD
8. Consideraciones Agile (Scrum)

---

## 1. Pruebas Unitarias
🎯 **Objetivo**: Verificar el correcto funcionamiento de cada componente individual del sistema.

✅ a) **Pruebas de Lógica de Negocio**:
- Verificación de reglas de negocio en el proceso de donación.
- Validación de los datos ingresados por usuarios.
- Manejo de errores personalizados y mensajes.

✅ b) **Pruebas de Modelos de Datos**:
- Validación de esquemas Mongoose para usuarios, alimentos y donaciones.
- Pruebas de validación de campos obligatorios, tipos de datos y relaciones.

✅ c) **Pruebas de Utilidades y Helpers**:
- Funciones para validar fechas, generar IDs únicos, sanitizar inputs, etc.

🛠️ Herramientas sugeridas: Jest, Mocha, Chai.

---

## 2. Pruebas de Integración
🎯 **Objetivo**: Asegurar que los módulos del sistema interactúan correctamente entre sí.

✅ a) **Pruebas de API REST**:
- Verificación de todos los endpoints (registro, login, listado de alimentos, donaciones, comentarios).
- Validación de respuestas HTTP, estructuras JSON y manejo de errores.

✅ b) **Pruebas de Integración con MongoDB**:
- Pruebas CRUD sobre las colecciones principales.
- Pruebas de consistencia de datos y manejo de consultas complejas.

🛠️ Herramientas: Supertest, MongoDB Memory Server, Postman.

---

## 3. Pruebas de Rendimiento
🎯 **Objetivo**: Verificar la capacidad del sistema bajo diferentes cargas.

✅ a) **Pruebas de Carga**:
- Simulación de múltiples usuarios navegando, publicando y donando alimentos.

✅ b) **Pruebas de Estrés**:
- Llevado del sistema al límite para identificar cuellos de botella.

✅ c) **Pruebas de Escalabilidad**:
- Pruebas con crecimiento progresivo de usuarios o donaciones para verificar el rendimiento.

🛠️ Herramientas: Apache JMeter, k6.

---

## 4. Pruebas de Seguridad
🎯 **Objetivo**: Proteger los datos del sistema y la privacidad de los usuarios.

✅ a) **Pruebas de Autenticación y Autorización**:
- Verificación de JWT para proteger rutas.
- Control de accesos según tipo de usuario.

✅ b) **Pruebas de Inyección y XSS**:
- Inyección NoSQL, pruebas de inputs maliciosos.

✅ c) **Manejo de Datos Sensibles**:
- Validación de que contraseñas estén hasheadas y datos sensibles no se expongan en logs o respuestas.

🛠️ Herramientas: OWASP ZAP, Postman, Insomnia.

---

## 5. Pruebas de Resiliencia
🎯 **Objetivo**: Verificar la estabilidad del sistema ante fallos.

✅ a) **Tolerancia a Fallos**:
- Simulación de caídas de MongoDB o servicios externos.

✅ b) **Circuit Breaker**:
- Verificación del patrón para evitar sobrecargas ante fallos persistentes.

🛠️ Herramientas: Chaos Monkey, resiliencia personalizada en backend.

---

## 6. Pruebas de Contrato
🎯 **Objetivo**: Mantener la compatibilidad de interfaces entre servicios.

✅ a) **Pruebas de Pactos (Contracts)**:
- Validación de estructuras de respuesta esperadas entre frontend y backend.

🛠️ Herramientas: Pact.js

---

## 7. Implementación en CI/CD
🎯 **Objetivo**: Automatizar las pruebas para mantener la calidad del sistema.

✅ Integrar las pruebas unitarias e integración en cada commit.
✅ Ejecutar pruebas de rendimiento antes del deploy a producción.
✅ Verificar cobertura de pruebas y calidad del código con SonarQube.

---

## 8. Consideraciones Agile (Scrum)
✅ Incluir criterios de prueba en la definición de "Terminado".
✅ Planificar y documentar los casos de prueba por historia de usuario.
✅ Revisar las pruebas como parte de los code reviews.
✅ Realizar testing exploratorio al finalizar cada Sprint.

---

