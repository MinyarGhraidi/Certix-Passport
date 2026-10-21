function Subtitle({ children, className = "" }) {
    return (
      <p className={`subtitle ${className}`.trim()}>
        {children}
      </p>
    );
  }
  
  export default Subtitle;