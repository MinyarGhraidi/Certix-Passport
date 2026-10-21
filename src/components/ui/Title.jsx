function Title({
    children,
    className = "",
    level = 1,
  }) {
    const Heading = `h${Math.min(6, Math.max(1, level))}`;
  
    return (
      <Heading className={`title ${className}`.trim()}>
        {children}
      </Heading>
    );
  }
  
  export default Title;