const { PrismaClient } = require('@prisma/client')
const {exampleUser1, exampleUser2} = require('./exampleUsers')
const copy1 = {...exampleUser1, password: 'test'};
const copy2 = {...exampleUser2, password: 'test'};

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            // create user in db, exampleUser1
            copy1,
            // create another user in db, exampleUser2
            copy2
        ]
    });

    await prisma.post.createMany({
        data: [
            // create first post for user1
            {
                post_id: 1,
                author_id: 1,
                content: 'Hello World',
                date_created: new Date('2025-01-01')
            },
            // create first post for user2
            {
                post_id: 2,
                author_id: 2,
                content: 'Hello World 2',
                date_created: new Date('2025-01-01')
            }
        ]
    });

    // create record in Like table to simulate user1 liking user2's first post
    await prisma.like.create({
        data: {
            like_id: 1,
            post_id: 2,
            user_id: 1
        }
    });

    // create record in Follow table to simulate user1 following user2
    await prisma.follow.create({
        data: {
            follow_id: 1,
            followed_user_id: 2,
            follower_id: 1
        }  
    });

    // create record in Repost table to simulate user1 reposting user2's first post
    await prisma.repost.create({
        data: {
            repost_id: 1,
            user_id: 1,
            parent_post_id: 2
        }
    });

    // create the following records in Post and Reply tables to simulate user1 and user2 replying to each other,
    // which will create a reply thread
    // (a record needs to be created in Post since replies are essentially just posts)

    // first reply, by user1 on user2's first post ('Hello World 2')
    await prisma.post.create({
        data: {
            post_id: 3,
            author_id: 1,
            content: 'I like this post',
            date_created: new Date('2025-01-01')

        }
    });

    await prisma.reply.create({
        data: {
            reply_id: 1,
            reply_post_id: 3,
            parent_post_id: 2,
            user_id: 1
        }
    });


    // second reply, again by user1, in response to user2's post ('Hello World')
    await prisma.post.create({
        data: {
            post_id: 4,
            author_id: 1,
            content: 'I forgot to mention, this post rocks',
            date_created: new Date('2025-01-01')

        }
    });

    await prisma.reply.create({
        data: {
            reply_id: 2,
            reply_post_id: 4,
            parent_post_id: 2,
            user_id: 1
        }
    });

    // second reply by user2 in response to user1's reply ('I like this post')
    await prisma.post.create({
        data: {
            post_id: 5,
            author_id: 2,
            content: 'Thanks for the like',
            date_created: new Date('2025-01-01')

        }
    });

    await prisma.reply.create({
        data: {
            reply_id: 3,
            reply_post_id: 5,
            parent_post_id: 3,
            user_id: 2
        }
    });

    // third reply by user1 in response to user2's reply ('Thanks for the like')
    await prisma.post.create({
        data: {
            post_id: 6,
            author_id: 1,
            content: 'No problem',
            date_created: new Date('2025-01-01')

        }
    });

    await prisma.reply.create({
        data: {
            reply_id: 4,
            reply_post_id: 6,
            parent_post_id: 5,
            user_id: 1
        }
    });



    // create records in Post and Quote_Repost tables to simulate user2 quote reposting user1's first post
    // (a record needs to be created in Post since quote reposts are essentially just posts)
    await prisma.post.create({
        data: {
            post_id: 7,
            author_id: 2,
            content: 'This is a cool post',
            date_created: new Date('2025-01-01')
        }
    });

    await prisma.quote_Repost.create({
        data: {
            quote_id: 1,
            parent_post_id: 1,
            quote_post_id: 7,
            user_id: 2
        }
    });


    // create notification types
    await prisma.notification_Type.createMany({
        data: [
            { notification_type_id: 1, type: 'like' },
            { notification_type_id: 2, type: 'follow' },
            { notification_type_id: 3, type: 'repost'},
            { notification_type_id: 4, type: 'reply' }
        ]
    });
    

    await prisma.notification.createMany({
        data: [
            // create notification for user2 when user1 liked their post
            {
                notification_id: 1,
                receiver_id: 2,
                source_url: '/users/2/posts/2',
                sender_id: 1,
                type_id: 1
            },
            // create notification for user2 when user1 followed them
            {
                notification_id: 2,
                receiver_id: 2,
                source_url: '/users/1/profile',
                sender_id: 1,
                type_id: 2
            },
            // create notification for user2 when user1 reposted their post
            {
                notification_id: 3,
                receiver_id: 2,
                source_url: '/users/2/posts/2',
                sender_id: 1,
                type_id: 3
            },
            // create notification for user1 when user2 quote reposted their post
            {
                notification_id: 4,
                receiver_id: 1,
                source_url: '/users/2/posts/7',
                sender_id: 2,
                type_id: 3
            },
            // create notification for user2 when user1 first replied to their post
            {
                notification_id: 5,
                receiver_id: 2,
                source_url: '/users/2/posts/2',
                sender_id: 1,
                type_id: 4
            }
        ]
    })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })