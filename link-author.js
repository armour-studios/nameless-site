const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the Jonzey user
    const user = await prisma.user.findFirst({
        where: { username: 'Jonzey' }
    });

    if (!user) {
        console.log('User Jonzey not found!');
        return;
    }

    console.log('Found user:', { id: user.id, username: user.username, image: user.image });

    // Update the article to link to this user
    const updated = await prisma.newsArticle.update({
        where: { slug: 'armour-studios-the-esports-gaming-marketplace-built-for-the-industry' },
        data: { authorId: user.id }
    });

    console.log('Updated article authorId:', updated.authorId);
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); });
