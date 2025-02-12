const userDB = require('../backend/db/userCRUD');

const today = new Date();

/**
 *  a record for 'user' has been created in the test db
 *  to test constraints on various tables
 * 
    const user = {
        name: 'Kelly',
        handle: '@kelly',
        password: 'test',
        bio: '',
        profilePicURL: '',
        bannerPicURL: '',
        dateJoined: new Date()
    }
*/


test('prevent user from being created if their chosen handle already exists', async () =>{
    const user2 = {
        name: 'Kelly2',
        handle: '@kelly',
        password: 'test',
        bio: '',
        profilePicURL: '',
        bannerPicURL: '',
        dateJoined: today
    }
    
    await expect(userDB.createUser(user2)).rejects.toThrow();
})