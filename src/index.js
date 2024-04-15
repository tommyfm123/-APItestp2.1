// aca ponemos el codigo del servidor
const express = require("express"); // llamo a express
const mongoose = require("mongoose");
require("dotenv").config(); //variable de ambiente
const personasRoutes = require("./routes/personas");



//configuracion general
const app = express();
const port = process.env.PORT || 8080; // conexion de puerto

//middleware

app.use(express.json());
app.use('/api', personasRoutes);


//routes

app.get("/", (req, res) => {
    res.send("Bienvenido a mi API");
});

//conexion a mongodb

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado a mongodb atlas")) // con esto me conecto a la base de datos, la conexion esta en .env
    .catch((error) => console.error(error));

app.listen(port, () => console.log(`escuchando en http://localhost:${port}/`, port)); //mensaje para saber si escucha el puerto



