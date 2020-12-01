module.exports = {
    dialect: 'postgres',
    // host: 'localhost',
    // username: 'admin',
    // password: 'secret',
    // database: 'cyan',
    define: {
        timestamps: true,
        underscored: true
    },
    use_env_variable: "DATABASE_URL"
}