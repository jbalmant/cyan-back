// const File = require('../../assets/File');
// const Location = require('../../assets/Location');

module.exports = {
    async list(req, res) {
        const { file_id } = req.params;

        const file = await File.findByPk(file_id, {
            include: { association: 'locations'}
        });

        if (!file) {
            return res.status(400).json({ error: 'File not found'})
        }

        return res.json(file.locations);
    }
};