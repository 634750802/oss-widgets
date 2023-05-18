const withSvgr = require('next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, context) => {

    config.module.rules.push({
      test: /\/widgets-manifest\.ts$/,
      use: [
        context.defaultLoaders.babel,
        {
          loader: require.resolve('./packages/buildtool/dist/webpack/loaders/widgets-manifest')
        },
      ]
    }, {
      test: /\.sql$/,
      use: [
        context.defaultLoaders.babel,
        {
          loader: require.resolve('./packages/buildtool/dist/webpack/loaders/sql')
        },
      ]
    })
    config.plugins.push(new (require('./packages/buildtool/dist/webpack/plugins/db/SQLPlugin')))

    config.resolve.alias['roughjs'] = 'roughjs/bundled/rough.esm.js'

    return config;
  },
  svgrOptions: {
    ref: true,
    svgo: false,
    replaceAttrValues: {
      fill: 'currentColor',
    },
  },
  onDemandEntries: {},
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ["mysql2"]
  }
}

module.exports = withSvgr(nextConfig)
