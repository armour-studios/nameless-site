import { prisma } from "./lib/prisma";

async function deleteTestArticles() {
    console.log("Searching for 'test' articles...");
    const articles = await prisma.newsArticle.findMany({
        where: { title: "test" }
    });

    if (articles.length === 0) {
        console.log("No 'test' articles found.");
        return;
    }

    for (const article of articles) {
        console.log(`Deleting article: ${article.id} (${article.title})`);
        await prisma.newsArticle.delete({
            where: { id: article.id }
        });
    }
    console.log("Done.");
}

deleteTestArticles().catch(console.error);
