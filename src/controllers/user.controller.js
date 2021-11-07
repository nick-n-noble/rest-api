const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

function createToken(id, email) {
  const token = jwt.sign({ id, email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  return token;
}

exports.register = async (req, res) => {
  try {
    //Get user input
    const { email, username, password } = req.body;

    //Validate input
    if (!(email && username && password)) {
      return res.status(400).send("All input is required.");
    }

    //Check and validate if user already exists in the database
    if (await User.findOne({ email })) {
      return res.status(409).send("User already exists. Please login.");
    }

    //Save user to database
    const user = await new User({ email, username, password }).save();

    //Create jwt token
    const token = createToken(user._id, email);

    //Save user token
    user.token = token;

    //Save token to the DB
    await user.save();

    //Return new user
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
  }
};

exports.login = async (req, res) => {
  try {
    //Get user input
    const { email, password } = req.body;

    //Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required.");
    }

    //Validate if user exists in the database
    const user = await User.findOne({ email });

    if (user) {
      user.comparePassword(password, (err, isMatch) => {
        if (err) console.error("Password Comparison Error: ", err);
        if (isMatch) {
          //Create token
          const token = createToken(user._id, email);

          //Save user token
          user.token = token;
          user.save();
          //Return user
          return res.status(200).json(user);
        } else {
          return res.status(400).send("Invalid Credentials");
        }
      });

      //Save token to the DB
    }
  } catch (err) {
    console.error(err);
  }
};

exports.getUsername = async (req, res) => {
  try {
    //Get JSON Web Token
    const token = req.headers["x-access-token"];

    //Get account from token
    const user = await User.findOne({ token });

    const username = user.username;

    //Respond with username
    return res.status(200).json({
      username: username,
    });
  } catch (err) {
    console.error(err);
  }
};
