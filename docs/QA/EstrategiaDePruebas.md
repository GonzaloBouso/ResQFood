# Estrategia de Pruebas – Proyecto ResQFood (Versión Corregida)

## Índice
- [Pruebas Unitarias](#1-pruebas-unitarias)
- [Pruebas de Integración](#2-pruebas-de-integración)
- [Pruebas de Rendimiento](#3-pruebas-de-rendimiento)
- [Pruebas de Seguridad](#4-pruebas-de-seguridad)
- [Pruebas de Resiliencia](#5-pruebas-de-resiliencia)
- [Pruebas de Contrato](#6-pruebas-de-contrato)
- [Implementación en CI/CD](#7-implementación-en-cicd)
- [Consideraciones Agile (Scrum)](#8-consideraciones-agile-scrum)

---

## 1. Pruebas Unitarias
🎯 **Objetivo:** Verificar el correcto funcionamiento de cada componente individual del sistema.

- **Pruebas de Lógica de Negocio:**  
  Verificación de reglas de negocio en el proceso de donación, validación de datos de usuario, y manejo de errores personalizados.  

- **Pruebas de Modelos de Datos:**  
  Validación de esquemas Mongoose para usuarios, alimentos y donaciones. Pruebas de campos obligatorios, tipos de datos y relaciones.  

- **Pruebas de Utilidades y Helpers:**  
  Funciones para validar fechas, generar códigos únicos, y sanitizar inputs.  

🛠️ **Herramientas sugeridas:** Jest, Mocha, Chai.

---

## 2. Pruebas de Integración
🎯 **Objetivo:** Asegurar que los módulos del sistema interactúan correctamente entre sí y con servicios externos.

- **Pruebas de API REST:**  
  Verificación de todos los endpoints (registro, login, gestión de donaciones, solicitudes, calificaciones). Validación de respuestas HTTP, estructuras JSON y manejo de errores.  

- **Pruebas de Integración con MongoDB:**  
  Pruebas CRUD sobre las colecciones principales y consistencia de datos en consultas complejas.  

- **Pruebas de Integración con Servicios Externos:**  
  Simulación (*mocking*) de respuestas de Clerk para autenticación y pruebas del cliente Socket.IO para notificaciones en tiempo real.  

🛠️ **Herramientas:** Supertest, MongoDB Memory Server, Postman, Jest Mocks.

---

## 3. Pruebas de Rendimiento
🎯 **Objetivo:** Verificar la capacidad del sistema bajo diferentes cargas.

- **Pruebas de Carga:**  
  Simulación de múltiples usuarios (Generales y Locales) navegando, publicando y solicitando donaciones.  

- **Pruebas de Estrés:**  
  Llevado del sistema al límite para identificar cuellos de botella.  

- **Pruebas de Escalabilidad:**  
  Pruebas con crecimiento progresivo de usuarios para verificar el rendimiento.  

🛠️ **Herramientas:** Apache JMeter, k6.

---

## 4. Pruebas de Seguridad
🎯 **Objetivo:** Proteger los datos del sistema y la privacidad de los usuarios.

- **Pruebas de Autenticación y Autorización:**  
  Verificación de JWT para proteger rutas y control de accesos estricto según los roles definidos (Usuario General, Usuario Local, Administrador).  

- **Pruebas de Inyección y XSS:**  
  Inyección NoSQL y pruebas de inputs maliciosos.  

- **Manejo de Datos Sensibles:**  
  Validación de que contraseñas estén hasheadas y datos sensibles no se expongan en logs o respuestas.  

🛠️ **Herramientas:** OWASP ZAP, Postman, Insomnia.

---

## 5. Pruebas de Resiliencia
🎯 **Objetivo:** Verificar la estabilidad del sistema ante fallos.

- **Tolerancia a Fallos:**  
  Simulación de caídas de MongoDB o servicios externos como Clerk.  

- **Circuit Breaker:**  
  Verificación del patrón para evitar sobrecargas ante fallos persistentes.  

🛠️ **Herramientas:** Chaos Monkey, resiliencia personalizada en backend.

---

## 6. Pruebas de Contrato
🎯 **Objetivo:** Mantener la compatibilidad de interfaces entre servicios.

- **Pruebas de Pactos (Contracts):**  
  Validación de estructuras de respuesta esperadas entre frontend y backend.  

🛠️ **Herramientas:** Pact.js

---

## 7. Implementación en CI/CD
🎯 **Objetivo:** Automatizar las pruebas para mantener la calidad del sistema.

- Integrar las pruebas unitarias e integración en cada commit.  
- Ejecutar pruebas de rendimiento antes del deploy a producción.  
- Verificar cobertura de pruebas y calidad del código con SonarQube.  

---

## 8. Consideraciones Agile (Scrum)

- Incluir criterios de prueba en la definición de "Terminado" (*Definition of Done*).  
- Planificar y documentar los casos de prueba por historia de usuario.  
- Revisar las pruebas como parte de los *code reviews*.  
- Realizar *testing exploratorio* al finalizar cada Sprint.  
