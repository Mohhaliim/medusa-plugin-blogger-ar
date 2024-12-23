import type {
    MedusaRequest,
    MedusaResponse
} from "@medusajs/medusa";
import { BlogArticle } from "../../../../../models/blog_article";
import { EntityManager } from "typeorm";
import { SqlSanitization } from "../../../../../admin/utils/sql_sanitization";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        let anyreq = req as any; // Needed to not receive type errors
        const id = anyreq.params.id;

        let article = await articleRepo.findOne({
            where:{
                id: SqlSanitization(id).includes("blog_article_") ? SqlSanitization(id) : "blog_article_" + SqlSanitization(id)
            },
            relations: ["category_id", 'category_id_ar']
        });

        return res.json({
            success: true,
            article: article
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        let anyreq = req as any; // Needed to not receive type errors
        const id = anyreq.params.id;
        let article = await articleRepo.findOneBy({
            id: SqlSanitization(id).includes("blog_article_") ? SqlSanitization(id) : "blog_article_" + SqlSanitization(id)
        });

        if (!article) {
            return res.json({success: false, error: "The ID does not match any article"})
        }

        if (anyreq.body.change_draft_status) {
            await articleRepo.save({ ...article, draft: anyreq.body.draft })
            return res.json({
                success: true,
                article: { ...article, draft: anyreq.body.draft }
            })
        }

        // Keep only the existing id
        let updated_article = {id: article.id, ...anyreq.body};

        // The values that were inside the article before but not in the anyreq.body object should not be kept
        for (let key of Object.keys(article)) {
            if (!Object.keys(updated_article).includes(key) && key != "created_at" && key != "updated_at") {
                updated_article[key] = null;
            }
        }


        await articleRepo.save(updated_article);
        return res.json({
            success: true,
            article: updated_article
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        let anyreq = req as any; // Needed to not receive type errors
        const id = anyreq.params.id;
        let article = await articleRepo.delete({
            id: SqlSanitization(id).includes("blog_article_") ? SqlSanitization(id) : "blog_article_" + SqlSanitization(id)
        });

        return res.json({
            success: true,
            article: article
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}