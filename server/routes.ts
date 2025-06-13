import express, { Request, Response } from "express";
import { Items, getAllItems, addItems } from "./services/itemsService";
import { Recensies, getAllRecensies, addRecensie } from "./services/recensiesService";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// Home Page
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllItems();
    const recensies = await getAllRecensies();
    res.render("landing", { items, recensies });
  } catch (error) {
    console.error("Error fetching items on landing-page:", error);
    res.status(500).render("500");
  }
});

router.get("/reviews", async (req: Request, res: Response): Promise<void> => {
  try {
    const recensies = await getAllRecensies();
    res.render("reviews", { recensies });
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
    res.render("catalog", { items });
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

router.post("/reviews", async (req: Request, res: Response) => {
  const { title, text, author, image, rating } = req.body;
  const newReview: Recensies = { 
    id: 0, 
    created_at: new Date(), 
    title, 
    text, 
    author, 
    image, 
    rating 
  };
  try {
    await addRecensie(newReview);
    res.redirect("/reviews");
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 404 Page
router.use((req: Request, res: Response): void => {
  res.status(404).render("404");
});

export default router;