# Workflows

## Pull request checks (pr.yml)

Runs on every new commit in a PR. Features:

- Automatic PR labeling
  - Using `actions/labeler`, automatically sets PR labels based on files changed.
  - See `.github/labeler.yml` for label configuration.
    - Note: when a new sub-project (plugin or theme) is added to the monorepo, it should be added to the `labeler.yml` configuration.
- Sub-project change detection [matrix](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations)
  - Files changed in the PR are analyzed using `nx` to determine which sub-projects were affected. The list of affected projects is then passed to the next job which uses a matrix to run the build and testing only for that list of changed projects. The build and testing jobs run concurrently.