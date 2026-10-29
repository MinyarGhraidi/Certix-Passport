// Textes d'erreur affichés dans la page Settings (clés = codes du serveur/validation).

const FIELD = {
  required: "This field is required.",
  tooLong: "This value is too long.",
  usernameFormat: "Use 3–30 letters, numbers, dots, dashes or underscores.",
  urlInvalid: "Enter a valid URL, for example https://example.com.",
  linkedinHost: "This must be a linkedin.com link.",
  githubHost: "This must be a github.com link.",
  levelInvalid: "Choose a level from the list.",
  bioTooLong: "The bio must be 300 characters or fewer.",
  typeInvalid: "Choose a link type from the list.",
  tooManyLinks: "You can add up to 10 links.",
};

const UPLOAD = {
  invalid_type: "Unsupported format. Use a PNG or JPG image.",
  file_too_large: "This file is larger than 10 MB.",
  invalid_image: "This image is empty or corrupted.",
  network: "Upload failed. Check your connection and try again.",
  server: "Upload failed. The image could not be saved. Try again.",
  storage: "Could not save the image. Your browser storage is full.",
  bad_request: "Upload failed. Try again with another image.",
  no_file: "No file was received. Try again.",
};

export const fieldMessage = (code) => (code ? FIELD[code] ?? "Invalid value." : undefined);
export const uploadMessage = (code) => (code ? UPLOAD[code] ?? UPLOAD.server : "");
