import express from "express";
import { env } from "./config/env.js";
import { db } from "./config/db.js";
import { favorites } from "./db/schema.js";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";
import job from "./config/cron.js";


const app = express();
const PORT = env.PORT || 3000;

if (env.NODE_ENV === "production") {
  job.start();  
  console.log("Cron job started");
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the backend server!" });
});

app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the backend server!" });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipId || !title || !image || !cookTime || !servings) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newFavorite = await db
      .insert(favorites)
      .values({
        userId,
        recipId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();
      res.status(201).json(newFavorite[0]);

  } catch (error) {
    console.error("Error creating favorite:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {

  try {
    const {userId,recipeId}=req.params

    await db.delete(favorites).where(
      and(eq(favorites.userId, userId),
          eq(favorites.recipId, recipeId))
    )
    
    res.status(200).json({ success: true, message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    
  }
})

app.get("/api/favorites/:userId", async (req, res) => {
  try { 
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);  
    res.status(500).json({ success: false, message: "Internal server error" });
  }});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
