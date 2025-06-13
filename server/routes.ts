import express, { Request, Response } from "express";
import { Items, getAllItems, addItems, editItem } from "./services/itemsService"; // Added editItem import
import { Recensies, getAllRecensies, addRecensie, editRecensie, deleteRecensie } from "./services/recensiesService";
import { Orders, getAllOrders, addOrder, editOrder, deleteOrder } from "./services/ordersService";
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
    const orders = await getAllOrders();
    res.render("account", {
      items,
      orders,
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

// ADD THIS NEW ROUTE FOR EDITING ITEMS
router.put("/item/:id", async (req: Request, res: Response): Promise<void> => {
  const itemId = req.params.id; // Ensure this matches the expected format
  const { item, description, price, category, image } = req.body;

  // Validate required fields
  if (!item || !description || !price || !category || !image) {
    res.status(400).send("Missing required fields");
    return;
  }

  try {
    const updatedItem = await editItem(parseInt(itemId, 10), {
      item,
      description,
      price: parseFloat(price),
      category,
      image,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("Failed to update item");
  }
});

// ADD THIS NEW ROUTE FOR ADDING ITEMS VIA API
router.post("/item", async (req: Request, res: Response) => {
  const { name, price, description, image } = req.body;
  const newItem: Items = { 
    id: 0, 
    item: name, 
    description, 
    price: parseFloat(price), 
    category: req.body.category || '', // Add default or get from request
    image 
  };
  
  try {
    const addedItem = await addItems(newItem);
    res.status(201).json(addedItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
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

router.put("/orders/:id", async (req: Request, res: Response): Promise<void> => {
  const orderId = parseInt(req.params.id, 10);
  const { order_nr, price, products, status } = req.body;

  // Validate required fields
  if (!order_nr || !price || !products || !status) {
    res.status(400).send("Missing required fields");
    return;
  }

  try {
    const updatedOrder = await editOrder(orderId, {
      order_nr: parseInt(order_nr, 10),
      price: parseFloat(price),
      products,
      status,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error editing order:", error);
    res.status(500).send("Failed to update order");
  }
});

router.delete("/orders/:id", async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id, 10);
  try {
    await deleteOrder(orderId);
    res.status(200).send("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Failed to delete order");
  }
});

// 404 Page
router.use((req: Request, res: Response): void => {
  res.status(404).render("404");
});

export default router;