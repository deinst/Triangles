/**
 * Created by davideinstein on 5/20/17.
 */

module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    devtool: "source-map"
};
