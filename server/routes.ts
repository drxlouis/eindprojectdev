import express, { Request, Response } from "express";
import { Items, getAllItems } from "./services/itemsService";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// Home Page
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    res.render("landing", { items });
  } catch (error) {
    console.error("Error fetching items on landing-page:", error);
    res.status(500).render("500");
  }
});

// Catalog Page
router.get("/catalog", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    res.render("index", { items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).render("500");
  }
});

router.get("/account", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    res.render("account", { items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).render("500");
  }
});

// 404 Page
router.use((req: Request, res: Response): void => {
  res.status(404).render("404");
});

export default router;