import sql from "./db";

export interface Orders {
    id: number;
    created_at: Date;
    order_nr: number;
    products: string; // JSON string of product IDs
    quantity: number;
    price: number;
    status: string; // e.g., 'pending', 'completed', 'cancelled'
}

export async function getAllOrders(): Promise<Orders[]> {
    const data: Orders[] = await sql`SELECT * FROM orders`;
    return data;
}

export async function addOrder(order: Orders): Promise<Orders> {
    const [newOrder] = await sql<Orders[]>`
    INSERT INTO orders (order_nr, products, quantity, total_price, status)
    VALUES (${order.order_nr}, ${order.products}, ${order.quantity}, ${order.price}, ${order.status})
    RETURNING *
  `;
  return newOrder;
}

export async function editOrder(id: number, updatedOrder: Partial<Orders>): Promise<Orders> {
  const [updated] = await sql<Orders[]>`
    UPDATE orders
    SET 
      order_nr = ${updatedOrder.order_nr || null}, 
      price = ${updatedOrder.price || null}, 
      products = ${updatedOrder.products || null}, 
      status = ${updatedOrder.status || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return updated;
}

export async function deleteOrder(id: number): Promise<void> {
    await sql`
        DELETE FROM orders
        WHERE id = ${id}
    `;
}

