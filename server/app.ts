import express, { Application } from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import routes from "./routes";

const app: Application = express();
const PORT: number = parseInt(<string>process.env.PORT, 10) || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

// Server starten
app.listen(PORT, (): void => {
  console.log(`Server draait op http://localhost:${PORT}`);
});