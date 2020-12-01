module.exports = {
    // development: {
    //     dialect: 'postgres',
    //     host: 'localhost',
    //     username: 'admin',
    //     password: 'secret',
    //     database: 'cyan',
    //     define: {
    //         timestamps: true,
    //         underscored: true
    //     }
    // },
    production: {
        use_env_variable: "DATABASE_URL",
        dialect: 'postgres',
        define: {
            timestamps: true,
            underscored: true
        },
    }
};