const axios = require("axios");
const crypto = require("crypto");

const hmacSecret = process.env.HMAC_SECRET;
if (!hmacSecret || hmacSecret === "" || hmacSecret.trim() === "") {
  console.warn(
    "The hmac secret seems empty. This doesn't seem like what you want."
  );
}
if (hmacSecret.length < 32) {
  console.warn(
    "The hmac secret seems week. You should use at least 32 secure random hex chars."
  );
}

const createHmacSignature = body => {
  const hmac = crypto.createHmac("sha256", hmacSecret);
  const bodySignature = hmac.update(JSON.stringify(body)).digest("hex");

  return `${bodySignature}`;
};

function isJsonString(str) {
  try {
    const json = JSON.parse(str);
    return typeof json === "object";
  } catch (e) {
    return false;
  }
}

const uri = process.env.REQUEST_URI;
const data = {
  data: isJsonString(process.env.REQUEST_DATA)
    ? JSON.parse(process.env.REQUEST_DATA)
    : process.env.REQUEST_DATA
};


const signature = createHmacSignature(data);

axios.post(uri, data, {
  headers: {
    "X-Hub-Signature": signature,
    "X-Hub-SHA": process.env.GITHUB_SHA
  }
}).then(function (response) {
  process.exit();
}).catch(function (error) {
  console.error(`Request failed with status code ${error.response.status}!`);
  console.error(error.response.data);

  process.exit(1);
});