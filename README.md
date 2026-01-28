# WordPress Monorepo

## Contributing

### Adding an existing Repository to the Monolith

The example below assumes you are adding a theme and uses  
`example-theme` as a placeholder for your existing repository's name.

> ⚠️ This process rewrites history. Do not run it directly on the original repository.

---

#### Pre-step: Freeze development

Before starting the migration:

- Announce a **temporary development freeze** for the theme repository.
- Ensure all open feature branches are merged or closed.
- Publish any final releases that must remain in the original repository.

#### Create a new clone of the existing repository

```bash
git clone git@github.com:bcgov/example-theme.git

cd example-theme
```

#### Rewrite history into the new structure

Move the entire repository history under the monorepo path. This rewrites all commits as though the theme has always lived under the target directory.

```bash
git filter-repo --to-subdirectory-filter themes/example-theme
```

#### Rename existing tags to avoid conflict

> TODO: Determine naming convention (default to theme/theme-slug)

```bash
git filter-repo --tag-rename '':'themes/example-theme/'
```

#### Merge the rewritten theme into the monorepo

> ⚠️ Assuming this directory structure:
>
> ```
> clones/
> └─ example-theme/
> wordpress-monorepo/
> ```

```bash
cd ../../wordpress-monorepo/
git remote add example-theme ../clones/example-theme
git fetch example-theme
git merge --allow-unrelated-histories example-theme/main
```

After the merge, the monorepo should contain:

```
themes/
└─ example-theme/
```

#### Confirming history

If successful, you will be able to see the migrated repository's `git history` and `git blame`

```bash
git log --oneline --graph
```

Or you can view just the commit history of the migrated theme (from root of the monorepo):

```bash
git log -- themes/example-theme
```

Or use `git blame` to confirm line history, authors and timestamps.

```bash
git blame themes/example-theme/README.md
```

#### Additional Branches

Branches besides main can be added as historical references.

> ⚠️ Do not merge release branches into monorepo main.

Each release branch can be recreated as a namespaced branch:

```bash
git checkout -b themes/example-theme/release-1.1.0 example-theme/release/1.1.0
git push origin themes/example-theme/release-1.1.0
```

#### Pushing Tags

You can confirm the tags you will push via

```bash
git tag
```

Then, push any you are happy with

```bash
git push origin --tags
```

##### Naming requirements

- ⚠️ Raw branch names like release/1.1.0 are not allowed in the monorepo, in order to avoid conflics.
- All legacy branches must be namespaced by theme or plugin:
  - `themes/example-theme/release-x.x.x`
  - `plugins/example-plugin/release-x.x.x`

#### Cleanup

```bash
git remote remove example-theme
```

### Workflows | CICD

> TODO: Add steps for adapting these.

#### Release Policy (Current Phase)

This monorepo does not (currently) produce production releases.
All official releases continue to be cut from their original repositories.
Scoped tags and release branches in this monorepo are for historical reference and future planning only.

### Package Management

This repository uses npm workspaces to manage JavaScript dependencies across themes and plugins.

```json
{
  "workspaces": ["themes/*", "plugins/*"]
}
```

This tells npm to:

- Treat each theme and plugin as an independent package
- Install dependencies in a single, shared root node_modules where possible
- Allow workspace scripts (build, test, lint:js) to be run from the root

#### Installing Dependencies

Running from repository root:

```bash
npm install
```

Will:

- Install root-level tooling (e.g. shared build tools, linters)
- Install all workspace dependencies declared in:
  - `themes/*/package.json`
  - `plugins/*/package.json`
- 'Hoist' compatible dependencies to the root `node_modules`

There is no need to run `npm install` inside individual themes or plugins in normal usage.

#### Workspace Scripts

Commands defined to run in the root package.json, e.g.:

```bash
npm run build --workspaces --if-present
```

Will:

- Execute npm run build for each workspace if that script exists in its scoped package.json
- Set the working directory to the workspace itself
- Resolve dependencies starting from the workspace directory then walking upward to the root

#### Declaring Dependencies

Each plugin/theme must:

- Include its own package.json
- Declare all packages it directly depends on
- Not rely on implicit availability of transitive or peer dependencies

> ⚠️ Even if a dependency is installed at the root, it should still be listed in the theme if it is required at build or runtime.

#### Plugins/Themes with Multiple Packages

Each directory with its own `package.json` is a separate npm package and must either:

- Be included explicitly as a workspace path, or
- Be managed independently and not rely on workspace execution

For example:

```json
{
  "workspaces": [
    "themes/*",
    "plugins/example-plugin",
    "plugins/example-plugin/Blocks/*"
  ]
}
```

Each package must:

- Declare its own dependencies
- Define required scripts (e.g. `build`, `test`, `lint:js`) if it participates in root-level execution

#### Peer Dependency Resolution

Some tooling (e.g. `@wordpress/scripts`) relies on peer dependencies. Because workspace scripts run from the package directory, this can sometimes cause `MODULE_NOT_FOUND` issues. The fix is usually to:

1. Identify the missing module
2. Add it to the theme or plugin's `devDependencies`
3. Re-run `npm install` from the repository root.

#### Script Specifications

> TODO: formalize this policy

All packages in this repository must implement the following npm scripts:

- build
- test
- lint:js

### pnpm (Experimental)

This repository currently uses **npm workspaces** as the supported and documented package manager.  
`pnpm` may be evaluated as an **experimental option** due to its strong monorepo support, but it is **not yet part of the official workflow**.

---

#### Requirements

- npm remains the official package manager
- No CI changes
- No script changes
- No dependency rewrites beyond what is required to make a build succeed

---

#### pnpm workspace configuration

At the repository root, define workspaces of any package.json files, e.g.:

```yaml
# pnpm-workspace.yaml
packages:
  - "themes/*"
  - "plugins/*"
  - "plugins/Blocks/*"
```

#### Running pnpm Locally

Install dependencies using pnpm:

```bash
brew install pnpm
pnpm install
```

#### Running Scripts

Run scripts across all workspaces:

```bash
pnpm -r run build
```

Or Run scripts for a single theme/plugin:

```bash
pnpm --filter example-theme run build
```
