/**
 * Created by Flavor on 8/30/17.
 */
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send({ response: 'Between the Sheets ;)' }).status(200);
});

module.exports = router;