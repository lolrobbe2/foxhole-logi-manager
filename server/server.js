import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config({ path: "./.env" });
import FoxholeApi from './foxholeapi.js';
import Stockpile from "./stockpile.js";
import StockpileManager from "./stockpilemanager.js";
const app = express();
const port = 3001;
const stockpileManager = new StockpileManager();
// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post('/stockpiles', async (req, res) => {
  try {
    const { region, subregion, name, code } = req.body;
    if (!region || !subregion || !name || !code) {
      return res.status(400).json({ error: 'region, subregion, name, and code are required' });
    }
    await stockpileManager.createStockPile(region,subregion,name);
  } catch (error) {
    console.error('Error creating stockpile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const stockpile = await stockpileManager.getStockpile('deadlands', 'default', 'stockpile');
await stockpile.addItem("test",5);
await stockpile.save();
