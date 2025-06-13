import express, { Request, Response } from "express";
import { Items, getAllItems, addItems } from "./services/itemsService";
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

router.post("/account", async (req: Request, res: Response) => {
  const { item, description, price, category, image } = req.body;
  // Assign a temporary id (e.g., 0); the real id should be set in addItems or the database
  const newItem: Items = { id: 0, item, description, price, category, image };
  try {
    await addItems(newItem);
    res.redirect("/");
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/add", (req: Request, res: Response): void => {
  res.render("add", { title: "Voeg Product Toe" });
});

router.post("/add", async (req: Request, res: Response) => {
  const { item, description, price, category, image } = req.body;
  // Assign a temporary id (e.g., 0); the real id should be set in addItems or the database
  const newItem: Items = { id: 0, item, description, price, category, image };
  try {
    await addItems(newItem);
    res.redirect("/");
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Internal Server Error');
  }
});





// 404 Page
router.use((req: Request, res: Response): void => {
  res.status(404).render("404");
});

export default router;