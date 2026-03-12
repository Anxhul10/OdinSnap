<p align="center">
  <img src="https://github.com/user-attachments/assets/39fad66c-b801-46cd-a00f-b572be83749c" width="500" height="400" alt="OdinSnap" />
</p>

## Why use OdinSnap

OdinSnap is a smart visual regression testing tool designed to optimize UI testing workflows. Instead of running visual tests for the entire Storybook, OdinSnap analyzes the Git changes in a project and identifies the components that were modified or affected.

It builds Storybook, determines the impacted components, generates a regex filter for those components, and runs **Loki visual tests** only for the relevant stories. This significantly reduces testing time and makes visual regression testing more efficient in large UI codebases.

By focusing only on changed and dependent components, OdinSnap helps developers detect visual regressions faster while avoiding unnecessary test executions.

## Prerequisites

- [Node.js](https://nodejs.org/) **16+**
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)
- [Loki](https://loki.js.org/) (Visual Regression Testing for Storybook)

## Usage

    yarn add odinsnap
    yarn odinsnap

## Workflow Overview

- OdinSnap uses **Loki** for visual regression testing with **Storybook**
- Start the Storybook server (default: **port 6006**)
- Make changes to your components
- OdinSnap detects changed files and identifies affected components
- Loki tests run **only for those affected components**

## TODO

- Add **monorepo support**
- Export a function that returns the **generated regex for affected components**
- Add **CLI support for other visual regression tools**
  
## Example

Coming soon!

## Development

Clone the repository:

    git clone https://github.com/Anxhul10/OdinSnap.git

Navigate to the project:

    cd OdinSnap

Link the package locally:

    npm link

In the same terminal, navigate to a project that has **Loki installed** and run:

    odinsnap

## Working (Experimental – might change)

![image](https://github.com/user-attachments/assets/8dba7cea-8f0a-4a21-a597-5b5b2ad45231)
