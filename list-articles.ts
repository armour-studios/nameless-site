import { prisma } from "./lib/prisma";

async function listArticles() {
    console.log("--- Listing all articles ---");
    const articles = await prisma.newsArticle.findMany();
    console.log(JSON.stringify(articles, null, 2));
}

listArticles().catch(console.error);
