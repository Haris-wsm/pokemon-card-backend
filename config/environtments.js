if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "staging") {
  require("dotenv").config({ path: ".env.staging" });
} else if (process.env.NODE_ENV === "testing") {
  require("dotenv").config({ path: ".env.testing" });
} else {
  require("dotenv").config();
}
