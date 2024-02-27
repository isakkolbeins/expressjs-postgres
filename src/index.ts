import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import internal from "stream";

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
  res.send(`Hello, World! The time from the DB is simple return`);
});

/* Used to fix the time_to type
app.get("/datatype", async (req, res) => {
  const { rows } = await pool.query("ALTER TABLE landlords ALTER COLUMN time_to TYPE date USING time_to::date");
  res.json(rows);	
});
*/ 

app.get("/allLandlords", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM landlords");
  res.json(rows);
});

// Landlord by landlord_id
app.get("/landlords/:landlord_id", async (req, res) => {
  try {
    const landlord_id = req.params.landlord_id;

    const query = "SELECT * FROM landlords WHERE landlord_id = $1";
    const { rows } = await pool.query(query, [landlord_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }

    const landlord = rows[0];
    res.json({ success: true, landlord });
  } catch (error) {
    console.error("Error fetching landlord:", error);
    res.status(500).json({ success: false, message: "Failed to fetch landlord" });
  }
});

// Post requests

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});


const addUser = async (full_name: any, email: any, password_hash: any) => {
  try {
    const query = "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id";
    const values = [full_name, email, password_hash];

    const result = await pool.query(query, values);
    return result.rows[0].user_id;

  } catch (error) {
    console.error("Error adding user:", error);
  }
}

// Add a new Landlord
app.post("/addLandlord", async (req, res) => {
  try {
    /*const name = "isak";
    const email = "mail@isak.is"
    const pw = "pw!"
    const address = "address"
    const time_from = new Date("2024-02-01"); // date
    const time_to = new Date("2024-12-01");   // date
    const price = 5000;                      // int


    json testing body: 
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "address": "123 Main St",
      "time_from": "2024-02-01",
      "time_to": "2024-12-01",
      "rent_price": 5000,
      "amenities": "Swimming pool, Gym",
      "description": "Spacious apartment with beautiful view",
      "size": 1000
    }
    */
    
    // Extract info from the request body
    const { name, email, password, address, time_from, time_to, rent_price, amenities, description, size } = req.body;
    
    const user_id = await addUser(name, email, password);

    const query = 
      `INSERT INTO landlords 
      (user_id, address, time_from, time_to, rent_price, amenities, description, size) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING landlord_id`;
    const values = [user_id, address, new Date(time_from), new Date(time_to), rent_price, amenities, description, size];

    const result = await pool.query(query, values);
    const landlord_id = result.rows[0].landlord_id;

    res.json({ success: true, message: "Landlord added successfully", landlord_id: landlord_id});
  } catch (error) {
    console.error("Error adding landlord:", error);
    res.status(500).json({ success: false, message: "Failed to add landlord" });
  }

});


// Edit the landlord - update values 
app.put("/editLandlord/:landlord_id", async (req, res) => {
  try {
    const landlord_id = req.params.landlord_id;

    // Extract info from the request body
    const { address, time_from, time_to, rent_price, amenities, description, size } = req.body;

    // Execute SQL UPDATE statement
    const query = `
      UPDATE landlords 
      SET address = $1, time_from = $2, time_to = $3, rent_price = $4, amenities = $5, description = $6, size = $7
      WHERE landlord_id = $8
      RETURNING *`;
    const values = [address, new Date(time_from), new Date(time_to), rent_price, amenities, description, size, landlord_id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }

    const updatedLandlord = rows[0];
    res.json({ success: true, message: "Landlord updated successfully", landlord: updatedLandlord });
  } catch (error) {
    console.error("Error updating landlord:", error);
    res.status(500).json({ success: false, message: "Failed to update landlord" });
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
