-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "handle" VARCHAR(255) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(500),
    "profile_pic_url" VARCHAR(255),
    "banner_pic_url" VARCHAR(255),
    "date_joined" DATE NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "source_url" VARCHAR(255) NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Notification_Type" (
    "notification_type_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Notification_Type_pkey" PRIMARY KEY ("notification_type_id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "follow_id" SERIAL NOT NULL,
    "followed_user_id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("follow_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "date_created" TIMESTAMP NOT NULL,
    "content" VARCHAR(500),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "Like" (
    "like_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "reply_id" SERIAL NOT NULL,
    "reply_post_id" INTEGER NOT NULL,
    "parent_post_id" INTEGER NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("reply_id")
);

-- CreateTable
CREATE TABLE "Repost" (
    "repost_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_post_id" INTEGER NOT NULL,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("repost_id")
);

-- CreateTable
CREATE TABLE "Quote_Repost" (
    "quote_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_post_id" INTEGER NOT NULL,
    "quote_post_id" INTEGER NOT NULL,

    CONSTRAINT "Quote_Repost_pkey" PRIMARY KEY ("quote_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followed_user_id_follower_id_key" ON "Follow"("followed_user_id", "follower_id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_post_id_user_id_key" ON "Like"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_reply_post_id_parent_post_id_key" ON "Reply"("reply_post_id", "parent_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Repost_user_id_parent_post_id_key" ON "Repost"("user_id", "parent_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_Repost_user_id_parent_post_id_quote_post_id_key" ON "Quote_Repost"("user_id", "parent_post_id", "quote_post_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Notification_Type"("notification_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followed_user_id_fkey" FOREIGN KEY ("followed_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_reply_post_id_fkey" FOREIGN KEY ("reply_post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote_Repost" ADD CONSTRAINT "Quote_Repost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote_Repost" ADD CONSTRAINT "Quote_Repost_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote_Repost" ADD CONSTRAINT "Quote_Repost_quote_post_id_fkey" FOREIGN KEY ("quote_post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;
