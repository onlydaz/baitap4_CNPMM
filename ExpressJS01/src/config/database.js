require('dotenv').config();

const { Sequelize } = require('sequelize');

// Initialize Sequelize instance for MySQL
// Required env: MYSQL_HOST, MYSQL_PORT, MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD
const sequelize = new Sequelize(
	process.env.MYSQL_DB,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT || 3306,
		dialect: 'mysql',
		logging: false
	}
);

// Keep the same exported name `connection` for server startup compatibility
const connection = async () => {
	await sequelize.authenticate();
	console.log('Connected to database');
	// Auto sync models to DB. For production, consider migrations instead.
	await sequelize.sync();
};

// Expose sequelize so models can import it
connection.sequelize = sequelize;

module.exports = connection;