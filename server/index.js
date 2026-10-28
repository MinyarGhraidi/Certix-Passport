import express from "express";
import multer from "multer";
import routes from "./routes.js";
import { UPLOAD_DIR } from "./store.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
  })
);
app.use("/api", routes);

// Gestion centralisée des erreurs : le front reçoit toujours { error: "code" }
app.use((err, req, res, next) => {
  void next;
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "file_too_large" });
    return res.status(400).json({ error: "bad_request" });
  }
  if (err.code === "INVALID_TYPE") return res.status(415).json({ error: "invalid_type" });
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ error: "bad_request" });
  }
  console.error(err);
  res.status(500).json({ error: "server" });
});

app.listen(PORT, () => console.log(`API CertiX : http://localhost:${PORT}`));
