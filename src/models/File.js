const { Model, DataTypes } = require('sequelize');

class File extends Model {
    static init(sequelize) {
        super.init({
            path: DataTypes.STRING,
            filename: DataTypes.STRING,
            status: DataTypes.INTEGER
        }, {
            sequelize
        })
    };

    static associate(models) {
        this.hasMany(models.Location, {foreignKey: 'file_id', as: 'locations'})
    }
};

module.exports = File;