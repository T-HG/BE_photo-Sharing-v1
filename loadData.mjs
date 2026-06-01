import mongoose from "mongoose";
import models from "../photo-sharing-v1/photo-sharing-v1/src/modelData/models.js";

const mongoUrl = "mongodb+srv://photoSharingV1:68686868@photosharingv1.8i7pwmo.mongodb.net/?appName=photoSharingV1";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  location: String,
  description: String,
  occupation: String,
});

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

const User = mongoose.model("User", userSchema);
const Photo = mongoose.model("Photo", photoSchema);

async function loadData() {
  await mongoose.connect(mongoUrl);

  await User.deleteMany({});
  await Photo.deleteMany({});

  const users = models.userListModel();

  let photos = [];
  for (const user of users) {
    const userPhotos = models.photoOfUserModel(user._id);
    photos = photos.concat(userPhotos);
  }

  await User.insertMany(users);
  await Photo.insertMany(photos);

  console.log("Load data done");
  await mongoose.disconnect();
}

loadData().catch((err) => {
  console.log(err.message);
});