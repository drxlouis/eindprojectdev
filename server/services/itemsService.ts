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

export async function editItem(id: number, updatedItem: Partial<Items>): Promise<Items> {
  const [updated] = await sql<Items[]>`
    UPDATE items
    SET 
      item = ${updatedItem.item || null}, 
      description = ${updatedItem.description || null}, 
      price = ${updatedItem.price || null}, 
      category = ${updatedItem.category || null}, 
      image = ${updatedItem.image || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return updated;
}
