# Workflows

## Pull request checks (pr.yml)

Runs on every new commit in a PR. Features:

- Automatic PR labeling
  - Using `actions/labeler`, automatically sets PR labels based on files changed.
  - See `.github/labeler.yml` for label configuration.
    - Note: when a new sub-project (plugin or theme) is added to the monorepo, it should be added to the `labeler.yml` configuration.
- Sub-project change detection matrix
  - Files changed in the PR are analyzed to determine which sub-projects had files changed. Once the list of changed sub-projects is found, it's passed to the next job which uses a matrix to run the linting and testing only for that list of changed projects. The linting and testing jobs run concurrently.
  - Note: when monorepo-wide files (ie. files not in `plugins/` or `themes/`) are changed, this **should** trigger all sub-projects to run their checks, but this is not yet implemented. This should also happen in cases where sub-projects are dependent on each other, for example when a parent theme is changed, checks should run for all of its child themes too.