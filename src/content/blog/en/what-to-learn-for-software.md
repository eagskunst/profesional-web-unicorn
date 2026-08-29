---
title: "What you need to learn if you want to dive deeper into the world of software"
description: "My advices for new coders or people who want to sharpen their software engineering skills"
pubDate: 2026-08-29
author: "Emmanuel Guerra"
tags: []
---

Gemini, ChatGPT, Claude, all of them are capable of writing software faster than any human. Nowadays, with a $20 subscription, you can launch your own projects, build those apps you always had in mind, or fix issues in your existing businesses that used to require consulting and months of development.

Just because anyone can write code now doesn't mean all written code is good. Software suffers from fragility: it's very easy for something to break and to fix it, but with each iteration, it becomes harder to find (and resolve) the root cause of the problem. Even if we configure specialized code-review agents, users will always find ways to break applications.

So much so that if you previously didn't understand code, it's normal to find yourself in conversations where 90% of the prompts are requests for minor adjustments to your project: remove this detail, widen the margins, animations stop working, the page freezes after a few minutes...

Frustration sets in; you feel like you wasted your time. You start a new chat, try again, **jackpot!** the agent fixed the problem, and you can move on to your next task. And the cycle starts all over again: dopamine, frustration, dopamine, frustration.

If you are interested in what you should learn to avoid constantly falling into frustration while developing your idea, or if you're taking your first steps in your career, here are several points that can help you understand the fundamentals and rules of this world. Remember: *only those who know the rules know how to break them* 😉.

## Databases

One way or another, 90% of applications require persistence to operate. Understanding how a database should be designed, normalization rules, the engine, how to run queries, join tables—all of that makes the difference between asking AI for a generic result with generic response times versus an **exceptional** result with **extremely fast** response times.

## Data Structures and Algorithmic Complexity

Building a shopping cart, showing certain deals sequentially to users, ensuring only one user can access a list. Under the hood, everything is built with data structures. Although everything can be done with a *list*, they aren't swiss army knives, nor do they work well for every case. Now with AI, much of this analysis takes a back seat, but it isn't always perfect.

The attention mechanism used by *LLMs* often assumes something is fine based on its training, but that **does not mean** it's exactly what your use case needs.

## Design Patterns and Architecture

Code, even with AI, is read far more often than it is written. Imagine reading a 3,000-line file. I've been there. Regardless of which AI agent we use, this creates context overload for both humans and AI.

AI generates the code, but we are responsible for what the user ultimately uses! Properly designing our code to be modular and reusable is key for teams of any size, making it easier to scale our codebase and avoid having 10-parameter functions with countless branches that can't be *debugged* because [only the AI understands it](https://arxiv.org/abs/2508.21634).

## System Design

Should we use a SQL or NoSQL database? Do we prioritize concurrency or parallelism? Should it be resilient or fail fast?
AI **does not replace your judgment**. Designing systems requires opinions, drawing from our experiences, knowing or believing what works and what doesn't, and identifying where bottlenecks lie. All of this comes with practice and experience. Now more than ever, the difference between solutions to fix issues in our software comes down to understanding the trade-offs when implementing a specific tool.

## A Pass-by-Reference Language

Given the capabilities of modern devices, many people tend to ignore how much memory a program consumes... until they start [losing users](https://www.researchgate.net/publication/220580618_Web_Site_Delays_How_Tolerant_are_Users).

Despite having a new abstraction layer with the arrival of coding agents and their harnesses, knowing how a low-level language operates remains indispensable. Understanding how pass-by-reference works and how memory is managed allows us to make much better use of our applications' resources.

My personal recommendation is C and C++ for being relatively approachable (they aren't COBOL or Pascal) and because they serve as the foundation for (almost) all modern languages.

*Optimized application + Stability = Happy users*

## Patience

When I started programming and decided to pursue a career in software, I realized that every week there was something new: tools, languages, frameworks, libraries.
This is still true, and now more frequently than ever. The number of public models being trained updates every week. Competition is driving companies to invest in research to see what else these models can do to deliver better results: from parallel agents to MCP servers, what was recommended in 2025 is no longer the same in 2026, and I'm sure it won't be for 2027.
However, this goes hand in hand with the previous point. Not all that glitters is gold. Testing and knowing the limits of these tools helps us understand what works and what doesn't, what can truly serve users and what is merely a passing fad. The only way to properly handle frustration and gain the discipline to learn and stay curious is to have patience with ourselves and with the industry.

We are facing a new revolution that, in my opinion, some mistake for a bubble. As in all engineering disciplines, the fundamentals hold the rules of the game. AI is a multiplier: a 10x of what we already are. The difference lies between curiosity and practice to achieve our goals, or staying in our comfort zone and maintaining the *status quo* of what we know.
