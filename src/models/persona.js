const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId, // Agregamos el ID único que se incrementará automáticamente
    nombre: {
        type: String,
        required: true
    },
    DNI: {
        type: Number,
        required: true
    },
    FechaNacimiento: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Persona', personaSchema);
