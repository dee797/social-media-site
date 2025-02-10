-- CreateTable
CREATE TABLE "User" (
    "userID" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "handle" VARCHAR(255) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(500),
    "profilePicURL" VARCHAR(255),
    "bannerPicURL" VARCHAR(255),
    "dateJoined" DATE NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationID" SERIAL NOT NULL,
    "receiverID" INTEGER NOT NULL,
    "senderID" INTEGER NOT NULL,
    "sourceURL" VARCHAR(255) NOT NULL,
    "typeID" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID")
);

-- CreateTable
CREATE TABLE "NotificationType" (
    "notificationTypeID" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("notificationTypeID")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followID" SERIAL NOT NULL,
    "followedUserID" INTEGER NOT NULL,
    "followerID" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followID")
);

-- CreateTable
CREATE TABLE "Post" (
    "postID" SERIAL NOT NULL,
    "authorID" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP NOT NULL,
    "content" VARCHAR(500),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postID")
);

-- CreateTable
CREATE TABLE "Like" (
    "likeID" SERIAL NOT NULL,
    "postID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("likeID")
);

-- CreateTable
CREATE TABLE "Reply" (
    "replyID" SERIAL NOT NULL,
    "replyPostID" INTEGER NOT NULL,
    "parentPostID" INTEGER NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("replyID")
);

-- CreateTable
CREATE TABLE "Repost" (
    "repostID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "parentPostID" INTEGER NOT NULL,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("repostID")
);

-- CreateTable
CREATE TABLE "QuoteRepost" (
    "quoteID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "parentPostID" INTEGER NOT NULL,
    "quotePostID" INTEGER NOT NULL,

    CONSTRAINT "QuoteRepost_pkey" PRIMARY KEY ("quoteID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followedUserID_followerID_key" ON "Follow"("followedUserID", "followerID");

-- CreateIndex
CREATE UNIQUE INDEX "Like_postID_userID_key" ON "Like"("postID", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_replyPostID_parentPostID_key" ON "Reply"("replyPostID", "parentPostID");

-- CreateIndex
CREATE UNIQUE INDEX "Repost_userID_parentPostID_key" ON "Repost"("userID", "parentPostID");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRepost_userID_parentPostID_quotePostID_key" ON "QuoteRepost"("userID", "parentPostID", "quotePostID");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "NotificationType"("notificationTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedUserID_fkey" FOREIGN KEY ("followedUserID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerID_fkey" FOREIGN KEY ("followerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replyPostID_fkey" FOREIGN KEY ("replyPostID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_parentPostID_fkey" FOREIGN KEY ("parentPostID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_parentPostID_fkey" FOREIGN KEY ("parentPostID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRepost" ADD CONSTRAINT "QuoteRepost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRepost" ADD CONSTRAINT "QuoteRepost_parentPostID_fkey" FOREIGN KEY ("parentPostID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRepost" ADD CONSTRAINT "QuoteRepost_quotePostID_fkey" FOREIGN KEY ("quotePostID") REFERENCES "Post"("postID") ON DELETE RESTRICT ON UPDATE CASCADE;
