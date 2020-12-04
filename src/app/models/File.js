module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define("File", {
        name: DataTypes.STRING,
        status: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        url_path: DataTypes.STRING
    });

    File.associate = function (models) {
        File.hasMany(models.Location,
            {foreignKey: 'file_id', as: 'locations'}
        )
    }

    return File;
};
