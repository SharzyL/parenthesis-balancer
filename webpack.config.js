import path from 'path'

let config = {
  target: "webworker",
  entry: {
    worker: "./src/index.js"
  },
  output: {
    path: path.resolve('./worker'),
    filename: 'script.js'
  },

  devtool: "inline-nosources-source-map",
  experiments: {
    asyncWebAssembly: true,
  }
}

export default (env, argv) => {
  if (argv && argv.mode === "development") {
    config.devtool = "inline-nosources-source-map"
    config.mode = "development"
  } else {
    config.devtool = false
    config.mode = "production"
  }

  return config
}
