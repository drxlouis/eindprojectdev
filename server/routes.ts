import express, { Request, Response } from "express";
import { Items, getAllItems } from "./services/itemsService";
import dotenv from "dotenv";
dotenv.config();

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

console.log(`LOGIN_NAME (routes.ts): ${process.env.LOGIN_NAAM}`);
console.log(`LOGIN_WACHTWOORD (routes.ts): ${process.env.LOGIN_WACHTWOORD}`);

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
    res.render("account", {
      items,
      LOGIN_NAAM: process.env.LOGIN_NAAM,
      LOGIN_WACHTWOORD: process.env.LOGIN_WACHTWOORD,
    });
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