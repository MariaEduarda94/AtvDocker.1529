const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

// Configuração do Sequelize
const config = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: "",
    database: 'trabweb',
    dialect: 'mysql'
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
});

// Modelo User atualizado
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
    },
    cpf: {
        type: DataTypes.STRING,
    },
    cep: {
        type: DataTypes.STRING,
    },
    logradouro: {
        type: DataTypes.STRING,
    },
    number: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

// Sincronização do banco
(async () => {
    await sequelize.sync();
    console.log("Banco de dados sincronizado!");
})();

// Configuração do Express
const app = express();
app.use(express.json());

// Rotas
app.post('/users', async (req, res) => {
    try {
        const { nome, email, phone, cpf, cep, logradouro, number, city, state, status } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }

        // Verifica se o email já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const user = await User.create({
            nome,
            email,
            phone,
            cpf,
            cep,
            logradouro,
            number,
            city,
            state,
            status
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll(); // Retorna todos os usuários
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, phone, cpf, cep, logradouro, number, city, state, status } = req.body;
        
        const user = await User.findByPk(id);
        if (user) {
            await user.update({
                nome,
                email,
                phone,
                cpf,
                cep,
                logradouro,
                number,
                city,
                state,
                status
            });
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.json({ message: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicialização do servidor
const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
