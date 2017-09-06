const path = require("path");

const distro = process.env.DISTRO || "main";
console.log(`Distro === ${distro}`);

module.exports = {
    context: __dirname,
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@B": path.join(__dirname, "src", "a", "b")
        },
        mainFields: [["distro", distro], "main"]
    }
};
