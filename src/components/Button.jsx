
function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    disabled = false,
    className = "",
    style,
  }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={style}
        className={`btn btn-${variant} ${className}`.trim()}
      >
        {children}
      </button>
    );
  }
  
  export default Button;
  