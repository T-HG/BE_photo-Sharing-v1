import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const mongoUrl = "mongodb+srv://photoSharingV1:68686868@photosharingv1.8i7pwmo.mongodb.net/?appName=photoSharingV1";

 app.get("/", (req, res) => {
        res.send("Server running");
    });

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    location: String,
    description: String,
    occupation: String,
    login_name: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: String,
  user: {
    _id: String,
    first_name: String,
    last_name: String,
  },
});

const photoSchema = new mongoose.Schema({
  date_time: String,
  file_name: String,
  user_id: String,
  comments: [commentSchema],
});

const Photo = mongoose.model("Photo", photoSchema);

//[GET] userlist
app.get("/user/list", async (req, res) => {
  const users = await User.find({}, "_id first_name last_name");
  res.json(users);
});

//[GET] photoOfUser
app.get("/photosOfUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    const photos = await Photo.find({ user_id: req.params.id });
    res.json(photos);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//[GET] userdetail
app.get("/user/:id", async (req,res) => {
    try{
        const user = await User.findById(
            req.params.id,
            "_id first_name last_name location description occupation"
        );
        if (!user) {
            res.status(400).send("User not found");
            return;
        }
        res.json(user);
    }catch(err){
        res.status(400).send(err.message);
    }
});

//[POST] login
app.post("/admin/login", async (req, res) => {
  try{
    const { login_name, password } = req.body;

    const user = await User.findOne(
      {login_name: login_name, password: password },
      "_id first_name  last_name login_name"
    );
    if (!user){
      res.status(400).send("Login failed");
      return;
    }

    res.json(user);
  }catch(err){
    res.status(400).send(err.message);
  }
});

//[POST] logout
app.post("/admin/logout", (req, res) => {
  res.send("Logout success");
});

app.listen(port, () => {
  console.log(`Server running ${port}`);
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });