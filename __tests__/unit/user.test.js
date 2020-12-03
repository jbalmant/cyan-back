const bcrypt = require('bcryptjs');

const { User } = require('../../src/app/models');

const truncate = require ('../utils/truncate');

describe('User', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should encrypt password', async  () => {
        const user = await User.create({
            name: 'someone',
            email: 'someone@email.com',
            password: 'secret'
        });

        const result = await bcrypt.compare('secret', user.password_hash)

        expect(result).toBe(true);
    });
})