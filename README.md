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
>```
>clones/
>└─ example-theme/
>wordpress-monorepo/
>```

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

##### Naming requirements
* ⚠️ Raw branch names like release/1.1.0 are not allowed in the monorepo, in order to avoid conflics.
* All legacy branches must be namespaced by theme or plugin:
  * `themes/example-theme/release-x.x.x`
  * `plugins/example-plugin/release-x.x.x`

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

### Script Specifications
All packages in this repository must implement the following npm scripts:
- build
- test
- lint:js