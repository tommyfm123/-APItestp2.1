const express = require("express");
const personaSchema = require('../models/persona');

const router = express.Router();

// Crear una persona
router.post("/personas", (req, res) => {
    const persona = new personaSchema(req.body); // Corregido: añadir "new" para crear una nueva instancia
    persona.save()
        .then((data) => res.json(data))
        .catch((error) => res.status(400).json({ message: error.message })); // Corregido: devolver un código de estado 400 para errores de solicitud
});

// Obtener todas las personas
router.get("/personas", (req, res) => {
    personaSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message })); // Corregido: devolver un código de estado 500 para errores internos del servidor
});

// Obtener una sola persona por id
router.get("/personas/:id", (req, res) => {
    const { id } = req.params;
    personaSchema.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Persona no encontrada" }); // Corregido: devolver un código de estado 404 si no se encuentra la persona
                return;
            }
            res.json(data);
        })
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Actualizar persona por id
router.put("/personas/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, DNI, FechaNacimiento } = req.body;
    personaSchema.updateOne({ _id: id }, { nombre, DNI, FechaNacimiento })
        .then(() => res.json({ message: "Persona actualizada correctamente" }))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Eliminar persona
router.delete("/personas/:id", (req, res) => {
    const { id } = req.params;
    personaSchema.deleteOne({ _id: id })
        .then(() => res.json({ message: "Persona eliminada correctamente" }))
        .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;

