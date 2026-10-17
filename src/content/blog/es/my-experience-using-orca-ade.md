---
title: "Mi experiencia usando Orca ADE"
description: "Un mes utilizando Orca, el Agentic Development Environment de Stably AI, para trabajar con múltiples agentes y worktrees en paralelo."
pubDate: 2026-10-17
author: "Emmanuel Guerra"
tags: []
---

“Tenemos que revisar X con urgencia”  
“Hay que arreglar X antes de pasar a producción”  
“¿Cómo se hace esto en el feature X que estabas desarrollando?”  
“¿Cómo funciona X en iOS?”

Estos casos que llegaban mientras estaba desarrollando normalmente me sacaban de foco y me obligaban a realizar el siguiente flujo:

1. Stash o commit temporal con todos los archivos en los que estaba trabajando.
2. Buscar la rama o el proyecto en específico.
3. Encontrar el código específico.
4. Resolver el problema o hacer tracing del ticket/historia para entender las decisiones que se tomaron.
5. Volver a la rama en la que estaba trabajando.

Este flujo tiene mucha fricción y, más que todo, me hacía perder el hilo de desarrollos que necesitaban toda mi atención. Un problema de los IDE es que no tienen una forma nativa de trabajar con [`git worktree`](https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/), y específicamente para los casos de Mobile, copiar configuraciones a mano resulta engorroso, y un script puede tender a desactualizarse rápidamente sin un control y gobierno claros.

Los agentes trabajan excelentemente con la terminal. Junto con los avances en razonamiento y con los modos automáticos, el objetivo debe ser ejecutarlos en paralelo, dándole atención a lo que lo requiere según las preguntas del agente o de los agentes. Debería ser un trabajo sencillo y no requerir tener una instancia del editor que utilicemos por worktree, configurarlo, asegurarnos de que pueda compilar, que el agente se mantenga dentro de los límites del workspace…

