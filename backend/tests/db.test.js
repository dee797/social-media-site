const userCRUD = require('../db/userCRUD');
const notifCRUD = require('../db/notificationCRUD');
const followCRUD = require('../db/followCRUD');
const likeCRUD = require('../db/likeCRUD');
const replyCRUD = require('../db/replyCRUD');
const postCRUD = require('../db/postCRUD');

const {exampleUser1, exampleUser2} = require('../db/exampleUsers')

/**
 *  To run the tests in this file, please first run 'node backend/db/populate-test-db.js
 *  
 *  This ensures that the necessary records are created in the test db in order to test
 *  constraints on various tables
 * 
 *  These are two examples of users' records that will be populated in the db
    (they have been imported as exampleUser1 and exampleUser2 above): 
    
    {
        user_id: 1,
        name: 'Kelly',
        handle: '@kelly',
        bio: '',
        profile_pic_url: '',
        banner_pic_url: '',
        date_joined: new Date('2025-01-01')
    }

    {
        user_id: 2,
        name: 'Kevin',
        handle: '@kevin',
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
            bio: '',
            profile_pic_url: '',
            banner_pic_url: '',
            date_joined: new Date()
        }
        
        await expect(userCRUD.createUser(user2)).rejects.toThrow();
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
    
        await expect(notifCRUD.createNotification(notif)).rejects.toThrow();
    });

    test('update notification read status to true', async () => {
        const notif = {
            notification_id: 1
        }

        await notifCRUD.updateNotification(notif);
        await expect(notifCRUD.getNotification(notif)).resolves.toEqual({
            notification_id: 1,
            receiver_id: 2,
            sender_id: 1,
            source_url: 'test',
            type_id: 1,
            read_status: true
        });
    });

    test(`prevent repeat notifications if values for receiver_id, 
          sender_id, source_url, and type_id together already exist
          in the table`, async () => {
        const notif = {
            receiver_id: 1,
            sender_id: 2,
            source_url: 'test',
            type_id: 3
        }

        await expect(notifCRUD.createNotification(notif)).rejects.toThrow();
    });
});



describe('Follow table tests', () => {
    test('prevent follow from being created if followed_user_id and follower_id are the same', async () =>{
        const follow = {
            followed_user_id: 1,
            follower_id: 1
        }

        await expect(followCRUD.createFollow(follow)).rejects.toThrow();
    });

    test("get a list of a user's followers", async () => {
        await expect(followCRUD.getFollowers(exampleUser2)).resolves.toEqual([{follower: exampleUser1}]);
    });

    test("get a list of people a user is following", async () => {
        await expect(followCRUD.getFollowing(exampleUser1)).resolves.toEqual([{followed_user: exampleUser2}])
    });

    test('prevent repeat follow if it already exists in db', async () => {
        const follow = {
            followed_user_id: 2,
            follower_id: 1
        }

        await expect(followCRUD.createFollow(follow)).rejects.toThrow();
    });
});



describe('Like table tests', () => {
    test('prevent a repeat like if a like from a user on a particular post already exists', async () => {
        const like = {
            post_id: 2,
            user_id: 1
        }

        await expect(likeCRUD.createLike(like)).rejects.toThrow();
    });

    test('get list of posts that a user has liked', async () => {
        await expect(likeCRUD.getLikedPosts(exampleUser1)).resolves.toEqual([{post: 
            {
                post_id: 2,
                author: { handle: "@kevin", name: "Kevin", profile_pic_url: "", user_id: 2 },
                date_created: new Date('2025-01-01'),
                content: 'Hello World 2'
            }
        }]);
    });

    test('get correct like count for a post', async () => {
        await expect(likeCRUD.getLikeCountForPost({post_id: 2})).resolves.toEqual(1);
    });
});



describe('Reply tests (involves both Reply table and Post table)', () => {
    test('get list of replies for a particular post', async () => {
        await expect(replyCRUD.getThread({post_id : 2})).resolves.toEqual([
            {
                post_id: 2,
                author_id: 2,
                date_created: new Date('2025-01-01'),
                content: 'Hello World 2'
              },
              {
                post_id: 3,
                author_id: 1,
                date_created: new Date('2025-01-01'),
                content: 'I like this post'
              },
              {
                post_id: 4,
                author_id: 1,
                date_created: new Date('2025-01-01'),
                content: 'I forgot to mention, this post rocks'
              },
              {
                post_id: 5,
                author_id: 2,
                date_created: new Date('2025-01-01'),
                content: 'Thanks for the like'
              },
              {
                post_id: 6,
                author_id: 1,
                date_created: new Date('2025-01-01'),
                content: 'No problem'
              }
        ]);
    });

    test('get correct reply count', async () => {
        await expect(replyCRUD.getReplyCount({post_id: 2})).resolves.toEqual(4);
    });

    test('get correct parent post of reply', async () => {
        await expect(replyCRUD.getParentOfReply({post_id: 4})).resolves.toEqual({parent_post: 
            {
                author: {
                    handle: "@kevin",
                    name: "Kevin",
                    user_id: 2
                },
                post_id: 2
            }
        });
    });

    test('get all the replies a user has created (but not the entire reply thread for each one)', async () => {
        await expect(replyCRUD.getUserReplies({user_id: 1})).resolves.toEqual([
            {
                "parent_post": {"author": {"name": "Kevin", "handle": "@kevin", "user_id": 2}, "post_id": 2}, 
                "reply_post": {"author_id": 1, "content": "I like this post", "date_created": new Date('2025-01-01'), "post_id": 3}}, 
            {
                "parent_post": {"author": {"name": "Kevin", "handle": "@kevin", "user_id": 2}, "post_id": 2}, 
                "reply_post": {"author_id": 1, "content": "I forgot to mention, this post rocks", "date_created": new Date('2025-01-01'), "post_id": 4}}, 
            {
                "parent_post": {"author": {"name": "Kevin", "handle": "@kevin", "user_id": 2}, "post_id": 5}, 
                "reply_post": {"author_id": 1, "content": "No problem", "date_created": new Date('2025-01-01'), "post_id": 6}
            }
        ]);
    });

    test('get all the replies a user has created, plus like count, repost count, reply count', async () => {
        await expect(replyCRUD.getUserReplyData({user_id: 1})).resolves.toEqual(
            {
                "name": "Kelly", 
                "replies": [
                    {
                        "numLikes": 0, 
                        "numReplies": 2, 
                        "numReposts": 0, 
                        "parent_post": {
                            "author": { "handle": "@kevin", "name": "Kevin", "user_id": 2 }, 
                            "post_id": 2
                        }, 
                        "reply_post": { "author_id": 1, "content": "I like this post", "date_created": new Date('2025-01-01'), "post_id": 3 }
                    }, 
                    {
                        "numLikes": 0, 
                        "numReplies": 0, 
                        "numReposts": 0, 
                        "parent_post": {
                            "author": { "handle": "@kevin", "name": "Kevin", "user_id": 2 }, 
                            "post_id": 2
                        }, 
                        "reply_post": { "author_id": 1, "content": "I forgot to mention, this post rocks", "date_created": new Date('2025-01-01'), "post_id": 4}
                    }, 
                        
                    {
                        "numLikes": 0, 
                        "numReplies": 0, 
                        "numReposts": 0, 
                        "parent_post": {
                            "author": { "handle": "@kevin", "name": "Kevin", "user_id": 2 }, 
                            "post_id": 5
                        }, 
                        "reply_post": { "author_id": 1, "content": "No problem", "date_created": new Date('2025-01-01'), "post_id": 6 }
                    }
                ], 
                "username": "@kelly"
            }
        );
    })
});

describe('Post tests', () => {
    test("get list of user's posts, including reposts and quote reposts", async () => {
        await expect(postCRUD.getUserPosts({user_id: 2})).resolves.toEqual([
            {
                "parent_post": { 
                    "author": {"handle": "@kelly", "name": "Kelly", "profile_pic_url": "", "user_id": 1}, "content": "Hello World", "date_created": new Date('2025-01-01'), "post_id": 1}, 
                "quote_post": {
                    "author": {"handle": "@kevin", "name": "Kevin", "profile_pic_url": "", "user_id": 2}, "content": "This is a cool post", "date_created": new Date('2025-01-01'), "post_id": 7}
            }, 
                    
            {
                "author_id": 2, "content": "Hello World 2", "date_created": new Date('2025-01-01'), "post_id": 2
            }
        ]);
    });

    test("get list of user's posts like above, but this time include counts for the number of likes, reposts, and replies", async () => {
        await expect(postCRUD.getUserPostData({user_id: 2})).resolves.toEqual({
            "name": "Kevin",
            "username": "@kevin",
            "profile_pic_url": "",
            "posts": [
                {
                    "numLikes": 0, 
                    "numReplies": 0, 
                    "numReposts": 0, 
                    "parent_post": {"author": {"handle": "@kelly", "name": "Kelly", "profile_pic_url": "", "user_id": 1}, "content": "Hello World", "date_created": new Date('2025-01-01'), "post_id": 1}, 
                    "quote_post": {"author": {"handle": "@kevin", "name": "Kevin", "profile_pic_url": "", "user_id": 2}, "content": "This is a cool post", "date_created": new Date('2025-01-01'), "post_id": 7}
                }, 
                {
                    "author_id": 2, 
                    "content": "Hello World 2", 
                    "date_created": new Date('2025-01-01'), 
                    "numLikes": 1, 
                    "numReplies": 4, 
                    "numReposts": 1, 
                    "post_id": 2
                }
            ]
        });
    });

    test('get post data for a single post', async () => {
        await expect(postCRUD.getPostData({post_id: 2})).resolves.toEqual(
            {
                "parent": null, 
                "thread": [
                    {"author_id": 2, "content": "Hello World 2", "date_created": new Date('2025-01-01'), "name": "Kevin", "numLikes": 1, "numReplies": 4, "numReposts": 1, "post_id": 2, "username": "@kevin", "profile_pic_url": ""}, 
                    {"author_id": 1, "content": "I like this post", "date_created": new Date('2025-01-01'), "name": "Kelly", "numLikes": 0, "numReplies": 2, "numReposts": 0, "post_id": 3, "username": "@kelly", "profile_pic_url": ""}, 
                    {"author_id": 1, "content": "I forgot to mention, this post rocks", "date_created": new Date('2025-01-01'), "name": "Kelly", "numLikes": 0, "numReplies": 0, "numReposts": 0, "post_id": 4, "username": "@kelly", "profile_pic_url": ""}, 
                    {"author_id": 2, "content": "Thanks for the like", "date_created": new Date('2025-01-01'), "name": "Kevin", "numLikes": 0, "numReplies": 1, "numReposts": 0, "post_id": 5, "username": "@kevin", "profile_pic_url": ""}, 
                    {"author_id": 1, "content": "No problem", "date_created": new Date('2025-01-01'), "name": "Kelly", "numLikes": 0, "numReplies": 0, "numReposts": 0, "post_id": 6, "username": "@kelly", "profile_pic_url": ""}
                ]
            }
        );
    });

    test('get post data for a reply post (only a part of a thread)', async () => {
        await expect(postCRUD.getPostData({post_id: 3})).resolves.toEqual(
            {
                "parent": {
                    "parent_post": {
                        "author": {
                            "handle": "@kevin", "name": "Kevin", "user_id": 2
                        }, 
                        "post_id": 2
                    }
                }, 
                "thread": [
                    { "author_id": 1, "content": "I like this post", "date_created": new Date('2025-01-01'), "name": "Kelly", "numLikes": 0, "numReplies": 2, "numReposts": 0, "post_id": 3, "username": "@kelly", "profile_pic_url": "" }, 
                    { "author_id": 2, "content": "Thanks for the like", "date_created": new Date('2025-01-01'), "name": "Kevin", "numLikes": 0, "numReplies": 1, "numReposts": 0, "post_id": 5, "username": "@kevin", "profile_pic_url": "" }, 
                    { "author_id": 1, "content": "No problem", "date_created": new Date('2025-01-01'), "name": "Kelly", "numLikes": 0, "numReplies": 0, "numReposts": 0, "post_id": 6, "username": "@kelly", "profile_pic_url": "" }
                ]
            }
        );
    });
    
    test('get first 10 posts from Post table', async () => {
        await expect(postCRUD.get10Posts()).resolves.toEqual([
            {
                "author": {"handle": "@kelly", "name": "Kelly", "profile_pic_url": "", "user_id": 1}, 
                "author_id": 1, 
                "content": "Hello World", 
                "date_created": new Date('2025-01-01'), 
                "numLikes": 0, 
                "numReplies": 0, 
                "numReposts": 1, 
                "post_id": 1, 
                "quote_parent": [] 
            }, 
            {
                "author": {"handle": "@kevin", "name": "Kevin", "profile_pic_url": "", "user_id": 2}, 
                "author_id": 2, 
                "content": "Hello World 2", 
                "date_created": new Date('2025-01-01'), 
                "numLikes": 1, 
                "numReplies": 4, 
                "numReposts": 1, 
                "post_id": 2, 
                "quote_parent": []
            }, 
            {
                "author": {"handle": "@kevin", "name": "Kevin", "profile_pic_url": "", "user_id": 2}, 
                "author_id": 2, 
                "content": "This is a cool post", 
                "date_created": new Date('2025-01-01'), "numLikes": 0, "numReplies": 0, "numReposts": 0, "post_id": 7, 
                "quote_parent": [{"parent_post": {"author": {"handle": "@kelly", "name": "Kelly", "profile_pic_url": "", "user_id": 1}, "content": "Hello World", "date_created": new Date('2025-01-01'), "post_id": 1}}]
            }
        ]);
    });


});