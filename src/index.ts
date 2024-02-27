import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
// const pool = new pg.Pool();
// The secret connection string you copied earlier
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString,
});

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



// Get requests 

app.get("/", async (req, res) => {
  // const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is simple return`);
});

app.get("/allListings", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM Listings");
  res.json(rows);
});

// Post requests

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});

app.post("/addListing", async (req, res) => {
  try {
    let price = "5000"          // int
    let timeFrom = new Date("2024-02-01")// date
    let timeTo = new Date("2024-12-01")// date
    
    const query = "INSERT INTO listings (price, timeFrom, timeTo) VALUES ($1, $2, $3)";
    const values = [price, timeFrom, timeTo];

    const result = await pool.query(query, values);
    res.json({ success: true, message: "Listing added successfully" });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ success: false, message: "Failed to add listing" });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
