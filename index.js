const express = require("express");
const cors = require("cors");
const atob = require("atob");

const app = express();
app.use(express.json());
app.use(cors());

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.post("/bfhl", (req, res) => {
  const { data = [], file_b64 } = req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input data" });
  }

  let numbers = [];
  let alphabets = [];
  let highestLowercase = "";
  let isPrimeFound = false;

  // Separate numbers and alphabets
  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(Number(item))) isPrimeFound = true;
    } else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
    }
  });

  // Find highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(
    (char) => char === char.toLowerCase()
  );
  if (lowercaseAlphabets.length > 0) {
    highestLowercase = lowercaseAlphabets.sort().pop();
  }

  // Handle file_b64
  let fileValid = false;
  let fileMimeType = "";
  let fileSizeKb = 0;

  if (file_b64) {
    try {
      const fileParts = file_b64.split(",");
      if (fileParts.length === 2 && fileParts[0].startsWith("data:")) {
        const mimeMatch = fileParts[0].match(/data:(.*);base64/);
        if (mimeMatch) {
          fileMimeType = mimeMatch[1];
          const buffer = Buffer.from(fileParts[1], "base64");
          fileSizeKb = (buffer.length / 1024).toFixed(2);
          fileValid = true;
        }
      }
    } catch (err) {
      console.error("Error processing file:", err.message);
    }
  }

  res.json({
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: isPrimeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb,
  });
});

// GET route
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Server setup
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
