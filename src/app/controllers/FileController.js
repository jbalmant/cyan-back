const { File } = require('../models');

const url = require("url");
const Path = require('path');
const FileStatus = require('../enums/FileStatus');
const downloadFile = require('../utils/downloadFile')


class FileController {

    async store(req, res) {
        const { user_id } = req
        const { url_path } = req.body;
        const status = FileStatus.QUEUED;
        const name = Path.posix.basename(url.parse(url_path).pathname)

        const file = await File.create({ url_path, status, name, user_id });

        downloadFile(file)

        return res.json(file)
    }

    async list(req, res) {
        const { user_id } = req
        return res.json(await File.findAll({ where: { user_id } }));
    }

    async get(req, res) {
        const { id } = req.params

        const file = await File.findByPk(id, {
            include: { association: 'locations'}
        });

        if (!file) {
            return res.status(400).json({error: 'File not found'})
        }

        return res.json(file);
    }
}

module.exports = new FileController();