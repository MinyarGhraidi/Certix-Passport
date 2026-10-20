function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Choose an option",
    required = false,
    disabled = false,
    error,
    className = "",
  }) {
    const id = name || "select-field";
  
    return (
      <div className={`select-field ${className}`.trim()}>
        {label && (
          <label htmlFor={id}>
            {label}
            {required && " *"}
          </label>
        )}
  
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <option value="">{placeholder}</option>
  
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
  
        {error && (
          <p id={`${id}-error`} className="select-field-error">
            {error}
          </p>
        )}
      </div>
    );
  }
  
  export default Select;