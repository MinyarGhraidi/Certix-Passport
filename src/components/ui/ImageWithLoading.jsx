import { useState } from "react";

function ImageWithLoading({
  src,
  alt = "",
  className = "",
  fallbackText = "Image unavailable",
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`image-placeholder ${className}`.trim()}
        role="img"
        aria-label={alt || fallbackText}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <div className="image-container">
      {loading && (
        <div className="image-loader" role="status">
          <span className="image-spinner" />
          <span className="sr-only">Loading image...</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`image-with-loading ${className}`.trim()}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{ display: loading ? "none" : "block" }}
        {...props}
      />
    </div>
  );
}

export default ImageWithLoading;