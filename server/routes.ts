import express, { Request, Response } from "express";
import { Items, getAllItems } from "./services/itemsService";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// // Home Page
// router.get("/", (req: Request, res: Response): void => {

//   res.render("landing", { title: "Home", display: "Welcome to Home" });
// });

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    res.render("landing", { title: "Home", display: "Welcome!", items });
  } catch (error) {
    console.error("Error fetching items on landing-page:", error);
    res.status(500).render("500", { title: "Internal Server Error" });
  }
});

// Catalog Page (nakijken (brak))
router.get("/catalog", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    res.render("index", { title: "Catalog", display: "Catalog Page", items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).render("500", { title: "Internal Server Error" });
  }
});

router.get("/account", (req: Request, res: Response): void => {
  res.render("account", { title: "Account", display: "Account Page" });
});

// 404 Page
router.use((req: Request, res: Response): void => {
  res.status(404).render("404", { title: "Page Not Found" });
});

export default router;