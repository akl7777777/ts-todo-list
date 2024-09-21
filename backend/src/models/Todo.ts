import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Todo extends Model {
    public id!: number;
    public title!: string;
    public completed!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos',
});

export default Todo;
