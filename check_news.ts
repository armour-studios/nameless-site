
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.newsArticle.findMany();
    console.log("Total Articles:", articles.length);
    console.log(JSON.stringify(articles, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
