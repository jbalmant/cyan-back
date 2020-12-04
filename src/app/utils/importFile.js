const Fs = require('fs')
const csv = require('fast-csv');

const {File, Location} = require('../models');
const FileStatus = require('../enums/FileStatus');


function create_location_obj(row) {
    const lat = parseFloat(row[0])
    const lng = parseFloat(row[1])

    if (lat && lng) {
        const point = {type: 'Point', coordinates: [row[0], row[1]]};
        return ({file_id: file.id, point: point});
    }
}

module.exports = async function (file, tmp_file_name) {
    const locations = [];

    await File.update({status: FileStatus.IMPORTING}, {where: {id: file.id}});

    try {
        Fs.createReadStream(tmp_file_name)
            .pipe(csv.parse({headers: false}))
            .on('error', error => {
                throw error.message;
            })
            .on('data', row => {
                const location = create_location_obj(row)
                if (location) {
                    locations.push(location)
                }
            })
            .on('end', async () => {
                await Location.bulkCreate(locations)
            });
        await File.update({status: FileStatus.IMPORTED}, {where: {id: file.id}});
    } catch (err) {
        await File.update({status: FileStatus.IMPORT_ERROR}, {where: {id: file.id}});
    }
};