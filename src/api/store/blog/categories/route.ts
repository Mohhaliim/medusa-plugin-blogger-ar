import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { getArticleCategoriesRoute } from "../../../../utils/get_article_category_route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  return getArticleCategoriesRoute(req, res);
};
