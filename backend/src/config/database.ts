import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1', // 使用 IP 地址而不是 localhost
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'your_mysql_username',
    password: process.env.DB_PASSWORD || 'your_mysql_password',
    database: process.env.DB_NAME || 'ts_todo_list',
    logging: console.log,
});

export default sequelize;
