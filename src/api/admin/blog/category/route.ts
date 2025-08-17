import type {
    MedusaRequest,
    MedusaResponse
} from "@medusajs/medusa"
import { BlogCategory } from "../../../../models/blog_categorie";
import { EntityManager } from "typeorm"
import { getArticleCategoriesRoute } from "../../../../admin/utils/get_article_category_route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    return getArticleCategoriesRoute(req, res);
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {

        const manager: EntityManager = req.scope.resolve("manager");
        const categoryRepo = manager.getRepository(BlogCategory);

        let anyreq = req as any; // Needed to not receive type errors
        let category = {...anyreq.body};

        const newCategory = categoryRepo.create(category)

        await categoryRepo.save(newCategory);

        return res.json({
            success: true,
            category: {...newCategory},
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}