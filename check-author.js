const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Get the article
    const article = await prisma.newsArticle.findFirst({
        where: { slug: 'armour-studios-the-esports-gaming-marketplace-built-for-the-industry' },
        include: { authorUser: true }
    });

    console.log('Article:', {
        id: article?.id,
        author: article?.author,
        authorId: article?.authorId,
        authorUserName: article?.authorUser?.name,
        authorUserImage: article?.authorUser?.image
    });

    // Get all users
    const users = await prisma.user.findMany({
        select: { id: true, username: true, name: true, image: true }
    });
    console.log('Users:', users);
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); });
