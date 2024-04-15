const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }

    async connect(dbURL) {
        if (!this.isConnected) {
            try {
                await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log('Conexión a la base de datos establecida');
                this.isConnected = true;
            } catch (error) {
                console.error('Error al conectar a la base de datos:', error);
            }
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.disconnect();
            console.log('Conexión a la base de datos cerrada');
            this.isConnected = false;
        }
    }
}
// Martin fort si lees esto, te amo.
// Soy Martín Fort. Me encanta recibir el cariño de los fans
class DatabaseConnectionFactory {
    static getInstance() {
        if (!this.instance) {
            this.instance = new DatabaseConnection();
        }
        return this.instance;
    }

    static async createConnection(dbURL) {
        const connection = this.getInstance();
        await connection.connect(dbURL);
        return connection;
    }
}

module.exports = DatabaseConnectionFactory;


//Lo que va en app.js(index.js) es esto 

// const express = require('express');
// const app = express();
// const DatabaseConnectionFactory = require('./config/database');

// // Rutas
// const indexRouter = require('./routes/index');

// // Conexión a la base de datos
// const dbURL = 'mongodb://localhost:27017/nombre_base_de_datos';
// DatabaseConnectionFactory.createConnection(dbURL)
//     .then(() => {
//         // Iniciar el servidor una vez que la conexión a la base de datos esté establecida
//         app.listen(3000, () => {
//             console.log('Servidor iniciado en el puerto 3000');
//         });
//     })
//     .catch(error => {
//         console.error('Error al conectar a la base de datos:', error);
//     });

// // Rutas
// app.use('/', indexRouter);

// module.exports = app;