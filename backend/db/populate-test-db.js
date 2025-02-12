const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            // create user, user 1
            {
                user_id: 1,
                name: 'Kelly',
                handle: '@kelly',
                password: 'test',
                bio: '',
                profile_pic_url: '',
                banner_pic_url: '',
                date_joined: new Date(),
            },
            // create another user, user 2
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
        ]
    });

    await prisma.post.createMany({
        data: [
            // create first post for user 1
            {
                post_id: 1,
                author_id: 1,
                content: 'Hello World',
                date_created: new Date()
            },
            {
                post_id: 2,
                author_id: 2,
                content: 'Hello World 2',
                date_created: new Date()
            }
        ]
    });

    // create record in Like table to simulate user 1 liking user 2's first post
    await prisma.like.create({
        data: {
            like_id: 1,
            post_id: 2,
            user_id: 1
        }
    });

    // create record in Follow table to simulate user 1 following user 2
    await prisma.follow.create({
        data: {
            follow_id: 1,
            followed_user_id: 2,
            follower_id: 1
        }  
    });

    // create record in Repost table to simulate user 1 reposting user 2's first post
    await prisma.repost.create({
        data: {
            repost_id: 1,
            user_id: 1,
            parent_post_id: 2
        }
    });

    // create records in Post and Reply tables to simulate user 1 replying to user 2's first post
    // (a record needs to be created in Post since replies are essentially just posts)
    await prisma.post.create({
        data: {
            post_id: 3,
            author_id: 1,
            content: 'I like this post',
            date_created: new Date()

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

    // create records in Post and Quote_Repost tables to simulate user 2 quote reposting user 1's first post
    // (a record needs to be created in Post since quote reposts are essentially just posts)
    await prisma.post.create({
        data: {
            post_id: 4,
            author_id: 2,
            content: 'This is a cool post',
            date_created: new Date()
        }
    });

    await prisma.quote_Repost.create({
        data: {
            quote_id: 1,
            parent_post_id: 1,
            quote_post_id: 4,
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
            // create notification for user 2 when user 1 liked their post
            {
                notification_id: 1,
                receiver_id: 2,
                source_url: 'test',
                sender_id: 1,
                type_id: 1
            },
            // create notification for user 2 when user 1 followed them
            {
                notification_id: 2,
                receiver_id: 2,
                source_url: 'test',
                sender_id: 1,
                type_id: 2
            },
            // create notification for user 2 when user 1 reposted their post
            {
                notification_id: 3,
                receiver_id: 2,
                source_url: 'test',
                sender_id: 1,
                type_id: 3
            },
            // create notification for user 1 when user 2 quote reposted their post
            {
                notification_id: 4,
                receiver_id: 1,
                source_url: 'test',
                sender_id: 2,
                type_id: 3
            },
            // create notification for user 2 when user 1 replied to their post
            {
                notification_id: 5,
                receiver_id: 2,
                source_url: 'test',
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