import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado a MongoDB ✅");
  } catch (err) {
    console.error("❌ Error de la conexión ❌");
    process.exit(1);
  }
};

export default connectDB;