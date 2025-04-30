import express, { Request, Response } from "express";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", (req: Request, res: Response): void => {
  res.render("index", { title: "Home" });
});


router.use((req: Request, res: Response): void => {
  res.status(404).render("404", { title: "Page Not Found" });
});

export default router;