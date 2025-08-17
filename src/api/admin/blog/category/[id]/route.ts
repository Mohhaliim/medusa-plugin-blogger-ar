import type {
    MedusaRequest,
    MedusaResponse
} from "@medusajs/medusa";
import { BlogCategory } from "../../../../../models/blog_categorie";
import { EntityManager } from "typeorm";
import { SqlSanitization } from "../../../../../admin/utils/sql_sanitization";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const categoryRepo = manager.getRepository(BlogCategory);

        let anyreq = req as any;
        const id = anyreq.params.id;

        let category = await categoryRepo.delete({
            id: SqlSanitization(id).includes("blog_category_") ? SqlSanitization(id) : "blog_category_" + SqlSanitization(id)
        });

        return res.json({
            success: true,
            category: category
        })
    } catch (e) {
        return res.json({success: false, error: e.toString(), error_obj: e})
    }
}