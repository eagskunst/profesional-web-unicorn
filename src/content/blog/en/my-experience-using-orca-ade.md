---
title: "My experience using Orca ADE"
description: "One month using Orca, Stably AI's Agentic Development Environment, to run multiple agents and git worktrees in parallel."
pubDate: 2026-10-17
author: "Emmanuel Guerra"
tags: []
---

“We need to check X urgently”  
“We have to fix X before going to production”  
“How is this done in feature X you were developing?”  
“How does X work on iOS?”

When these requests came up while I was coding, they usually broke my focus and forced me through the following workflow:

1. Stash or create a temporary commit with all the files I was working on.
2. Find the specific branch or project.
3. Locate the specific code.
4. Solve the problem or trace the ticket/story to understand the decisions that were made.
5. Switch back to the branch I was working on.

This workflow has a lot of friction and, more than anything, made me lose my train of thought on tasks that needed my full attention. One problem with IDEs is that they don't have a native way to work with [`git worktree`](https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/), and specifically for Mobile development, copying configurations by hand is tedious, while a script can quickly become outdated without clear governance and control.

Agents work great in the terminal. Combined with advances in reasoning and autonomous modes, the goal should be to run them in parallel, giving attention to whatever requires it based on the questions from the agent—or agents. It should be straightforward and not require opening a separate editor instance per worktree, configuring it, making sure it compiles, ensuring the agent stays within the workspace boundaries…

