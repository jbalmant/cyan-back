module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define("Location", {
        point: DataTypes.GEOGRAPHY('POINT', 4326),
        file_id: DataTypes.INTEGER,
    });

    return Location;
};
