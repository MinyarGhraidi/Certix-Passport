function Card({
    children,
    className = "",
    title,
  }) {
    return (
      <section className={`card ${className}`.trim()}>
        {title && <h2 className="card-title">{title}</h2>}
  
        {children}
      </section>
    );
  }
  
  export default Card;