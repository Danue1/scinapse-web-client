// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const devConfig = require('../webpack.config.js');

module.exports = async ({ config }) => {
  config.plugins = [
    ...config.plugins,
    new LoadablePlugin(),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
  ];
  config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader?cacheDirectory=true',
      },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          happyPackMode: true,
        },
      },
    ],
  });

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      { loader: 'isomorphic-style-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]_[local]_[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => {
            return [require('postcss-flexbugs-fixes'), require('precss'), require('autoprefixer')];
          },
        },
      },
      { loader: 'sass-loader' },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: ['./app/_variables.scss'],
        },
      },
    ],
  });

  // remove svg from existing rule
  config.module.rules = config.module.rules.map(rule => {
    console.log(rule.test);
    if (String(rule.test) === String(/\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/)) {
      console.log('gsdkfjjakldfjkasdjklfjasdkljfkljsadklf');
      return {
        ...rule,
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
      };
    }

    return rule;
  });

  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          esModule: false,
        },
      },
      'svg-transform-loader',
      'svgo-loader',
    ],
  });

  return config;
};
