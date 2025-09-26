import express from "express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderDetailsRoutes from "./routes/orderDetailsRoutes.js";

import loginRoutes from "./routes/loginRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderDetails", orderDetailsRoutes);

app.use("/api/login", loginRoutes);

export default app;