That is where the idea of an [ADE: Agentic Development Environment](https://aidenapp.org/agentic-development-environment) comes from. An application that allows agents to run in parallel across one (or several) repositories, with a developer in charge of instructing them. This is an idea that simple chat applications already handle internally: you can have multiple chats in parallel, answer or ask more questions, and keep iterating. The ADE brings this paradigm to software development.

Although I was skeptical at first because I wasn't sure this could work for mobile app repositories given their structure, I spent a month using Orca, Stably AI's ADE, to solve the problems and friction of pre-agent development—and honestly, I'm very happy with it and have made it my permanent development environment. Even though I haven't uninstalled the default IDEs for each platform, such as Android Studio, I've only used them for a handful of manual changes and to run my main `worktree`.

## Orca's strengths:

### Worktree and workspace management

Orca creates a directory to organize your worktrees. There it places a copy of your project, on a new or existing branch, with whatever name you want to give it, or based on an issue from your repository. You can create new worktrees from an existing worktree (parent-child relationship). All your worktrees are visible on the left side of the app. In the center, it shows what matters most: the interface to talk to the agent, the built-in browser, or a file. On the right, you can see your current directory and its files, the interface to create commits and PRs, your agent session history, and a configurable checklist before submitting a PR.

It comes with default keyboard shortcuts to create new terminals, open the Android/iOS simulator, launch web browsers, and search for files. Essentially, it helps you work directly from one place and reduces the number of applications competing for your attention.

### Per-project configuration

You have the option to run common commands across all repositories (e.g., `git fetch && git status`) as well as the granularity to configure startup scripts for a project, along with copying or symlinking files and directories you want to reuse every time you create a new workspace/worktree.

### Terminal-first and window management

The fastest way a developer moves is through the terminal. AI is extremely fast using the terminal and prefers it over any UI: in terms of usage, it is much more optimal than forcing it to interact with graphical interfaces. In Orca, everything is driven from the terminal: agents, browser, and its own CLI.

It uses Ghostty as its terminal engine, giving it a visual edge over default OS terminals. It also lets you bring your own Ghostty configuration and split terminal panes however you like. My favorite layout is having the terminal right next to the mobile emulator for testing and verification.

### Configurable commands

The classics:

- Update dependencies.
- Build and run.
- Start or stop a container.

We usually rely on UI buttons that simply translate into a series of commands, or scripts that execute them. Orca makes it easy to add the commands you need for a specific project, or globally across all projects in every workspace.

### Markdown editor and in-editor notes

Lately I've been spending more and more time reading, and not just as a hobby. LLMs love (and rightfully so) generating documents. Orca knows this and comes with an excellent Markdown editor. The editor lets you easily switch between rich text and raw text, make edits, and send comments directly to an agent in the terminal of your choice (my favorite feature). Plus, you can export Markdown files as PDFs or as Orca Artifacts without leaving Orca.

### Stats

At the bottom left, you always have a progress bar showing your subscription usage, where your daily/hourly limit stands, and your weekly limit. You also have the option to trigger resets available within your subscriptions. Overall, it's very convenient for knowing how many parallel agents you can run, so you can prioritize what's most urgent or keep working on secondary tasks.

In addition, there is a statistics section that gives you an always-available insight into how many tokens you've spent, the number of agents you've created, filtering by provider, and more—great for nerds and for justifying (to your team or yourself) more credits.

## Where I noticed room for improvement:

### Android emulator runs very slowly (manually)

Although you can add any Android and iOS emulator, they don't register taps the same way they do when launched directly from Android Studio or Xcode. Maybe it's an internal limitation of Orca from using scrcpy or something similar. Either way, I don't recommend it for manual tap input. On the other hand, the skill for controlling the emulator is very good, and although I haven't benchmarked it, it feels more token-efficient than the classic approach LLMs try to use to drive simulators.

### No UI for extended Git actions

While this is a very personal friction point, given its relationship with the terminal, Orca doesn't give you a simple way to stash, commit, or switch branches. It might sound counterintuitive after praising its terminal-first focus, but personally, I prefer switching branches and running fetch/pull from a UI rather than spending tokens doing it. I also don't like that the manual commit UI is overly simplistic: instead of checkboxes, you have to add or remove files from staging one by one. I'm trying to transition to doing full commits with agents, though I'm not completely sold yet. For now, the case where I find it justified is having the agent create granular and/or partial file commits after code review.

### You can't configure a default agent per project

This is a feature I don't understand why it isn't implemented, given the granularity I praised earlier. While you can configure a global default agent for all projects—which makes spinning up new agent terminals via keyboard shortcut easy—if you're testing or using multiple subscriptions, you can't specify which agent CLI to use for specific projects. That's annoying because you have to either:

1. Use the orchestration skill directly so it spawns new agents without worrying about which provider it will use.
2. Use the UI directly to create a new terminal with the specific provider.

### “Create PR” disappointed me

I don't use the Create PR button. Its scope should be just that: check whether it can create a PR from pushed or unpushed code and be done. In general, it steps outside the guardrails I (perhaps mistakenly) assume it should have. That's because what it basically does is spin up a new agent to handle the task. The downsides:

- You can't see the agent.
- You don't know when it will finish or what decisions it's making.
- Therefore, it makes decisions on its own.

One option I haven't tried is customizing the prompt executed when clicking the button, but I haven't been able to justify doing so because it's simply easier to tell the agent in my active working session to open the PR with the current state.

### Lack of plugins and proactivity

I would love to see Orca act more proactively as an assistant in your workflow:

- “Save this command you've used N times”.
- “Turn this workflow into a skill”.
- “Add a standard name to your agents based on the initial prompt”.

I think all of this could be powered through users' existing subscriptions. And we could even build this ourselves with an agent, with the goal of publishing plugins for Orca.
Even though plugin support already exists, I haven't found any plugin worth installing yet, nor have I seen community momentum around building them the way we see with coding agent plugins.

As a final note, I can say that I've tried it and I'm here to stay in this category of applications. Code is still important, and it remains our responsibility to actively review it and make sure what reaches the end user is a well-polished product, but little by little other things are gaining importance:

- How much we can parallelize.
- Context length and human attention.
- Documentation and reading comprehension.

Using a traditional IDE, by nature of its single-workspace design, makes parallelization and collaboration between multiple humans and agents across code repositories harder. I feel that Orca's focus on putting agents first is the path the industry will gradually take—and where companies like JetBrains and Microsoft will surely start focusing their efforts to adapt environments that served as the foundation and core product for many years, but are falling behind in this era of agentic development.

P.S.: When I installed Orca, I added all the recommended skills, and basically the only things I haven't tried are:

- Voice
- Orca Relay
- Automations
- Features that require an account
- Remote servers
- Chat UI (in case you don't like the terminal!)
