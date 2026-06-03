# Samiti

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## AI Rules

See `AI_RULES.md` for repository-specific AI guidance. When giving instructions to an AI assistant, please ensure the assistant reads `AI_RULES.md` first and follows the guidance there. If any conflict or ambiguity exists, the assistant should ask the user for clarification.

## Prompt rules
1) Core Prompt Format (Best Template)
Template:

Goal: (Kya karna hai)
Context: (Project/tech stack/app ka short context)
Input/Constraints: (Koi fixed rules, file paths, time/size limits, tech restrictions)
Expected Output: (Final output kaisa chahiye—code, steps, links, format)
Success Criteria: (Kaise pata chalega kaam sahi hua)
Examples (optional): (Sample input/output)
Files/Locations (agar apply ho): (Kon si files read/edit karni hain)
Example (structure):

Goal: …
Context: …
Constraints: …
Expected Output: …
Success Criteria: …
Files: …
2) “Always Include” Checklist (Quick)
Language: (Hindi/English—jo chahiye)
Tech: (framework/version—e.g., Angular, Node, React, TS)
Scope: (sirf frontend? backend bhi?)
Do/Don’t: (kya avoid karna hai)
Format: (single file / multiple files / PR style / step-by-step)
Verification: (tests, build, screenshot, command to run)
3) Clarity Rules (Prompt ko strong banane ke tips)
“Make it work” mat likho → “Bug: X, Actual: Y, Expected: Z” likho
“Improve” mat likho → “Improve: performance / readability / security” specify karo
Agar code chahiye:
“Provide complete file content” ya “diff only” clearly bolo
Agar changes multiple files me hon:
“Files: A, B, C” mention karo (warna main repo search karke decide karunga)
4) Output Style Selectors (Choose one line)
You can add one of these at the end:

“Output format: only final code”
“Output format: plan + then code”
“Output format: step-by-step commands + verification”
“Output format: minimal changes (diff style)”
5) Verification Request (Recommended)
Always include:

“How to verify: (run command / expected behavior / test steps)”
6) Your “User Must Follow” Rule (Which you asked me to tell you)
Aap jab bhi mujhe prompt denge, iss exact structure/level me dena try karna:

Goal
Context
Constraints
Expected Output
Success Criteria
(Optional) Files / Examples / Verification
