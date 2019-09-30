import React from 'react';
import { configure, addDecorator, setAddon } from '@storybook/react';
const StyleContext = require('isomorphic-style-loader/StyleContext');
const { jsxDecorator } = require('storybook-addon-jsx');

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const CenterDecorator = storyFn => <StyleContext.Provider value={{ insertCss }}>{storyFn()}</StyleContext.Provider>;

addDecorator(jsxDecorator);
addDecorator(Story => <Story />);
addDecorator(CenterDecorator);
configure(require.context('../app', true, /\.stories\.tsx$/), module);
