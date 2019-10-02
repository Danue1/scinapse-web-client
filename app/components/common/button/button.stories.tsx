import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';

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
      variant={select('variant', ['text', 'outlined', 'contained'], 'contained', 'button-text-only')}
      color={select('text color', ['blue', 'gray', 'black'], 'blue', 'button-text-only')}
      disabled={boolean('disabled', false, 'button-text-only')}
      fullWidth={boolean('full width', false, 'button-text-only')}
    >
      {text('Button text', 'Button Text', 'button-text-only')}
    </Button>
  ))
  .add('with left icon', () => (
    <Button
      elementType="button"
      size={select('Button size', ['small', 'medium', 'large'], 'medium', 'button-left-icon')}
      variant={select('variant', ['text', 'outlined', 'contained'], 'contained', 'button-left-icon')}
      color={select('text color', ['blue', 'gray', 'black'], 'blue', 'button-left-icon')}
      disabled={boolean('disabled', false, 'button-left-icon')}
      fullWidth={boolean('full width', false, 'button-left-icon')}
    >
      <Icon icon={select('Icon', Object.keys(ICONS), 'BOOKMARK', 'button-left-icon')} />
      <span>{text('Button text', 'Button Text', 'button-left-icon')}</span>
    </Button>
  ))
  .add('with right icon', () => (
    <Button
      elementType="button"
      size={select('Button size', ['small', 'medium', 'large'], 'medium', 'button-right-icon')}
      variant={select('variant', ['text', 'outlined', 'contained'], 'contained', 'button-right-icon')}
      color={select('text color', ['blue', 'gray', 'black'], 'blue', 'button-right-icon')}
      disabled={boolean('disabled', false, 'button-right-icon')}
      fullWidth={boolean('full width', false, 'button-right-icon')}
    >
      <span>{text('Button text', 'Button Text', 'button-right-icon')}</span>
      <Icon icon={select('Icon', Object.keys(ICONS), 'BOOKMARK', 'button-right-icon')} />
    </Button>
  ))
  .add('icon only', () => (
    <Button
      elementType="button"
      size={select('Button size', ['small', 'medium', 'large'], 'medium', 'button-icon-only')}
      variant={select('variant', ['text', 'outlined', 'contained'], 'contained', 'button-icon-only')}
      color={select('text color', ['blue', 'gray', 'black'], 'blue', 'button-icon-only')}
      disabled={boolean('disabled', false, 'button-icon-only')}
      fullWidth={boolean('full width', false, 'button-icon-only')}
    >
      <Icon icon={select('Icon', Object.keys(ICONS), 'BOOKMARK', 'button-icon-only')} />
    </Button>
  ));
