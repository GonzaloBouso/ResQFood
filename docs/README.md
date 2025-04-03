# ResQFood

## Equipo
- Gonzalo Bouso
- Milagros Villafañe
- Agustín Iturbe

## Índice
1. [Introducción](#introducción)
2. [Problema Identificado](#problema-identificado)
3. [Objetivo del Proyecto](#objetivo-del-proyecto)
4. [Descripción de la Solución](#descripción-de-la-solución)
5. [Características Principales](#características-principales)
6. [Flujo de Donaciones y Funcionalidades Detalladas](#flujo-de-donaciones-y-funcionalidades-detalladas)
7. [Impacto Esperado](#impacto-esperado)
8. [Metodología de Trabajo](#metodología-de-trabajo)
9. [Justificación del Stack Tecnológico (MERN)](#justificación-del-stack-tecnológico-mern)
10. [Herramientas](#herramientas)
11. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
12. [Diseño](#diseño)

## Introducción
El desperdicio de alimentos es un problema global con importantes implicancias económicas, sociales y ambientales. Este proyecto busca abordar esta problemática mediante el desarrollo de una plataforma que facilite la redistribución de alimentos no deseados, fomentando el aprovechamiento de los recursos y reduciendo el desperdicio.

## Problema Identificado
Los alimentos cercanos a su fecha de caducidad suelen ser desechados innecesariamente en hogares y establecimientos. Este desperdicio representa una pérdida de recursos valiosos y una oportunidad desaprovechada de ayudar a quienes más lo necesitan.

## Objetivo del Proyecto
Desarrollar una aplicación móvil que permita:
1. Publicar alimentos en buen estado.
2. Localizar alimentos disponibles en la zona.
3. Coordinar la recolección de manera sencilla y eficiente.

## Descripción de la Solución
ResQFood funcionará como un puente entre donantes y receptores de alimentos.
- **Para los donantes:** Registro rápido de alimentos con foto, descripción y disponibilidad.
- **Para los receptores:** Búsqueda de alimentos por ubicación y comunicación con donantes.
- **Geolocalización:** Mapas interactivos para facilitar el contacto entre usuarios cercanos.

## Características Principales
1. **Tipo de Usuario**  
   - Usuario General: Puede ser receptor o donador.
   - Usuario Local (Empresas o restaurantes): Solo puede ser donador.
2. **Registro y Autenticación**
3. **Publicación de Alimentos**
4. **Búsqueda y Filtrado**
5. **Reservación de Alimentos**
6. **Notificaciones**
7. **Sistema de Calificaciones**

## Flujo de Donaciones y Funcionalidades Detalladas
### Donación General
1. El donador publica una donación.
2. El producto aparece en el feed de receptores cercanos.
3. Un receptor solicita el producto.
4. El donador acepta la solicitud y establece un horario de entrega.
5. El receptor confirma el horario y acepta los términos de entrega.
   - El producto cambia su estado a **"pendiente"**, lo que significa que sigue visible pero no puede ser solicitado por otros receptores.
   - Si la entrega no se completa y el donador no ingresa el código de confirmación, el producto volverá a estar disponible.
6. Se genera un código ID para el receptor.
7. El donador ingresa el código ID para confirmar la entrega.
8. El producto deja de estar disponible en la plataforma.
9. Se eliminan las otras solicitudes del producto.
10. El receptor puede puntuar al donador.

### Donación Local (Empresas o Restaurantes)
1. Creación de perfil de empresa.
2. Publicación de donaciones con fotos y detalles.
3. Un cliente decide hacer una donación.
4. El cliente recibe un código único del producto donado.
5. La empresa recibe la solicitud.
6. El cliente paga en efectivo.
7. La empresa ingresa el código brindado por el cliente.
8. El producto se publica como donación disponible en la plataforma.

## Impacto Esperado
1. Reducir significativamente el desperdicio de alimentos.
2. Contribuir a una economía circular y sostenible.
3. Ayudar a personas en situación de necesidad.

## Metodología de Trabajo
Uso de **Scrum** para gestionar el desarrollo del proyecto.
- **Duración de Sprints:** 1 semana.
- **Sprint Review y Retrospective:** Jueves a las 10:30 AM.
- **Daily Meetings:** Lunes a viernes a las 10:00 AM (15 min).

### Equipo de Trabajo
- **Scrum Master:** Gonzalo Bouso
- **Líder Frontend:** Agustín Iturbe
- **Líder Backend:** Milagros Villafañe
- **Encargado de Testing:** Gonzalo Bouso
- **Encargado de Documentación:** Milagros Villafañe

## Justificación del Stack Tecnológico (MERN)
El MERN Stack (MongoDB, Express.js, React, Node.js) es ideal para una plataforma como ResQFood debido a:
1. **Desarrollo Full-Stack con JavaScript**
2. **Escalabilidad y Manejo de Datos en Tiempo Real**
3. **Integración con Funcionalidades Clave**
4. **Modularidad y Escalabilidad con Microservicios**
5. **Comunidad y Soporte Activo**

## Herramientas
1. **Trello:** Gestión de tareas.
2. **Jira:** Seguimiento de bugs y testing.
3. **GitHub:** Control de versiones.
4. **Notion/Google Docs:** Documentación colaborativa.

## Arquitectura del Proyecto
Se ha optado por una **arquitectura de microservicios** para asegurar escalabilidad y modularidad.
- **Microservicio de Usuarios**: Manejo de autenticación y perfiles.
- **Microservicio de Publicaciones**: Gestión de donaciones.
- **Microservicio de Notificaciones**: Alertas en tiempo real.

### Ventajas de los Microservicios
- **Escalabilidad independiente**
- **Desarrollo y mantenimiento modular**
- **Flexibilidad tecnológica**
- **Resiliencia y tolerancia a fallos**
- **Facilidad para futuras integraciones**

## Diseño
A continuación, se presenta un primer boceto de la pantalla de inicio (Home Page) de ResQFood. Este diseño no es definitivo y servirá como base para futuras iteraciones.

![Diseño Home Page](img/PrimerSketch.jpeg)
