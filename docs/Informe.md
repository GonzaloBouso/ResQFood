# ResQFood

## Equipo
Gonzalo Bouso, Milagros Villafañe

---

# Tabla de Contenido

1.  [Visión del Proyecto](#1-visión-del-proyecto)
    -   [1.1. Introducción](#11-introducción)
    -   [1.2. Problema Identificado](#12-problema-identificado)
    -   [1.3. Objetivo del Proyecto](#13-objetivo-del-proyecto)
    -   [1.4. Impacto Esperado](#14-impacto-esperado)
2.  [Alcance y Funcionalidades](#2-alcance-y-funcionalidades)
    -   [2.1. Descripción de la Solución](#21-descripción-de-la-solución)
    -   [2.2. Flujo de Donaciones](#22-flujo-de-donaciones)
    -   [2.3. Tipos de Usuario y Permisos](#23-tipos-de-usuario-y-permisos)
    -   [2.4. Requisitos de las Publicaciones de Alimentos](#24-requisitos-de-las-publicaciones-de-alimentos)
    -   [2.5. Otras Funcionalidades Clave](#25-otras-funcionalidades-clave)
3.  [Metodología y Arquitectura Técnica](#3-especificaciones-técnicas-y-arquitectura)
    -   [3.1. Metodología de Trabajo](#31-metodología-de-trabajo)
    -   [3.2. Herramientas](#32-herramientas)
    -   [3.3. Justificación del Stack Tecnológico (MERN)](#33-justificación-del-stack-tecnológico-mern)
    -   [3.4. Arquitectura del proyecto](#34-arquitectura-del-proyecto)
    -   [3.5. Base de Datos: MongoDB](#35-mongo-db-para-la-base-de-datos)
    -   [3.6. Modelado de la base de datos](#36-modelado-de-la-base-de-datos)
4.  [Diseño y Experiencia de Usuario (UX/UI)](#4-diseño-y-experiencia-de-usuario-uxui)
    -   [4.1. Concepto de Diseño](#41-concepto-de-diseño)
    -   [4.2. Guía de Estilo Visual](#42-guía-de-estilo-visual)
    -   [4.3. Bocetos Iniciales](#43-bocetos-iniciales)
    -   [4.4. Prototipo Interactivo](#44-prototipo-interactivo)
5.  [Despliegue](#5-despliegue)


---

### Equipo de Trabajo
- **Scrum Master:** Gonzalo Bouso
- **Líder Frontend:** Gonzalo Bouso
- **Líder Backend:** Milagros Villafañe
- **Encargado de Testing:** Gonzalo Bouso
- **Encargado de Documentación:** Villafañe Milagros
- **Encargado del manejo de Trello:** Villafañe Milagros

---
## 1. Visión del Proyecto


## 1.1. Introducción
El desperdicio de alimentos es un problema global con importantes implicancias económicas, sociales y ambientales. Se estima que diariamente se descartan grandes cantidades de alimentos en buen estado debido a su proximidad a la fecha de caducidad o por no ser utilizados. Este proyecto busca abordar esta problemática mediante el desarrollo de una plataforma que facilite la redistribución de alimentos no deseados, fomentando el aprovechamiento de los recursos y reduciendo el desperdicio.


## 1.2. Problema Identificado
Los alimentos cercanos a su fecha de caducidad suelen ser desechados innecesariamente en hogares y establecimientos como restaurantes y supermercados. Este desperdicio no solo impacta negativamente en el medio ambiente, sino que también representa una pérdida de recursos valiosos y una oportunidad desaprovechada de ayudar a quienes más lo necesitan.

## 1.3. Objetivo del Proyecto
Desarrollar una aplicación web intuitiva que permita:
1. Publicar alimentos que ya no necesitan, especificando detalles como tipo, cantidad y fecha de caducidad.
2. Localizar alimentos disponibles en su zona.
3. Coordinar la recolección de dichos alimentos de manera sencilla y eficiente.


### 1.4. Impacto Esperado
1.  **Reducir** significativamente el desperdicio de alimentos en el ámbito doméstico y comercial.
2.  **Contribuir** al fortalecimiento de una economía circular y sostenible.
3.  **Ayudar** a personas en situación de necesidad a acceder a recursos alimentarios gratuitos.


---


## 2. Alcance y Funcionalidades

### 2.1 Descripción de la Solución
La plataforma funciona como un puente entre quienes tienen alimentos en buen estado que no planean consumir y personas o instituciones que puedan aprovecharlos.
- **Para los donantes:** Podrán registrar alimentos de manera rápida, cargando una breve descripción, fotografía y detalles de disponibilidad.
- **Para los receptores:** Podrán buscar alimentos según su ubicación y necesidad, comunicándose directamente con los donantes a través de la aplicación.
- **Geolocalización:** La app incluirá mapas interactivos para facilitar el contacto entre usuarios cercanos.


### 2.2. Flujo de Donaciones
1.  **Publicación:** El donador publica una donación con todos los detalles requeridos.
2.  **Visibilidad:** El producto aparece en el feed de receptores cercanos geográficamente.
3.  **Solicitud:** Un receptor solicita el producto a través de la plataforma.
4.  **Aceptación:** El donador recibe una notificación, acepta la solicitud y establece un horario de entrega.
5.  **Confirmación:** El receptor confirma el horario y acepta los términos. El estado del producto cambia a **"Pendiente"**, haciéndolo no disponible para otras solicitudes.
6.  **Código de Entrega:** Se genera un código ID único para el receptor, asociado a esa entrega específica.
7.  **Validación:** En el momento del intercambio, el donador ingresa el código ID proporcionado por el receptor para confirmar la entrega.
8.  **Finalización:** El producto se marca como **"Entregado"** y deja de estar visible. Las otras solicitudes para ese producto se cancelan.
9.  **Calificación:** El receptor tiene la opción de puntuar al donador para construir un sistema de confianza.



### 2.3. Tipo de Usuario y Permisos
- **Usuario General:** Puede ser receptor o donador.
- **Usuario Local (Empresas o Restaurantes):** Solo puede ser donador, no receptor.

## Requisitos de los Usuarios

| Requisito               | Usuario General | Usuario Local | Moderador | Administrador | Funcional | Visible |
|-------------------------|-----------------|---------------|-----------|---------------|-----------|---------|
| **Nombre**              | ✅ Sí           | ✅ Sí         | ✅ Sí      | ✅ Sí         | ✅ Sí      | ✅ Sí    |
| **Email**               | ✅ Sí           | ✅ Sí         | ✅ Sí      | ✅ Sí         | ✅ Sí      | ❌ No    |
| **Teléfono**            | ✅ Opcional     | ✅ Obligatorio| ✅ Opcional| ✅ Opcional   | ✅ Sí      | ✅ Sí    |
| **Ubicación**           | ✅ Opcional     | ✅ Obligatorio| ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Foto de perfil**      | ✅ Opcional     | ✅ Opcional   | ✅ Opcional| ✅ Opcional   | ✅ Sí      | ✅ Sí    |
| **Roles**               | "General"      | "Local"       | "Moderador" | "Admin"     | ✅ Sí      | ❌ No    |
| **Donaciones hechas**   | ✅ Sí           | ✅ Sí         | ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Donaciones recibidas**| ✅ Sí           | ❌ No aplica  | ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Tipo de negocio**     | ❌ No aplica    | ✅ Rest./Panad./etc. | ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Horario de atención** | ❌ No aplica    | ✅ Sí         | ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Gestionar reportes**  | ❌ No aplica    | ❌ No aplica  | ✅ Sí      | ✅ Sí         | ✅ Sí      | ❌ No    |
| **Eliminar publicaciones** | ❌ No aplica | ❌ No aplica  | ✅ Sí      | ✅ Sí         | ✅ Sí      | ❌ No    |
| **Suspender usuarios**  | ❌ No aplica    | ❌ No aplica  | ❌ No aplica | ✅ Sí        | ✅ Sí      | ❌ No    |
| **Administrar roles**   | ❌ No aplica    | ❌ No aplica  | ❌ No aplica | ✅ Sí        | ✅ Sí      | ❌ No    |
| **Acceso total al sistema** | ❌ No aplica | ❌ No aplica  | ❌ No aplica | ✅ Sí        | ✅ Sí      | ❌ No    |
| **Botón editar perfil** | ✅ Sí           | ✅ Sí         | ✅ Sí      | ✅ Sí         | ✅ Sí      | ✅ Sí    |
| **Descripción de la empresa** | ❌ No    | ✅ Sí         | ❌ No aplica | ❌ No aplica | ✅ Sí      | ✅ Sí    |
| **Historial de cambios**| ❌ No aplica    | ❌ No aplica  | ❌ No      | ✅ Sí         | ✅ Sí      | ❌ No    |


 
### 2.4. Requisitos de las Publicaciones de Alimentos


| Requisito               | Obligatorio | Descripción                                | Funciona | Visible en publicación |
|-------------------------|-------------|--------------------------------------------|----------|-------------------------|
| **Título**              | ✅ Sí       | Breve descripción del alimento             | ❌ No    | ✅ Sí                  |
| **Descripción**         | ✅ Sí       | Detalles adicionales sobre el alimento     | ❌ No    | ✅ Sí                  |
| **Imagen del alimento** | ✅ Sí       | Foto del alimento para mostrar su estado   | ❌ No    | ✅ Sí                  |
| **Cantidad disponible** | ✅ Sí       | Número de porciones o unidades disponibles | ✅ Sí    | ✅ Sí                  |
| **Categoría**           | ✅ Sí       | Tipo de alimento (Ej: "Frutas")            | ❌ No    | ✅ Sí                  |
| **Fecha de V.**         | ✅ Opcional | Fecha límite para consumir el alimento     | ❌ No    | ✅ Sí                  |
| **Ubicación de retiro** | ✅ Sí       | Dirección o zona para retirar la donación  | ❌ No    | ✅ Sí                  |
| **Método de entrega**   | ✅ Sí       | Retiro en persona o entrega a domicilio    | ❌ No    | ✅ Sí                  |
| **Horario de disponibilidad** | ✅ Sí| Franja horaria para retirar el alimento    | ❌ No    | ✅ Sí                  |
| **Estado del alimento** | ✅ Sí       | Opciones como "Fresco", "Congelado", etc.  | ❌ No    | ✅ Sí                  |
| **Condiciones especiales** | ❌ Opcional | Notas como "Debe ser refrigerado", etc. | ❌ No    | ✅ Sí                  |
| **Información de contacto** | ✅ Sí | Teléfono o email para coordinar la entrega | ❌ No    | ✅ Sí                  |
| **Fecha de elaboración**| ❌ Opcional | Fecha en que fue elaborado el alimento     | ❌ No    | ✅ Sí                  |
| **Botón publicar**      | ✅ Sí       | Permite confirmar y enviar la publicación  | ✅ Sí    | ❌ No                  |
| **Botón ver detalle**   | ✅ Sí       | Muestra el detalle completo de la publicación | ✅ Sí| ✅ Sí                  |
| **Botón solicitar donación** | ✅ Sí| Manifiesta interés en recibir la donación  | ✅ Sí    | ✅ Sí                  |


## 2.5. Otras Funcionalidades Clave
- **Búsqueda y Filtrado:** Los receptores podrán buscar alimentos según categoría, ubicación o cercanía a la fecha de caducidad.
- **Reservación de Alimentos:** El usuario receptor podrá seleccionar un alimento en una publicación. Al ser aprobado por el donante, el alimento dejará de estar disponible.
- **Notificaciones:** Alertas para donantes y receptores sobre nuevas publicaciones o solicitudes.
- **Sistema de Calificaciones:** Para garantizar la confianza y transparencia entre los usuarios.


---


## 3. Especificaciones Técnicas y Arquitectura


## 3.1. Metodología de Trabajo
Uso de **Scrum** para gestionar el desarrollo del proyecto.
Para gestionar el desarrollo del proyecto, se empleará la metodología Scrum, que permitirá la entrega iterativa de funcionalidades y la mejora continua a través de la retroalimentación.

- **Duración de Sprints:** 1 semana.
- **Sprint Review y Retrospective:** Jueves a las 10:30 AM.
- **Sprint Planning:** Todos los miercoles.
- **Daily Meetings:** Lunes a viernes a las 10:00 AM (15 min).

### Uso de Scrum
  Scrum es una metodología ágil para la gestión y desarrollo de proyectos complejos. Se utiliza comúnmente en el desarrollo de software, pero también puede aplicarse en otros contextos. Su objetivo es entregar productos de alta calidad mediante un enfoque iterativo e incremental, promoviendo la colaboración, la flexibilidad y la mejora continua.
Principales características de Scrum:
1.	**Iteraciones cortas y repetitivas (Sprints)**:
o	Los proyectos se dividen en periodos de tiempo fijo llamados sprints (generalmente de 1 a 4 semanas).
o	Cada sprint produce un incremento funcional del producto, llamado Incremento.
2.	**Roles en Scrum: Scrum define tres roles principales**:
	Product Owner:
	Representa al cliente o los interesados (stakeholders).
	Es responsable de gestionar el Product Backlog y priorizar las tareas según el valor para el negocio.
	Scrum Master:
	Actúa como facilitador y guía para el equipo.
	Asegura que Scrum se implemente correctamente y elimina impedimentos que bloqueen al equipo.
	Development Team:
	Es un grupo autoorganizado de profesionales que se encargan de desarrollar el producto.
3.	**Artefactos clave**:
	Product Backlog:
	Lista priorizada de tareas, características y requisitos del producto.
	Sprint Backlog:
	Conjunto de tareas seleccionadas del Product Backlog que se trabajarán durante un sprint.
	Incremento:
	El producto funcional y entregable al final de cada sprint.
4.	**Eventos en Scrum**:
	Sprint Planning:
	Reunión al inicio de cada sprint para planificar qué tareas del Product Backlog se incluirán en el Sprint Backlog.
	Daily Scrum:
	Reunión diaria de 15 minutos donde el equipo responde tres preguntas clave:
1.	¿Qué hice ayer?
2.	¿Qué haré hoy?
3.	¿Hay algo que me bloquee?
	Sprint Review:
	Revisión al final del sprint para presentar el incremento y recibir retroalimentación de los interesados.
	Sprint Retrospective:
	Reunión para reflexionar sobre el sprint terminado y discutir mejoras para futuros sprints.
5.	**Principios básicos de Scrum**:
	Transparencia: Todos los involucrados deben tener claridad sobre el estado del proyecto.
	Inspección: Monitoreo constante del progreso para identificar problemas.
	Adaptación: Ajuste rápido de las estrategias en respuesta a los desafíos.


![Diseño Home Page](img/Scrum.png)


## 3.2 Herramientas
1. **Trello:** Gestión de tareas.
2. **Jira:** Seguimiento de bugs y testing.
3. **GitHub:** Control de versiones.
4. **Notion/Google Docs:** Documentación colaborativa.



## 3.3. Justificación del Stack Tecnológico (MERN)
El MERN Stack (MongoDB, Express.js, React, Node.js) es una de las tecnologías más adecuadas para desarrollar una red social como ResQFood, que conecta a personas que desean donar alimentos con aquellas que los necesitan. La elección de este stack se basa en los siguientes factores:

1. **Desarrollo Full-Stack con JavaScript**: El uso de JavaScript en todo el stack (frontend, backend y base de datos) simplifica el desarrollo, ya que permite mantener un único lenguaje de programación en toda la aplicación. Esto ofrece:
✅ Código más limpio y reutilizable, evitando la necesidad de cambiar entre lenguajes.
✅ Menor curva de aprendizaje, ya que todos los desarrolladores pueden trabajar tanto en frontend como en backend sin problemas.
✅ Eficiencia en el desarrollo, permitiendo una mejor colaboración dentro del equipo.

2. **Escalabilidad y Manejo de Datos en Tiempo Real**: Como la plataforma funcionará como una red social, es fundamental que maneje eficientemente un gran volumen de datos y usuarios. MERN ofrece ventajas clave:
✅ MongoDB es una base de datos NoSQL altamente escalable y flexible. Permite almacenar publicaciones de donaciones, usuarios y comentarios de manera eficiente.
✅ React.js facilita la actualización dinámica de la interfaz sin recargar la página, mejorando la experiencia del usuario.
✅ Node.js y Express manejan múltiples solicitudes concurrentes sin perder rendimiento, asegurando un backend rápido y estable

3. **Integración con Funcionalidades Clave para una Red Social**: El stack MERN se adapta perfectamente a los requerimientos de una red social como ResQFood, incluyendo:
✅ Publicación y gestión de alimentos: MongoDB permite almacenar publicaciones con imágenes, descripciones y geolocalización.
✅ Sistema de usuarios y autenticación: Node.js y JWT garantizan una autenticación segura y escalable.
✅ Geolocalización en tiempo real: React puede integrarse con Google Maps API para mostrar las donaciones cercanas a cada usuario.
✅ Notificaciones en tiempo real: WebSockets con Node.js pueden usarse para alertar a los usuarios sobre nuevas donaciones.

4. **Comunidad y Soporte Activo**: ✅ MERN es una tecnología ampliamente adoptada, con una gran comunidad de desarrolladores y documentación disponible, lo que facilita la resolución de problemas y futuras mejoras en el sistema.

### Conclusión :
 El MERN Stack ofrece una combinación ideal de velocidad, escalabilidad, facilidad de desarrollo e integración con funcionalidades clave para redes sociales. Su arquitectura basada en JavaScript en todo el stack, permite desarrollar ResQFood de manera eficiente y preparada para el crecimiento futuro. 🚀




## 3.4. Arquitectura del proyecto

Para el desarrollo de nuestro proyecto final, hemos decidido utilizar la arquitectura cliente-servidor junto con el patrón MVC(modelo-vista-controlador) debido a sus múltiples ventajas en términos de flexibilidad, escalabilidad, mantenimiento y organización de código. A continuación, se describen las principales razones de esta decisión:

1. **Modularidad y Separación de Responsabilidades**
  La separación entre frontend y backend permite organizar mejor el código y asignar responsabilidades especificas a cada equipo:
 **Frontend (React + Vite)**: Encargado de diseñar las vistas, interactividad y experiencia del usuario.
 **Backend (Node.js + Express)**: Responsable de la lógica de negocio, manejo de datos, y seguridad.
**Beneficio**: Esta división permite a los equipos trabajar en paralelo sin interferencias y facilita la colaboración en futuros desarrollos.

**Patrón MVC**: Además, con el patrón MVC, el backend se organiza de manera más eficiente. La Vista se encarga de mostrar la información al usuario (en este caso, los componentes de React), el Modelo gestión los datos en la base de datos (Mongo DB), y el Controlador maneja la lógica de negocio y las interacciones entre la vista y el modelo. Esta organización modular facilita el mantenimiento del código, la depuración y la escalabilidad.


2. **Escalabilidad**
La arquitectura cliente-servidor facilita la evolución del sistema, permitiendo:

•	**Escalado horizontal**: Alojar el frontend y backend en servidores independientes.
•	**Integraciones futuras**: Como notificaciones, autenticación externa (Google, Facebook), o sistemas de pago.
•	**Migración progresiva**: A un modelo basado en microservicios si el sistema lo requiere en el futuro.
**Beneficio**: A diferencia de un modelo monolítico, este enfoque es más flexible para adaptarse a las necesidades cambiantes del proyecto. Además, con el patrón MVC, podemos escalar más facilmente cada componente del sistema de forma independiente. Por ejemplo, si necesitamos modificar o añadir nuevas características a la lógica de negocio, podemos hacerlo sin afectar la presentación o la gestión de datos.

3. **Mejor Despliegue y Mantenimiento
Separar el frontend y backend permite optimizar su despliegue de manera independiente:
•	**Backend**: Se desplegará en plataformas como Railway o AWS, utilizando MongoDB Atlas para la gestión de datos.
•	**Frontend**: Será alojado en Vercel o Netlify, permitiendo actualizaciones rápidas y seguras.
**Beneficio**:
•	Las actualizaciones del frontend no interrumpen el funcionamiento del backend y viceversa.
•	Facilita la implementación de CI/CD (despliegues continuos).
•	Reducción de errores y tiempo de inactividad durante el mantenimiento

**Patrón MVC**:  La separación entre los modelos, controladores y vistas facilita que los despliegues se realicen de forma más organizada y sin interferencias entre las capas. El Modelo puede evolucionar o ser actualizado sin afectar la Vista o el Controlador, lo que optimiza el tiempo de despliegue y mantenimiento.

4. **Mejor Seguridad y Gestión de Datos**
Con esta arquitectura, el backend es responsable de la lógica de seguridad y manejo de datos sensibles:
•	**Autenticación**: Implementación de JWT (JSON Web Tokens) para sesiones seguras.
•	**Restricciones**: Aplicación de políticas CORS para controlar el acceso a la API.
•	**Protección de datos**: Validación y almacenamiento seguro de credenciales y datos de usuario.
**Beneficio**: En un modelo monolítico, estas medidas serían más difíciles de gestionar debido al acoplamiento entre frontend y backend.

**Patrón mvc**:En el backend, el Controlador gestionará las validaciones y la lógica de autenticación, mientras que el Modelo será responsable de almacenar de manera segura las credenciales y otros datos sensibles. Esto ayuda a centralizar y simplificar la gestión de seguridad, manteniendo una arquitectura limpia y bien organizada.

5. **Optimización de la Experiencia del Usuario (UX)**
Un frontend moderno desarrollado con React + Vite permite:
•	Actualizaciones dinámicas sin recargar la página, mejorando la fluidez.
•	Reutilización de componentes para mantener un código limpio y eficiente.
•	Interactividad avanzada, lo que resulta en una mejor experiencia para los usuarios.
**Beneficio**: Con un frontend independiente, las mejoras en la UI pueden implementarse de forma más ágil, sin depender de cambios en el backend.

**Patrón MVC**: El patrón MVC nos permite que las vistas sean más fácilmente reutilizables y dinámicas, ya que se encuentran separadas de la lógica del modelo y el controlador. De este modo, podemos mejorar la UX sin necesidad de modificar la lógica de negocio en el backend.


**Conclusión**
La arquitectura cliente-servidor junto con el patrón MVC no solo se ajusta a los objetivos actuales del proyecto ResQFood, sino que también garantiza su sostenibilidad y capacidad de expansión en el futuro. Esta combinación proporciona una estructura clara que facilita el desarrollo, mantenimiento y escalabilidad del proyecto, y permite una distribución eficiente de las responsabilidades entre los equipos.  Este enfoque nos posiciona para ofrecer una plataforma confiable, eficiente y escalable para abordar el problema del desperdicio de alimentos. 

---


## 3.5. Mongo DB para la base de Datos

 Para la base de datos de nuestro proyecto Utilizaremos Mongo DB debido a las siguientes razones:

 1. **Flexibilidad en el manejo de datos no estructurados**: MongoDB es una base de datos NOSQL que utiliza un modelo basado en documentos JSON. Esto es ideal para ResQFood, ya que los datos relacionados con usuarios, publicaciones de donaciones, solicitudes y notificaciones pueden variar en estructura.
 2. **Escalabilidad horizontal**: ResQFood tiene el potencial de crecer exponencialmente, especialmente si se adopta por una comunidad amolica. MongoDB permite escalar horizontalmente mediante la fregmentación de datos, lo que garantiza un rendimiento óptimo incluso con grandes volúmenes de datos y multiples usuarios simultáneos.
 3. **Velocidad en el desarrollo**: Dado que MongoDB utiliza un formato JSON para almacenar documentos, se integra facilmente con Javascript y Node.js, que son  parte del stack MERN que usamos. Esto acelera el desarrollo, ya que no es necesario mapear entre modelos relacionales y objetos de código.
 5. **Alta disponibilidad y replicación**: MongoDB ofrecee caracteristicas avanzadas como replicación yrecuperación ante desastres, asegurando que los datos de los usuarios, publicaciones y solicitudes estén disponibles de manera confiable, incluso en caso de fallos.
 6. **Adopción de tecnología moderna**: MongoDB es ampliamente utilizado en aplicaciones modernas debido a su capacidad de manejar grandes volumenes de datos y proporcionar un rendimiento consistente. Esto asegura que ResQFood esté basado en tecnología moderna y escalable, adecuado para aplicaciones que buscan crecer con el tiempo.
 7. **Reducción del desperdicio de tiempo en migraciones**: A diferencia de bases de datos relacionales que requieren modificaciones constantes en el esquema conforme evolucionan las necesidades del proyecto, MongoDB se adapta facílmente a cambio en los datos sin necesidad de migraciones complejas.


## 3.6. [Modelado de la base de datos]

![Entidad Usuario](img/modeladoBD/USUARIO.png)
![Entidad Solicitud](img/modeladoBD/SOLICITUD.png)
![Entidad Reporte](img/modeladoBD/REPORTE.png)
![Entidad Notificacion](img/modeladoBD/NOTIFICACION.png)
![Entidad Entrega](img/modeladoBD/ENTREGA.png)
![Entidad Donacion](img/modeladoBD/DONACION.png)
![Entidad Calificacion](img/modeladoBD/CALIFICACION.png)
![Entidad Bitacora accion admin](img/modeladoBD/BITACORA-ACCION-ADMIN.png)

![modelo entidad relacion](img/modeladoBD/MODELO-ENTIDAD-RELACION.png)


---


## 4. Diseño y Experiencia de Usuario (UX/UI)

## 4.1 Concepto de Diseño
El diseño de ResQFood se basa en una **estética minimalista**, enfocada en la claridad, la usabilidad y una experiencia de usuario intuitiva. El objetivo es que la plataforma sea accesible para todo tipo de usuarios, sin distracciones visuales.


## 📚 Documentación de Diseño - Resqfood

## 4.2. Guía de Estilo Visual


####  Paleta de Colores
La siguiente paleta se enfoca en tonos suaves, neutros y modernos, con énfasis en la simplicidad visual.
**Colores Principales**:
**Color Primario**:
•	Hex: #5A738E
•	RGB: (90, 115, 142)
•	Uso: Botones primarios, encabezados, enlaces activos.
**Color Secundario**:
•	Hex: #A8D5BA
•	RGB: (168, 213, 186)
•	Uso: Elementos secundarios como íconos, etiquetas o botones secundarios.
**Colores de Fondo**:
**Fondo Claro (Principal)**:
•	Hex: #FFFFFF
•	RGB: (255, 255, 255)
•	Uso: Fondo de la aplicación, tarjetas y formularios.
**Fondo Gris Suave**:
•	Hex: #F5F7FA
•	RGB: (245, 247, 250)
•	Uso: Áreas ligeramente contrastadas como secciones o fondos secundarios.
**Colores de Texto**:
**Texto Primario**:
•	Hex: #2E2E2E
•	RGB: (46, 46, 46)
•	Uso: Títulos, encabezados, textos principales.
**Texto Secundario**:
•	Hex: #7D7D7D
•	RGB: (125, 125, 125)
•	Uso: Descripciones, subtítulos, textos de ayuda.
________________________________________

####  Tipografía
Las fuentes utilizadas están pensadas para asegurar legibilidad y estilo moderno.
**Fuente Principal**:
•	Nombre: Inter
•	Estilos: Regular, Medium, Bold
•	Uso: Textos generales, encabezados, formularios, botones.
**Fuente Secundaria (opcional)**:
•	Nombre: Poppins
•	Estilos: Regular, Bold
•	Uso: Titulares grandes, citas destacadas.
**Tamaños de Fuente**:
•	Títulos Principales (H1): 32px
•	Subtítulos (H2): 24px
•	Texto Normal: 16px
•	Texto Secundario: 14px
•	Botones: 16–18px
________________________________________

####  Iconografía
**Estilo de íconos**: Lineales, minimalistas y monocromáticos. Se prioriza la claridad y consistencia.
**Librerías sugeridas**: Lucide Icons, Feather Icons, Heroicons.
**Íconos Relevantes**:
•	🥗 Íconos de Alimentos: Representan categorías (frutas, verduras, pan, etc.).
•	🎁 Íconos de Donaciones: Corazón, caja abierta, manos.
•	👤 Íconos de Usuario: Perfil, avatar, ajustes.
•	🔍 Íconos de Filtro: Lista, embudo, sliders.
________________________________________

####  Espaciado y Márgenes
El espaciado generoso ayuda a mantener una estética limpia y profesional.
**Recomendaciones**:
•	Márgenes exteriores: 24px
•	Márgenes internos: 16px
•	Espaciado entre elementos: 24px
•	Distancia entre secciones/párrafos: 16px
________________________________________
#### 6. Elementos Interactivos
**Botones**:
**Botón primario**:
•	Fondo: #5A738E
•	Texto: Blanco
•	Bordes: Redondeados (8px)
•	Hover: Oscurecimiento leve + transición suave
**Botón secundario**:
•	Fondo: #A8D5BA
•	Texto: Gris oscuro
•	Borde: 1px sólido gris claro
•	Hover: sombra sutil
**Formularios**:
•	Bordes suaves (#E0E0E0)
•	Texto de entrada en gris oscuro
•	Placeholder gris claro
•	Bordes redondeados (8px)
•	Transición de foco con borde verde menta
________________________________________
#### 7. Otros Elementos Visuales#### 
**Loader (Cargando)**:
•	Animación de círculo giratorio en gris suave o verde claro.
**Alertas**:
•	Éxito: Fondo #A3E4D7 – Texto blanco o gris oscuro.
•	Error: Fondo #F5B7B1 – Texto rojo oscuro.
•	Info: Fondo #F0F3F4 – Texto gris.
**Modal de Confirmación**:
•	Fondo oscuro semitransparente
•	Cuadro blanco con bordes redondeados
•	Botón primario centrado

![Diseño Home Page](img/diseño.jpeg)


---


## 4.3. Bocetos Iniciales

![Diseño Home Page](img/bocetos/PrimerSketch.jpeg)

**Mapa de donaciones**:
![Diseño Home Page](img/bocetos/mapaDeDonaciones.jpeg)

**Principal, opción de creación y filtrado de publicaciones**:
![Diseño Home Page](img/bocetos/principalCreacionFiltPublic.jpeg)

**Creación de publicación**:
![Diseño Home Page](img/bocetos/creacionPublicacion.jpeg)

**Publicación creada**:
![Diseño Home Page](img/bocetos/publicacionCreada.jpeg)
![Diseño Home Page](img/bocetos/publicacionCreada2.jpeg)

**Notificaciones**:
![Diseño Home Page](img/bocetos/notificaciones.jpeg)
![Diseño Home Page](img/bocetos/notificaciones2.jpeg)

**Información de retiro**: 
![Diseño Home Page](img/bocetos/informacionDeRetiro.jpeg)

**Información de alimento donado**:
![Diseño Home Page](img/bocetos/infoAlimentoDonado.jpeg)

**Información de solicitudes**:
![Diseño Home Page](img/bocetos/infoSolicitudes.jpeg)

**Usuario general**:
![Diseño Home Page](img/bocetos/usuarioGeneral.jpeg)

**Historial de donaciones**:
![Diseño Home Page](img/bocetos/historialDonaciones.jpeg)

**Historial de recepciones**:
![Diseño Home Page](img/bocetos/hitorialRecepciones.jpeg)

**Calificaciones**:
![Diseño Home Page](img/bocetos/calificaciones.jpeg)

---

## 4.4. Prototipo Interactivo
Para visualizar el prototipo interactivo del diseño de la aplicación, visita el siguiente enlace en Figma:  
[Prototipo ResQFood en Figma](https://www.figma.com/design/3JPAqtqi6R1U7tjWSTbVaU/ResQfood?node-id=0-1&t=CYVF0Fi65byTt0KI-1)


![Qr figma](img/prototipos/qr_resqfood_figma.png)


---


# 5. [Despliegue]

La aplicación está desplegada y accesible públicamente a través de los siguientes enlaces:

![Link](https://res-q-food.vercel.app/)

![Qr](img/despliegue/vercel.png)