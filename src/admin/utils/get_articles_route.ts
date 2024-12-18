import type {
    MedusaRequest,
    MedusaResponse
} from "@medusajs/medusa";
import { BlogArticle } from "../../models/blog_article";
import { EntityManager, Like } from "typeorm";
import { SqlSanitizationObj } from "../../admin/utils/sql_sanitization";
import { convertObjToSearchQuery } from "../../admin/utils/utils";
import { parseQueryString } from "../../admin/utils/parse_query_params";

export const getArticlesRoute = async (req: MedusaRequest, res: MedusaResponse) => {
    let search_params: any;
    try {
        const manager: EntityManager = req.scope.resolve("manager");
        const articleRepo = manager.getRepository(BlogArticle);

        search_params = {};

        const search_query_obj = parseQueryString(req.validatedQuery) as any;

        let filters = SqlSanitizationObj(search_query_obj.where);
        filters = convertObjToSearchQuery(filters);
        search_params["where"] = filters;
        const search = search_query_obj.search
        const { select, order, skip, take } = search_query_obj;
        if (select) search_params["select"] = select;
        if (order) search_params["order"] = order;
        if (typeof skip !== 'undefined') search_params.skip = skip;
        if (typeof take !== 'undefined') search_params.take = take;

        if(search) {
            const searchFilters = [
                {title: Like(`%${search}%`)},
                {seo_title: Like(`%${search}%`)},
                {seo_keywords: Like(`%${search}%`)},
                {title_ar: Like(`%${search}%`)},
                {seo_title_ar: Like(`%${search}%`)},
                {seo_keywords_ar: Like(`%${search}%`)}
            ]

            search_params["where"] = searchFilters
        }

        return res.json({
            articles: await articleRepo.find(search_params),
            sanitized_query: search_params
        })
    } catch (e) {
        return res.json({error: e.toString(), error_obj: e, search_params: search_params})
    }
}


/*
use the search and attach queries to to matches it to columns like title, seo_title in ar and en
also find a way to get the order by created at to work
*/