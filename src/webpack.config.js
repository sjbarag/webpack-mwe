const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        alias: {
            "@B": path.join(__dirname, "src", "a", "b")
        }
    }
};
