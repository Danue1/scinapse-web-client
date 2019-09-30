import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import Button from './index';
import Icon, { ICONS } from '../../../icons';

export default {
  title: 'Button',
};

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs);

stories
  .add('text only', () => (
    <Button
      elementType="button"
      size={select('Button size', ['small', 'medium', 'large'], 'medium', 'button-text-only')}
    >
      {text('Button text', 'Button Text', 'button-text-only')}
    </Button>
  ))
  .add('with left icon', () => (
    <Button
      elementType="button"
      size={select('Button size', ['small', 'medium', 'large'], 'medium', 'button-left-icon')}
    >
      <Icon icon={select('Icon', Object.keys(ICONS), 'BOOKMARK', 'button-left-icon')} />
      <span>{text('Button text', 'Button Text', 'button-left-icon')}</span>
    </Button>
  ));
