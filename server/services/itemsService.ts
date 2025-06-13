import sql from "./db";

export interface Items {
    id: number;
    item: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

// Get all items
export async function getAllItems(): Promise<Items[]> {
    const data: Items[] = await sql`SELECT * FROM items`;
    return data;
}

export async function addItems(items: Items): Promise<Items> {
  const [newItem] = await sql<Items[]>`
    INSERT INTO items (item, description, price, category, image)
    VALUES (${items.item}, ${items.description}, ${items.price}, ${items.category}, ${items.image})
    RETURNING *
  `;
  return newItem;
}
