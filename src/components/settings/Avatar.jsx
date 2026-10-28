import { useState } from "react";

// Affiche la photo, ou les initiales si pas de photo / image introuvable
function Avatar({ src, initials, className = "", alt = "" }) {
  const [failed, setFailed] = useState("");
  const showImage = src && failed !== src;

  return (
    <div className={`st-avatar ${className}`}>
      {showImage ? <img src={src} alt={alt} onError={() => setFailed(src)} /> : <span>{initials}</span>}
    </div>
  );
}

export default Avatar;
