import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
// const pool = new pg.Pool();
// The secret connection string you copied earlier
const connectionString = process.env.DATABASE_URL;
  //"postgresql://postgres:5C1gbdGF2DdgFCEGAff46CBge2DfC1*6@postgres.railway.internal:5432/railway";
  // '${{ DATABASE_URL }}';
const pool = new pg.Pool({
  connectionString,
});

const app = express();
const port = process.env.PORT || 3333;


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
// app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  // const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is simple return`);
});

app.get("/ads", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM Test");
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
