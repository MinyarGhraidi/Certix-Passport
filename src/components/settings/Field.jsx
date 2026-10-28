import { useId } from "react";
import { ChevronDown } from "lucide-react";

function Wrapper({ id, label, labelIcon, error, children, className }) {
  return (
    <div className={`st-field ${className ?? ""}`}>
      <label htmlFor={id} className="st-label">
        {labelIcon}
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="st-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const aria = (id, error) => ({
  "aria-invalid": Boolean(error),
  "aria-describedby": error ? `${id}-error` : undefined,
});

// `after` : élément affiché à droite du champ (ex. bouton Remove)
export function TextField({ label, labelIcon, value, onChange, error, after, className, ...rest }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} labelIcon={labelIcon} error={error} className={className}>
      <div className="st-input-row">
        <input id={id} className="st-input" value={value} onChange={onChange} {...aria(id, error)} {...rest} />
        {after}
      </div>
    </Wrapper>
  );
}

export function SelectField({ label, value, onChange, error, options, placeholder, className }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} className={className}>
      <div className="st-select">
        <select id={id} className="st-input" value={value} onChange={onChange} {...aria(id, error)}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </div>
    </Wrapper>
  );
}

export function TextAreaField({ label, value, onChange, error, maxLength, className }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} className={className}>
      <textarea
        id={id}
        className="st-input st-textarea"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={4}
        {...aria(id, error)}
      />
      {maxLength && (
        <p className="st-counter" aria-live="polite">
          {value.length}/{maxLength}
        </p>
      )}
    </Wrapper>
  );
}
