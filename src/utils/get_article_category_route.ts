import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { BlogCategory } from "../models/blog_categorie";
import { EntityManager } from "typeorm";
import { parseQueryString } from "./parse_query_params";
import { separateBlogsScript } from "./utils";

export const getArticleCategoriesRoute = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  let search_params: any;
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const categoryRepo = manager.getRepository(BlogCategory);
    const search_query_obj = parseQueryString(req.validatedQuery) as any;
    search_params = {};

    const { select, skip, take, locale } = search_query_obj;
    if (select) search_params["select"] = select;
    if (typeof skip !== "undefined") search_params.skip = skip;
    if (typeof take !== "undefined") search_params.take = take;

    if (typeof locale === "undefined") {
      return res.json({
        categories: await categoryRepo.find(search_params),
        sanitized_query: search_params,
        count: await categoryRepo.count(),
      });
    }

    const categories = await categoryRepo.find(search_params);
    const { englishCategories, arabicCategories } =
      separateBlogsScript(categories);

    return res.json({
      categories: locale === "en" ? englishCategories : arabicCategories,
      sanitized_query: search_params,
      count: await categoryRepo.count(),
    });
  } catch (e) {
    return res.json({
      error: e.toString(),
      error_obj: e,
      search_params: search_params,
    });
  }
};
