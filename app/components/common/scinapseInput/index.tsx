import * as React from 'react';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./scinapseInput.scss');

interface InputBoxProps {
  placeholder: string;
  autoFocus?: boolean;
  icon?: string;
  wrapperStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  value?: string;
  onSubmit?: (inputValue: string) => void;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InputBoxStates {
  inputValue: string;
}

class ScinapseCommonInput extends React.PureComponent<InputBoxProps, InputBoxStates> {
  public constructor(props: InputBoxProps) {
    super(props);

    this.state = {
      inputValue: props.value || '',
    };
  }

  public render() {
    const { wrapperStyle, inputStyle, placeholder, onChange, onKeydown, value, autoFocus = false } = this.props;
    const { inputValue } = this.state;

    return (
      <div style={wrapperStyle} className={styles.inputBox}>
        <input
          style={inputStyle}
          onKeyDown={onKeydown || this.handleKeyDown}
          onChange={onChange || this.handleChange}
          autoFocus={autoFocus}
          defaultValue={value === undefined ? inputValue : value}
          placeholder={placeholder}
        />
        {this.getIcon()}
      </div>
    );
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && this.props.onSubmit) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    const newStringValue = e.currentTarget.value;
    this.setState({
      inputValue: newStringValue,
    });

    onChange && onChange(e);
  };

  private handleSubmit = () => {
    const { onSubmit } = this.props;
    const { inputValue } = this.state;

    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  private getIcon() {
    const { icon } = this.props;

    if (icon) {
      return (
        <div onClick={this.handleSubmit} className={styles.icon}>
          <Icon icon={icon} />
        </div>
      );
    }
    return null;
  }
}

export default withStyles<typeof ScinapseCommonInput>(styles)(ScinapseCommonInput);
