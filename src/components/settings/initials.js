// "Amira Mansour" -> "AM"
export const initialsOf = (profile) =>
  `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase() || "?";
