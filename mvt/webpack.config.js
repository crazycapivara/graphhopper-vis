const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/app.js",
    output: {
        library: "app",
        filename: "app.js",
        path: path.resolve(__dirname, "dist")
    }
};
