import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
const StyleContext = require('isomorphic-style-loader/StyleContext');

import Button from './index';
import Icon from '../../../icons';

export default {
  title: 'Button',
};

const insertCss = (...styles: any[]) => {
  console.log(styles);
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const CenterDecorator = (storyFn: any) => (
  <StyleContext.Provider value={{ insertCss }}>{storyFn()}</StyleContext.Provider>
);

addDecorator(CenterDecorator);

storiesOf('Button', module)
  .add('default button', () => <Button elementType="button">Button Text</Button>)
  .add('with left icon', () => (
    <Button elementType="button">
      <Icon icon="BOOKMARK" />
      <span>Button Text</span>
    </Button>
  ));
