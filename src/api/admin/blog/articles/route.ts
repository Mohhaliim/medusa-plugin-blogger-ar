import type {
    MedusaRequest,
    MedusaResponse
} from "@medusajs/medusa"
import { BlogArticle } from "../../../../models/blog_article"
import { EntityManager } from "typeorm"
import { getArticlesRoute } from "../../../../admin/utils/get_articles_route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    return getArticlesRoute(req, res);
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {

        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        let anyreq = req as any; // Needed to not receive type errors
        let article = {...anyreq.body};

        const newArticle = articleRepo.create(article)

        await articleRepo.save(newArticle);

        return res.json({
            success: true,
            article: {...newArticle},
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}