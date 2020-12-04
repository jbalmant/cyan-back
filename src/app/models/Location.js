module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define("Location", {
        point: DataTypes.GEOGRAPHY('POINT', 4326),
        file_id: DataTypes.INTEGER,
    });

    return Location;
};
//     static associate(models) {
//         this.hasMany(models.Location, {foreignKey: 'file_id', as: 'locations'})
//     }
// };
