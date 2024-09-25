import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Todo extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public completed!: boolean;
    public assignedTo!: number;
    public createdBy!: number;
    public dueDate!: Date;
    public attachment?: string;
}

Todo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    attachment: {
        type: DataTypes.TEXT,  // 使用 TEXT 类型来存储较长的字符串
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Todo',
});

Todo.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Todo.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

export default Todo;
