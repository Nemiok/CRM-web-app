const clientWebpackConfig = require('./webpackConfigs/webpack.client.config.js')
const serverWebpackConfig = require('./webpackConfigs/webpack.server.config.js')


module.exports = [clientWebpackConfig, serverWebpackConfig]