---
title: "Qué debes aprender si quieres profundizar sobre el mundo del software"
description: "Mis consejos para nuevos coders o personas que quieren pulir sus habilidades en ingeniería de software"
pubDate: 2026-08-29
author: "Emmanuel Guerra"
tags: []
---

Gemini, ChatGPT, Claude, todos ellos son capaces de escribir software más rápido que cualquier humano. Hoy en día, con una suscripción de $20 puedes emprender con tus propios proyectos, lanzar esas aplicaciones que siempre tuviste en tu mente, o arreglar problemas de tus negocios existentes que requerían consultoría y meses de desarrollo.

Ahora que cualquiera puede escribir código, no significa que todo el código escrito sea bueno. El software sufre de fragilidad: es muy fácil que algo se rompa y arreglarlo, pero con cada iteración, se hace más difícil encontrar (y resolver) la causa raíz del problema. Aunque configuremos agentes especializados en revisiones de código, los usuarios siempre van a encontrar formas de romper las aplicaciones.

Tanto así que si antes eras alguien que no entendía código, es normal encontrarte en conversaciones donde el 90% de los prompts son solicitudes de pequeños ajustes a tu proyecto: elimina este detalle, amplía los márgenes, las animaciones se detienen, la página se traba después de algunos minutos...

La frustración llega, sientes que perdiste tu tiempo. Creas una nueva conversación, vuelves a intentar, **¡jackpot!** el agente arregló el problema y puedes continuar con tu siguiente tarea. Y vuelve a empezar el ciclo: dopamina, frustración, dopamina, frustración.

Si estás interesado en qué debes aprender para evitar caer siempre en la frustración durante el desarrollo de tu idea, o estás dando tus primeros pasos en la carrera, te comparto una serie de puntos que te pueden servir para entender las bases y las reglas de este mundo. Recuerda: *solo quienes conocen las reglas saben cómo romperlas* 😉

## Inglés

Los modelos de inteligencia artificial son, en su mayoría, entrenados con datos en inglés. Y aunque ya hay esfuerzos para que los modelos se entrenen para dar resultados igual de óptimos en [distintos lenguajes](https://www.sciencedirect.com/science/article/abs/pii/S0925231225031352), las respuestas de los modelos, aunque no deterministas, tienden a tener mejores resultados cuando se solicitan en inglés.

## Bases de datos

De una forma u otra, el 90% de las aplicaciones necesita persistencia para poder operar. Entender cómo debe crearse una base de datos, las reglas para normalizarla, el motor, cómo ejecutar queries, combinar tablas, todo eso va a ser la diferencia entre pedir un resultado genérico a la IA y que dé un tiempo de respuesta genérico, a un resultado **excepcional** con tiempos de respuesta **extremadamente rápidos**.

## Estructuras de datos y complejidad algorítmica

Construir un carrito de compras, mostrar ciertas ofertas en secuencia a unos usuarios, asegurar que solo un usuario pueda entrar a una lista, por detrás, todo se crea con estructuras de datos. Aunque todo se puede realizar con una *lista*, no son navajas suizas, ni funcionan bien para todos los casos. Ahora con IA, mucho de este análisis pasa a segundo plano, pero no siempre es perfecto.

El algoritmo de atención que utilizan los *LLM* suele asumir que algo está bien por su entrenamiento, pero eso **no significa** que sea lo que exactamente necesita tu caso de uso.

## Patrones de diseño y arquitectura

El código, incluso con IA, se lee con más frecuencia de lo que se escribe. Imagínate leer un archivo de 3k líneas. He estado ahí. Independientemente del agente de IA que usemos, esto es una sobrecarga para el contexto humano y artificial.

La IA genera el código, ¡pero nosotros somos los responsables de lo que finalmente usa el usuario! Diseñar correctamente nuestro código para que sea modular y reutilizable es la clave en equipos de cualquier tamaño, para facilitar escalar nuestro código y no tener funciones con 10 parámetros y muchas ramas que no se pueden *debuggear* porque [solo la IA la entiende](https://arxiv.org/abs/2508.21634).

## Diseño de sistemas

¿Utilizamos una base de datos SQL o NoSQL? ¿Priorizamos concurrencia o paralelismo? ¿Debe ser resiliente o fallar inmediatamente?
La IA **no reemplaza tu criterio**. Diseñar sistemas requiere opiniones, recordar nuestras experiencias, qué sabemos o creemos que funciona y qué no, dónde están los cuellos de botella. Todo esto se consigue con la práctica y la experiencia. Ahora más que nunca, la diferencia entre respuestas para corregir problemas en nuestro software se basa en entender las ventajas y desventajas a la hora de implementar una herramienta en específico.

## Un lenguaje con paso por referencia

Con las capacidades de los dispositivos actuales, mucha gente suele ignorar cuánta memoria consume un programa... hasta que empiezan a [perder usuarios](https://www.researchgate.net/publication/220580618_Web_Site_Delays_How_Tolerant_are_Users).

A pesar de tener una nueva capa de abstracción con la llegada de los agentes de código y sus *harness*, sigue siendo indispensable saber cómo opera un lenguaje de bajo nivel. Entender cómo funciona el paso por referencia y cómo se maneja la memoria nos permite aprovechar mucho mejor los recursos de nuestras aplicaciones.

Mi recomendación personal es C y C++ por ser relativamente amigables (no son COBOL ni Pascal) y porque funcionan como base de (casi) todos los lenguajes modernos.

*Aplicación optimizada + Estabilidad = Usuarios felices*

## Paciencia

Cuando empecé a programar y me decidí a hacer carrera en software, me di cuenta de que cada semana había algo nuevo: herramientas, lenguajes, frameworks, librerías.
Esto sigue siendo real, y ahora con más frecuencia. La cantidad de modelos que son públicos y están siendo entrenados se actualiza cada semana. La competencia está haciendo que las empresas inviertan en investigación de qué más pueden hacer estos modelos para dar mejores resultados: desde agentes paralelos hasta servidores MCP, lo que era lo recomendado en 2025 ya no es lo mismo en 2026, y estoy seguro de que no lo será para 2027.
Aunque esto va de la mano con el punto anterior. No todo lo que brilla es oro. Probar y conocer los límites de estas herramientas nos ayuda a entender qué funciona y qué no, qué puede servirle a los usuarios y qué es solo pasajero. La única forma de manejar correctamente la frustración y obtener la disciplina para aprender y ser curioso es tener paciencia con nosotros y con la industria.

Estamos ante una nueva revolución que, en mi opinión, algunos confunden con una burbuja. Como en todas las disciplinas de la ingeniería, las bases tienen las reglas del juego. La IA es un multiplicador: un x10 de lo que ya somos. La diferencia está entre la curiosidad y la práctica para llegar a nuestros objetivos, o mantenernos en nuestra zona de confort y mantener el *statu quo* de lo que conocemos.
