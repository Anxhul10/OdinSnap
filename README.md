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
- [Storybook](https://storybook.js.org/) **v8**
- [Loki](https://loki.js.org/) (Visual Regression Testing for Storybook)
- [npx](https://docs.npmjs.com/cli/v8/commands/npx)

## OdinSnap Configuration

You can configure OdinSnap in your `package.json` so it understands your project structure and can correctly detect which components are affected by code changes.

Example:

```json
{
  "odinsnap": {
    "barrelFiles": ["src/js/components/index.js", "src/js/index.js"],
    "depth": 4
  }
}
```

---

### `depth`

`depth` tells OdinSnap where the **component folder appears in the file path**.

Example structure:

```
src / js / components / Button / Button.js
                       ↑
                    depth = 4
```

The value should point to the **folder that represents the component itself** (e.g., `Button`).  
This helps OdinSnap determine which component a changed file belongs to and match it with the corresponding Storybook stories.

---

### `barrelFiles`

Barrel files are files that **re-export multiple components from a single entry point**.

Example:

```js
// src/js/components/index.js
export * from "./Button";
export * from "./Input";
export * from "./RadioButton";
```

Changes in these files can affect **many components at once**, which can cause OdinSnap to incorrectly detect every component as affected.

By listing these files in `barrelFiles`, OdinSnap will **ignore them when detecting affected components**.

**Note:**  
If a barrel file exists **inside a specific component folder** and only exports files from that component, it does **not need to be ignored**, since it only affects that single component.

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

- **Example Repository:**  
  https://github.com/Anxhul10/grommet/tree/demo/odinsnap

- **Demo Video:**  
  https://youtu.be/dN_HVi4O5Kw

## Development

Clone the repository:

    git clone https://github.com/Anxhul10/OdinSnap.git

Navigate to the project:

    cd OdinSnap

Link the package locally:

    npm link

In the same terminal, navigate to a project that has **Loki installed** and run:

    odinsnap

## Contributing

Contributions are welcome! You can contribute in multiple ways:

- **Report bugs or suggest improvements** by opening an issue
- **Discuss ideas or features** through issues
- **Submit pull requests** with fixes or new features
- **Improve documentation**

### Reporting Issues

If you find a bug or have a feature request, please open an issue and include:

- A clear description of the problem or suggestion
- Steps to reproduce (if it's a bug)
- Expected vs actual behavior
- Any relevant logs or screenshots

### Submitting Changes

1. Fork the repository
2. Create a new branch

   git checkout -b feature/my-feature

3. Make your changes and commit them

   git commit -m "feat: add new feature"

4. Push to your fork

   git push origin feature/my-feature

5. Open a Pull Request

Please ensure your changes follow the existing coding style and include relevant tests if applicable.

## Working (Experimental – might change)

![image](https://github.com/user-attachments/assets/8dba7cea-8f0a-4a21-a597-5b5b2ad45231)
