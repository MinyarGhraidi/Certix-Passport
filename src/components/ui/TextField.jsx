function TextField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    type = "text",
    required = false,
    disabled = false,
    error,
    className = "",
  }) {
    const id = name || "text-field";
  
    return (
      <div className={`text-field ${className}`.trim()}>
        {label && (
          <label htmlFor={id}>
            {label}
            {required && " *"}
          </label>
        )}
  
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
  
        {error && (
          <p id={`${id}-error`} className="text-field-error">
            {error}
          </p>
        )}
      </div>
    );
  }
  
  export default TextField;