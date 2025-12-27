const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const article = await prisma.newsArticle.findFirst({
        where: { slug: 'armour-studios-the-esports-gaming-marketplace-built-for-the-industry' },
        select: { content: true }
    });

    console.log('Full content:');
    console.log(article?.content);
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); });
