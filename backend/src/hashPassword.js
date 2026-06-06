const bcrypt = require("bcrypt");

async function generateHash() {
  const hash = await bcrypt.hash("amit123", 10);

  console.log(hash);
}

generateHash();