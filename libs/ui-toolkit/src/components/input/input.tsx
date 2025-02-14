import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import classNames from 'classnames';
import type { IconName } from '../icon';
import { Icon } from '../icon';
import {
  includesLeftPadding,
  includesRightPadding,
} from '../../utils/class-names';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  prependIconName?: IconName;
  appendIconName?: IconName;
}
export const inputClassNames = ({
  hasError,
  className,
}: {
  hasError?: boolean;
  className?: string;
}) => {
  return classNames(
    [
      'appearance-none',
      'flex items-center w-full',
      'box-border',
      'border rounded-none',
      'bg-clip-padding',
      'border-black-60 dark:border-white-60',
      'bg-black-25 dark:bg-white-25',
      'text-black placeholder:text-black-60 dark:text-white dark:placeholder:text-white-60',
      'text-ui',
      'focus-visible:shadow-focus dark:focus-visible:shadow-focus-dark',
      'focus-visible:outline-0',
      'disabled:bg-black-10 disabled:dark:bg-white-10',
    ],
    {
      'pl-8': !includesLeftPadding(className),
      'pr-8': !includesRightPadding(className),
      'border-vega-pink dark:border-vega-pink': hasError,
    },
    className
  );
};

export const inputStyle = ({
  style,
  disabled,
}: {
  style?: React.CSSProperties;
  disabled?: boolean;
}) =>
  disabled
    ? {
        ...style,
        backgroundImage:
          'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAACNJREFUGFdjtLS0/M8ABcePH2eEsRlJl4BpBdHIuuFmEi0BABqjEQVjx/LTAAAAAElFTkSuQmCC)',
      }
    : style;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ prependIconName, appendIconName, className, hasError, ...props }, ref) => {
    className = `h-28 ${className}`;
    if (prependIconName) {
      className += ' pl-28';
    }
    if (appendIconName) {
      className += ' pr-28';
    }

    const input = (
      <input
        {...props}
        ref={ref}
        className={classNames(inputClassNames({ className, hasError }))}
      />
    );
    const iconName = prependIconName || appendIconName;
    if (iconName !== undefined) {
      const iconClassName = classNames(
        ['fill-black-60 dark:fill-white-60', 'absolute', 'z-10'],
        {
          'left-8': prependIconName,
          'right-8': appendIconName,
        }
      );
      const icon = <Icon name={iconName} className={iconClassName} size={16} />;
      return (
        <div className="inline-flex items-center relative">
          {prependIconName && icon}
          {input}
          {appendIconName && icon}
        </div>
      );
    }
    return input;
  }
);
