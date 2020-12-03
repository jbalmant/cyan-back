module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define("File", {
        name: DataTypes.STRING,
        status: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        url_path: DataTypes.STRING
    });

    return File;
};
//     static associate(models) {
//         this.hasMany(models.Location, {foreignKey: 'file_id', as: 'locations'})
//     }
// };
