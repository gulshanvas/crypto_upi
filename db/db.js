const sqlite3 = require('sqlite3').verbose();

let db;

function StartDb() {
  // Create or open a database file
  db = new sqlite3.Database('mydatabase3.db', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });
}

function SerializeDB() {
  // Create a table
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_no TEXT NOT NULL,
      public_key TEXT UNIQUE NOT NULL,
      pk_json TEXT,
      session_id TEXT UNIQUE
    )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table created successfully.');
        }
      }
    );

    // Query data
    db.each(
      `SELECT id, phone_no, public_key, pk_json, session_id FROM users`,
      (err, row) => {
        if (err) {
          console.error('Error querying data:', err.message);
        } else {
          console.log("row ===> ", row)
          console.log(`Row: ${row.id}, ${row.phone_no}, ${row.public_key}`);
        }
      }
    );
  });
}

function close() {
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}


async function CreateUser(mobileNumber, publicKey, encryptedJSON) {
  const stmt = db.prepare(`INSERT INTO users (phone_no, public_key, pk_json) VALUES (?, ?, ?)`);
  stmt.run(mobileNumber, publicKey, encryptedJSON);
  stmt.finalize();
}

async function CreateSessionId(phoneNumber, sessionId) {
  const stmt = db.prepare(`INSERT INTO users (session_id) VALUES (?) where phone_no = ?`);
  stmt.run(sessionId, phoneNumber);
  stmt.finalize();
}

async function CreateUser(mobileNumber, publicKey, encryptedJSON) {
  const stmt = db.prepare(`INSERT INTO users (phone_no, public_key, pk_json) VALUES (?, ?, ?)`);
  stmt.run(mobileNumber, publicKey, encryptedJSON);
  stmt.finalize();
}

async function UpdateSessionId(phoneNumber, sessionId) {
  const stmt = db.prepare(`INSERT INTO users (session_id) VALUES (?) where phone_no = ?`);
  stmt.run(sessionId, phoneNumber);
  stmt.finalize();
}


async function GetUser(mobileNumber) {
  console.log('in GetUser ==>', mobileNumber);

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, phone_no, public_key, pk_json, session_id FROM users WHERE phone_no = ?`,
      [mobileNumber],
      (err, row) => {
        if (err) {
          console.error('Error querying data:', err.message);
          reject(err); // Reject the promise if there's an error
        } else {
          console.log('row ===> ', row);
          resolve(row); // Resolve the promise with the row data
        }
      }
    );
  });
}


module.exports = {
  GetUser,
  StartDb,
  SerializeDB,
  CreateUser,
  CreateSessionId,
  UpdateSessionId,
}



