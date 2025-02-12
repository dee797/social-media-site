const userTable = require('../backend/db/userCRUD');
const notifTable = require('../backend/db/notificationCRUD');

const today = new Date();

/**
 *  To run the tests in this file, please first run 'node backend/db/populate-test-db.js
 *  
 *  This ensures that the necessary records are created in the test db in order to test
 *  constraints on various tables
 * 
 *  These are two example records of users that will be populated in the db:

    {
        user_id: 1
        name: 'Kelly',
        handle: '@kelly',
        password: 'test',
        bio: '',
        profile_pic_url: '',
        banner_pic_url: '',
        date_joined: new Date()
    }

    {
        user_id: 2,
        name: 'Kevin',
        handle: '@kevin',
        password: 'test',
        bio: '',
        profile_pic_url: '',
        banner_pic_url: '',
        date_joined: new Date(),
    }

 *  When finished testing you can run 'node backend/db/reset-test-db.js' to clear all
 *  test tables of their records
 * 
 */

describe('User table tests', () => {
    test('prevent user from being created if their chosen handle already exists', async () =>{
        const user2 = {
            name: 'Kelly2',
            handle: '@kelly',
            password: 'test',
            bio: '',
            profile_pic_url: '',
            banner_pic_url: '',
            date_joined: today
        }
        
        await expect(userTable.createUser(user2)).rejects.toThrow();
    });
});

describe('Notification table tests', () => {
    test('prevent notification from being created if receiver_id and sender_id are the same', async () => {
        const notif = {
            receiver_id: 1,
            sender_id: 1,
            source_url: 'test',
            type_id: 1
        }
    
        await expect(notifTable.createNotification(notif)).rejects.toThrow();
    });

    test('update notification read status to true', async () => {
        const notif = {
            notification_id: 1
        }

        await notifTable.updateNotification(notif);
        await expect(notifTable.getNotification(notif)).resolves.toEqual({
            notification_id: 1,
            receiver_id: 2,
            sender_id: 1,
            source_url: 'test',
            type_id: 1,
            read_status: true
        });
    });
});


