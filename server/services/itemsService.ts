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

