import express from "express";
import pg from "pg";

const stockImages = ["https://images.pexels.com/photos/129494/pexels-photo-129494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/681331/pexels-photo-681331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/265004/pexels-photo-265004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/2089696/pexels-photo-2089696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/2416933/pexels-photo-2416933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/15555023/pexels-photo-15555023/free-photo-of-interior-of-a-bedroom-with-a-large-bed-and-wooden-furniture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/3288103/pexels-photo-3288103.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/3288104/pexels-photo-3288104.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/7214728/pexels-photo-7214728.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
                "https://images.pexels.com/photos/3623770/pexels-photo-3623770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/415687/pexels-photo-415687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            ];


// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
// const pool = new pg.Pool();
// The secret connection string you copied earlier
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString,
});

// Enable CORS for all routes 
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



// Get requests 
app.get("/", async (req, res) => {
  res.send(`Hello, World! The time from the DB is simple return`);
});

//Used to fix the time_to type
/*
app.get("/datatype", async (req, res) => {
  const { rows } = await pool.query("ALTER TABLE images ALTER COLUMN image TYPE BYTEA USING image::BYTEA");
  res.json(rows);	
});
*/

app.get("/allLandlords", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM landlords");
  res.json(rows);
});

// Landlord by landlord_id
app.get("/landlord/:landlord_id", async (req, res) => {
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

// Landlord by landlord_id
app.get("/imagesByLandlord/:landlord_id", async (req, res) => {
  try {
    const landlord_id = req.params.landlord_id;

    const query = "SELECT * FROM images WHERE landlord_id = $1";
    const { rows } = await pool.query(query, [landlord_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Images not found" });
    }

    const images = rows;
    res.json({ success: true, images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ success: false, message: "Failed to fetch Images" });
  }
});


// Post requests

app.post('/login', async (req, res) => {
  // Insert Login Code Her
  const { email, password_hash } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = $1 AND password_hash = $2";
    const values = [email, password_hash];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Landlord added successfully", user: result.rows[0]});
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
  



  // res.send(`Username: ${username} Password: ${password}`);
});


const addUser = async (full_name: any, email: any, password_hash: any, usertype: any) => {
  try {
    const query = "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const values = [full_name, email, password_hash, usertype];

    const result = await pool.query(query, values);
    return result.rows[0].user_id;

  } catch (error) {
    console.error("Error adding user:", error);
  }
}

const editUser = async (user_id: any, full_name: any, email: any, password_hash: any) => {
  try {
    const query = "UPDATE users SET full_name = $1, email = $2, password_hash = $3 WHERE user_id = $4";
    const values = [full_name, email, password_hash, user_id];

    const result = await pool.query(query, values);
    return;
  } catch (error) {
    console.error("Error editing user:", error);
  }
}


const addPhoto = async (landlord_id: any, image_url: any) => {
  try {
    const query = "INSERT INTO images (landlord_id, image_url) VALUES ($1, $2)";
    const values = [landlord_id, image_url];
    const result = await pool.query(query, values);
    return;
  } catch (error) {
    console.error("Error adding image:", error);
  }
}

const populateImages = async (landlord_id: any) => {
  try {
    let shuffledImgs = stockImages.sort(() => 0.5 - Math.random());
    for (let i = 0; i < 4; i++) {
      addPhoto(landlord_id, shuffledImgs[i]);
    }
    return;
  } catch (error) {
    console.error("Error populating photos:", error);
  }
}

// Add a new Landlord
app.post("/addLandlord", async (req, res) => {
  try {
    /*
    json testing body: 
    {
      "name": "Elsa Karlsson",
      "email": "elsa.karlsson@example.com",
      "password": "secure123",
      "address": "45 Sveavägen, Stockholm",
      "time_from": "2024-05-01",
      "time_to": "2025-04-30",
      "rent_price": 12000,
      "amenities": "Balcony, Gym",
      "description": "Modern apartment with city view",
      "size": 70,
      "commute_name": "KTH Kista",
      "commute_time": 15
    }
    */
    
    // Extract info from the request body
    const { name, email, password, address, time_from, time_to, rent_price, amenities, description, size, commute_name, commute_time } = req.body;
    const usertype = "landlord";
    const user_id = await addUser(name, email, password, usertype);

    const query = 
      `INSERT INTO landlords 
      (user_id, address, time_from, time_to, rent_price, amenities, description, size, commute_name, commute_time ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING landlord_id`;
    const values = [user_id, address, new Date(time_from), new Date(time_to), rent_price, amenities, description, size, commute_name, commute_time];

    const result = await pool.query(query, values);
    const landlord_id = result.rows[0].landlord_id;
    
    // Populate 4 images
    populateImages(landlord_id);

    res.json({ success: true, message: "Landlord added successfully", landlord_id: landlord_id});
  } catch (error) {
    console.error("Error adding landlord:", error);
    res.status(500).json({ success: false, message: "Failed to add landlord" });
  }

});


// Edit the landlord - update values 
app.put("/editLandlord/:landlord_id", async (req, res) => {
  try {
    /*
    json testing body: 
    {
      "name": "Elsa Karlsson",
      "email": "elsa.karlsson@example.com",
      "password": "secure123",
      "address": "45 Sveavägen, Stockholm",
      "time_from": "2024-05-01",
      "time_to": "2025-04-30",
      "rent_price": 12000,
      "amenities": "Balcony, Gym",
      "description": "Modern apartment with city view",
      "size": 70,
      "commute_name": "KTH Kista",
      "commute_time": 15
    }
*/

    const landlord_id = req.params.landlord_id;
    // Extract info from the request body
    const { name, email, password, address, time_from, time_to, rent_price, amenities, description, size, commute_name, commute_time } = req.body;
    // Execute SQL UPDATE statement
    const query = `
      UPDATE landlords 
      SET address = $1, time_from = $2, time_to = $3, rent_price = $4, amenities = $5, description = $6, size = $7, commute_name =$8, commute_time = $9
      WHERE landlord_id = $10
      RETURNING *`;
    const values = [address, new Date(time_from), new Date(time_to), rent_price, amenities, description, size, commute_name, commute_time, landlord_id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Landlord not found" });
    }

    const updatedLandlord = rows[0];

    const user_id = updatedLandlord.user_id;
    await editUser(user_id, name, email, password);

    res.json({ success: true, message: "Landlord updated successfully", landlord: updatedLandlord });
  } catch (error) {
    console.error("Error updating landlord:", error);
    res.status(500).json({ success: false, message: "Failed to update landlord" });
  }
});


// Add a new Tenant
app.post("/addTenant", async (req, res) => {
  try {
    /*
    json testing body: 
    {
      "name": "Elsa Karlsson",
      "email": "elsa.karlsson@example.com",
      "password": "secure123",
      "time_from": "2024-05-01",
      "time_to": "2025-04-30",
      "min_price": 5000,
      "max_price": 12000,
      "description": "Modern apartment with city view",
      "profile_photo": "temp-should be binary?",
      "location_of_interest": "KTH Kista"
    }

    */
    
    // Extract info from the request body
    const { name, email, password, time_from, time_to, min_price, max_price, description, size, location_of_interest, profile_photo } = req.body;
    const usertype = "tenant";
    const user_id = await addUser(name, email, password, usertype);

    const query = 
      `INSERT INTO tenants 
      (user_id, time_from, time_to, min_price, max_price, description, location_of_interest, profile_photo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING tenant_id`;
    const values = [user_id, new Date(time_from), new Date(time_to), min_price, max_price, description, location_of_interest, profile_photo];

    const result = await pool.query(query, values);
    const tenant_id = result.rows[0].tenant_id;

    res.json({ success: true, message: "Tenant added successfully", tenant_id: tenant_id});
  } catch (error) {
    console.error("Error adding tenant:", error);
    res.status(500).json({ success: false, message: "Failed to add tenant" });
  }

});







app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
