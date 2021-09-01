const path = require("path");
module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, "src/components/"),
      '@images': path.resolve(__dirname, "src/assets/images/"),
      '@redux': path.resolve(__dirname, "src/redux/"),
      '@reducers': path.resolve(__dirname, "src/redux/reducers/"),
      '@actions': path.resolve(__dirname, "src/redux/actions/"),
    }
  }
}