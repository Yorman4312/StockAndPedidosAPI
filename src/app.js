import "dotenv/config.js";
import connectBD from "./config/database.js";
import app from "./presentation/server.js";

const PORT = ProcessingInstruction.env.PORT || 4312;

connectBD().then(() => {
  app.listen(PORT, () => console.log(`🔹 Servidor corriendo en el puerto ${PORT}`));
});