De ahí sale la idea de [ADE: Agentic Development Environment](https://aidenapp.org/agentic-development-environment). Una aplicación que permita a los agentes ejecutarse en paralelo, dado un mismo (o varios) repositorios, con un desarrollador encargado de instruirlos. Esto es una idea que ya manejan internamente las aplicaciones de chats simples: pueden tener varios chats en paralelo, responder o hacer más preguntas, y seguir iterando. El ADE traslada esto al desarrollo.

Aunque al principio estaba escéptico porque no estaba seguro de que esto pudiera funcionar para repositorios de apps móviles por sus estructuras, estuve utilizando Orca, el ADE de Stably AI, durante un mes para resolver los problemas y fricciones del desarrollo pre-agentes y, la verdad, estoy muy contento y lo he vuelto mi entorno permanente de desarrollo. Aunque no he borrado los IDE por defecto para cada plataforma, como Android Studio, los he utilizado para contados casos de cambios manuales y para ejecutar mi `worktree` principal.

## Puntos fuertes de Orca:

### Manejo de worktrees y espacio

Orca crea un directorio para organizar tus worktrees. Ahí envía una copia de tu proyecto, en una rama nueva o existente del proyecto, con el nombre que le quieres dar, o basado en un issue de tu repositorio. Puedes hacer nuevos worktrees desde un worktree (relación padre-hijo). Todos los worktrees los puedes visualizar a la izquierda de la app. En el centro, te muestra lo más importante: la interfaz para hablar con el agente, el navegador integrado o un archivo. A la derecha, puedes ver el directorio donde estás y sus archivos, la interfaz para crear commits y PRs, el historial de tus sesiones con agentes y un checklist configurable antes de mandar un PR.

Viene por defecto con atajos de teclado para crear nuevas terminales, abrir el simulador de Android/iOS, navegadores web y buscar archivos. Básicamente te da la mano para que trabajes directamente desde aquí y reduzcas las aplicaciones a las que les debes dar tu atención.

### Configuración por proyecto

Tienes la opción de ejecutar comandos comunes para todos los repositorios (p. ej., `git fetch && git status`) y la granularidad de configurar scripts al iniciar un proyecto, junto con copiar/enlazar (con symlink) archivos y directorios que quieras reusar cada vez que crees un nuevo espacio de trabajo/worktree.

### Terminal first y manejo de ventanas

La forma más rápida en la que se mueve un desarrollador es la terminal. La IA es extremadamente rápida utilizando la terminal, y la prefiere sobre cualquier UI: es más óptimo, a nivel de uso, que obligarla a utilizar interfaces. En Orca, todo se maneja desde la terminal: agentes, navegador, su propio CLI.

Utiliza Ghostty como motor para la terminal, lo cual le da un plus visual que no tienen las terminales por defecto de los sistemas operativos. Además, te deja traer tu propia configuración de Ghostty y te permite dividir las ventanas de la terminal de la forma que quieras. Mi favorita es tener la terminal al lado del emulador de celular para pruebas y verificación.

### Comandos configurables

Lo de toda la vida:

- Actualizar dependencias.
- Compilar y ejecutar.
- Iniciar o detener un contenedor.

Normalmente tenemos interfaces que simplemente se traducen en una serie de comandos, o scripts que los ejecutan. Orca te da la facilidad de agregar los comandos que necesites para tu proyecto, o de forma general para todos los proyectos de cada espacio de trabajo.

### Markdown editor y notas dentro del md editor

Últimamente paso más y más tiempo leyendo, y ya no solo por hobby. Los LLM son fans (y justificadamente) de generar documentos. Orca sabe de esto, y viene con un excelente editor de Markdown. El editor te permite cambiar fácilmente entre el texto enriquecido y el texto crudo, hacer ediciones y enviarle comentarios directamente a un agente en la terminal que elijas (mi favorita). Además, puedes exportar los MD como PDFs o como Orca Artifacts sin salir de Orca.

### Stats

Abajo a la izquierda siempre vas a tener una barra de progreso del uso que le has dado a tus suscripciones, en cuánto va tu límite diario/por horas y tu límite semanal. Tienes también la opción de gatillar resets que tengas dentro de tus suscripciones. En general es muy conveniente para saber cuántos agentes paralelos puedes ejecutar, así le das prioridad a lo más urgente o puedes seguir trabajando en tareas secundarias.

Además, hay una sección de estadísticas que te puede servir para tener un insight siempre presente de cuántos tokens has gastado, el número de agentes que has creado, filtrarlo por proveedores, entre otros, que son interesantes para nerds y para justificar (o justificarte) más créditos.

## Dónde he notado que podría mejorar:

### Android emulator se ejecuta muy lento (manualmente)

Aunque puedes agregar cualquier emulador de Android e iOS, estos no toman taps de la misma forma que al lanzar el emulador directamente desde Android Studio o Xcode. Quizás es una limitante interna de Orca por usar scrcpy o algo similar. El caso es que no lo recomiendo para ingresar taps manuales. La skill para manejar el emulador sí es muy buena y, aunque no lo he medido, me parece que es más efectiva a nivel de tokens que la forma clásica que intentan utilizar los LLM para manejar los simuladores.

### No hay UI para realizar acciones extendidas con Git

Aunque este es un punto de fricción muy personal, debo decir que dada su relación con la terminal, Orca no te da una forma sencilla de realizar stash, commit o cambiar ramas. Quizás suena un poco contraintuitivo con mis comentarios apreciando que todo se enfoca en la terminal, pero para mi gusto personal, prefiero cambiar ramas y hacer fetch/pull desde una UI que gastar tokens haciéndolo. Tampoco me gusta que la UI para hacer commits manuales es muy simplista: en lugar de checkbox, tienes que sumar archivos al stage o sacarlos del stage. Estoy intentando pasar a realizar full commits con los agentes, pero aún no estoy tan convencido. Por ahora, el caso donde lo he justificado es, después de la revisión, que el agente ejecute commits granulares y/o parciales de archivos.

### No se puede configurar un agente por defecto para cada proyecto

Esto es un feature que no entiendo por qué no está implementado, dada la granularidad que mencioné en sus mejores puntos. Si bien puedes configurar un agente global para todos los proyectos, lo que facilita crear nuevas terminales con el agente por su atajo de teclado, si estás probando o utilizas múltiples suscripciones, no puedes especificar qué CLI de agente utilizas para ciertos proyectos. Cosa molesta porque tienes que:

1. Usar directamente la skill de orquestación para que genere nuevos agentes sin preocuparte por el proveedor que usará.
2. Utilizar directamente la UI para crear una nueva terminal con el proveedor específico.

### “Create PR” me decepcionó

No uso el botón de crear PR. Su alcance debe ser solo eso: revisar si puede crear un PR de código publicado o por publicar y listo. En general se sale de los guardrails que (quizá incorrectamente) asumo que debe tener. Esto es porque lo que hace es básicamente levantar un nuevo agente que se encargue de esta tarea. Lo malo:

- No puedes visualizar el agente.
- No sabes cuándo terminará ni qué decisiones toma.
- Por lo tanto, toma decisiones por sí solo.

Una opción que no he utilizado es ajustar el prompt que ejecuta al darle al botón, pero no lo he podido justificar porque simplemente es más fácil indicarle, desde la sesión en la que estoy trabajando, que suba el PR con el estado actual.

### Falta de plugins y proactividad

Me gustaría ver a Orca actuando mejor como asistente en tu flujo:

- “Guarda este comando que has usado N veces”.
- “Vuelve este flujo una skill”.
- “Agrega un nombre estándar a tus agentes basado en el prompt inicial”.

Todo esto creo que se puede realizar a través de las propias suscripciones de los usuarios. Y todo esto lo podríamos realizar nosotros mismos, con un agente, con la intención de publicar plugins para Orca.
Aunque ya hay soporte para plugins, no he encontrado ninguno que justifique su instalación y tampoco he visto apoyo de la comunidad para crearlos, como sí pasa con los plugins para agentes de código.

Como nota final, puedo decir que lo he probado y llegué para quedarme en este tipo de aplicaciones. El código sigue siendo importante y es nuestra responsabilidad revisarlo activamente y asegurarnos de que lo que ve el usuario final sea un producto bien pulido, pero poco a poco hay otras cosas que cobran más importancia:

- Cuánto podemos paralelizar.
- El ‘Context length’ y la atención del humano.
- Los documentos y la comprensión lectora.

Utilizar un IDE, por su naturaleza de espacios de trabajo singulares, dificulta la paralelización y la colaboración de múltiples humanos y agentes en los repositorios de código. Siento que el enfoque de Orca en darle más importancia a los agentes es el camino que poco a poco va a tomar la industria y en el que, seguramente, empresas como JetBrains y Microsoft empiecen a enfocar sus esfuerzos para trabajar con sus entornos que por muchos años sirvieron de base y como producto, pero se quedan rezagados en esta era de desarrollo con agentes.

P. D.: Cuando instalé Orca, sumé todas las skills recomendadas y básicamente lo único que no he probado es:

- Voice
- Orca Relay
- Automations
- Features que requieren cuenta
- Remote servers
- Chat UI (por si no te gusta la terminal!)
