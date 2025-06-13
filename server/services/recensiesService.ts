import sql from "./db";

export interface Recensies {
    id: number;
    created_at: Date;
    title: string;
    text: string;
    author: string;
    image: string;
    rating: number;
}

export async function getAllRecensies(): Promise<Recensies[]> {
    const data: Recensies[] = await sql`SELECT * FROM recensies`;
    return data;
}

export async function addRecensie(recensie: Recensies): Promise<Recensies> {
    const [newRecensie] = await sql<Recensies[]>`
        INSERT INTO recensies (title, text, author, image, rating)
        VALUES (${recensie.title}, ${recensie.text}, ${recensie.author}, ${recensie.image}, ${recensie.rating})
        RETURNING *
    `;
    return newRecensie;
}

// add a fuction that edits the recensies
export async function editRecensie(recensie: Recensies): Promise<Recensies> {
    const [updatedRecensie] = await sql<Recensies[]>`
        UPDATE recensies
        SET title = ${recensie.title}, text = ${recensie.text}, author = ${recensie.author}, image = ${recensie.image}, rating = ${recensie.rating}
        WHERE id = ${recensie.id}
        RETURNING *
    `;
    return updatedRecensie;
}

// add a fuction that deletes the recensies
export async function deleteRecensie(id: number): Promise<void> {
    await sql`
        DELETE FROM recensies
        WHERE id = ${id}
    `;
}