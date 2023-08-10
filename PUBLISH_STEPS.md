#  Workflow to publish to npm

- Run `npm version [patch/minor/major]`. This will create a commit and bump the version in `package.json`.
- Run `yarn package` to bulid the project as a package.
- Run `cd package` and then `npm publish` to publish it to the registry.
