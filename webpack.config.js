let config = {
  context: __dirname,
  target: "webworker",
  entry: {
    worker: "./src/index.js"
  },

  devtool: "inline-nosources-source-map",
}

module.exports = (env, argv) => {
  if (argv && argv.mode === "development") {
    config.devtool = "inline-nosources-source-map"
  } else {
    config.devtool = false
  }

  return config
}
