import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Autosize from 'autosize';

class Input extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      length: (props.value || props.defaultValue || '').length,
    };
  }

  componentDidMount() {
    this.initAutosize();
  }

  componentDidUpdate(prevProps) {
    this.updateAutosize(prevProps);
  }

  componentWillUnmount() {
    this.destroyAutosize();
  }

  onInputChange = (e) => {
    const { onChange } = this.props;
    this.setState({
      length: e.target.value.length,
    });
    typeof onChange === 'function' && onChange(e);
  }

  // 初始化自适应高度
  initAutosize = () => {
    const { type, autosize } = this.props;
    (type === 'textarea') && autosize && Autosize(this.input);
  }

  updateAutosize = (prevProps) => {
    if (prevProps.type !== 'textarea') return;
    if (prevProps.style !== this.props.style || prevProps.className !== this.props.className) {
      Autosize.update(this.input);
    }
  }

  // 销毁自适应高度
  destroyAutosize = () => {
    const { type, autosize } = this.props;
    (type === 'textarea') && autosize && Autosize.destroy(this.input);
  }

  render() {
    const {
      prefixCls,
      className,
      placeholder,
      type,
      maxLength,
      disabled,
      autosize,
      showLength,
      ...others
    } = this.props;

    const cls = classnames({
      [`${prefixCls}`]: true,
      [className]: !!className,
      disabled,
    });

    const inputRender = (type === 'textarea')
      ? (
        <textarea
          {...others}
          ref={(ele) => { this.input = ele; }}
          className={cls}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onChange={this.onInputChange}
          />
      )
      : (
        <input
          {...others}
          ref={(ele) => { this.input = ele; }}
          type={type}
          className={cls}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onChange={this.onInputChange}
          />
      );

    const valueRender = (type === 'date') && <div className={`${prefixCls}-placeholder`}>{placeholder}</div>;
    const textLengthRender = (showLength && maxLength) && <div className={`${prefixCls}-length`}>{`${this.state.length}/${maxLength}`}</div>;

    return (
      <div className={cls}>
        {valueRender}
        {inputRender}
        {textLengthRender}
      </div>
    );
  }
}

Input.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  autosize: PropTypes.bool,
  maxLength: PropTypes.number,
  showLength: PropTypes.bool,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  prefixCls: 'za-input',
  type: 'text',
  disabled: false,
  autosize: false,
  showLength: false,
};

export default Input;
