# Webpack `resolve.mainFields` Sub-Array Minimum Working Example

## Description
It seems `webpack >= 2` no longer supports subarrays within its `resolve.mainFields` configuration setting.  This was previously used to allow resolving the main file from a node module via a sub-object in the module's `package.json`, e.g.:

```javascript
// ----------- webpack.config.js
const editor = process.env["EDITOR"];

module.exports = {
  resolve: {
    mainFields: [ ["editor": editor], "main" ]
  }
};

// ---------- src/index.js
const a = require("./custom-module");

// ---------- src/custom-module/package.json
{
  "name": "custom-module",
  "version": "1.0.0",
  "description": "a submodule",
  "main": "donotuse.js",
  "editor": {
    "vim": "vim.js",
    "nvim": "neovim.js",
    "emacs": "emacs.js"
  },
  "author": "Sean Barag <sjbarag@gmail.com>",
  "license": "MIT"
}
```

While contrived, this should allow Webpack to use `vim.js`, `neovim.js`, or `emacs.js` as the main file for `custom-module` based on the `$EDITOR` environment variable at compile-time.  Unfortunately, what happens in `webpack >= 2` is that the `editor` property is skipped, and `main` is still used.  This looks like a regression from `webpack@1`, even though the Webpack JSON Schema [supports an array of strings or string arrays](https://github.com/webpack/webpack/blob/92d5c209437f9ef9293571e24cc8dcf10459d578/schemas/webpackOptionsSchema.json#L502-L504)

## Repro Steps
This repo consists of a small, reduced working example of the problem.

1. Clone this repo: `git clone https://github.com/sjbarag/webpack-mwe.git`
2. Install dependencies (just Webpack) with `npm@5`: `npm install`
3. Build and run the example: `npm test`
4. Observe the following in the output:
    1. `distro === fedora` is printed, indicating that the `$DISTRO` environment variable was properly set and read
    2. Webpack chose `./src/a/b/donotuse.js` for the CommonJS `./a/b/` module required by `./src/index.js`
    3. Running `node ./dist/bundle.js` displays "You should not see this message.  Webpack didn't respect your `mainFields` property." instead of the expected "You appear to be on a RHEL-ish box." message.

## Repro Rate
This doesn't apppear to be a race condition - it happens 100% of the time under these circumstances.

## Repro Environment
* Operating System: Mac OS 10.12.6 "Sierra"
* Shell: Bash 4.4.12
* Node: 6.11.2
* npm: 5.3.0
* Webpack: 3.5.6

## Affected Versions
I've tested this with `webpack@2` and every minor version of `webpack@3`, all of which demonstrate the same behavior.
