import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { EntityManager, FindManyOptions, Like} from 'typeorm';

import { BlogArticle } from '../../models/blog_article';
import { SqlSanitizationObj } from '../../admin/utils/sql_sanitization';
import { parseQueryString } from '../../admin/utils/parse_query_params';

export const getStoreArticlesRoute = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    try {
      const manager: EntityManager = req.scope.resolve('manager');
      const articleRepo = manager.getRepository(BlogArticle);

      const search_query_obj = parseQueryString(req.validatedQuery) as any;
      let search = search_query_obj.search;

      const locale = search_query_obj.locale;
      const selectedParams: (keyof BlogArticle)[] =
        locale === 'en'
          ? ['id', 'thumbnail_image', 'thumbnail_alt', 'tags', 'url_slug', 'title', 'created_at']
          : [
              'id',
              'thumbnail_image',
              'thumbnail_alt_ar',
              'tags_ar',
              'url_slug_ar',
              'title_ar',
              'created_at',
            ];

      const { order, skip, take } = search_query_obj;

      let localeSpecificFilters: any = [{ draft: false }];

      if (search) {
        localeSpecificFilters = [
          ...(locale === 'en'
            ? [
                { title: Like(`%${search}%`), draft: false },
                { seo_title: Like(`%${search}%`), draft: false },
                { seo_keywords: Like(`%${search}%`), draft: false },
              ]
            : [
                { title_ar: Like(`%${search}%`), draft: false },
                { seo_title_ar: Like(`%${search}%`), draft: false },
                { seo_keywords_ar: Like(`%${search}%`), draft: false },
              ]
          )
        ];
      }
console.log(search)
console.log(localeSpecificFilters)
      // Count total available articles for the specific locale
      const totalArticles = await articleRepo.count({
        where: localeSpecificFilters
      });

      const findOptions: FindManyOptions<BlogArticle> = {
        where: localeSpecificFilters,
        select: selectedParams,
        order,
        skip,
        take
      };

      const articles = await articleRepo.find(findOptions);
      console.log(articles)
      const normalizedArticles = normalizeArticles(articles, locale);

      return res.json({
        articles: normalizedArticles,
        hasMore: (skip || 0) + (take || articles.length) < totalArticles
      });
    } catch (e) {
      return res.json({
        error: e.toString(),
        error_obj: e,
      });
    }
  };

function normalizeArticles(articles: any[], locale) {
  return articles.map((article) => {
    const normalizedArticle: any = {
        id: article.id,
        thumbnail_image: article.thumbnail_image,
        created_at: transformDate(article.created_at, locale),
        tags: locale === 'en' ? article.tags : article.tags_ar,
        thumbnail_alt: locale === 'en' ? article.thumbnail_alt : article.thumbnail_alt_ar,
        url_slug: locale === 'en' ? article.url_slug : article.url_slug_ar,
        title: locale === 'en' ? article.title : article.title_ar
    };

    return normalizedArticle;
  });
}

function transformDate(dateString, locale = 'en') {
    const date = new Date(dateString);

    const day = date.getDate();
    const year = date.getFullYear();

    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    const months = locale === 'ar' ? monthsAr : monthsEn;

    const monthIndex = date.getMonth();
    const month = months[monthIndex];

    return locale === 'ar'
      ? `${day} ${month} ${year}`
      : `${day} ${month} ${year}`;
}