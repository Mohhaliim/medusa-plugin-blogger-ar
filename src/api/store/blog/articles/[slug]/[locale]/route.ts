import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { BlogArticle } from "../../../../../../models/blog_article";
import { EntityManager, FindOptionsSelect } from "typeorm";
import { SqlSanitization } from "../../../../../../utils/sql_sanitization";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager: EntityManager = req.scope.resolve("manager");
    const articleRepo = manager.getRepository(BlogArticle);

    let anyreq = req as any; // Needed to not receive type errors
    const { slug, locale } = anyreq.params;

    const sanitizedLocale = SqlSanitization(locale || "en");
    const sanitizedSlug = SqlSanitization(slug || "");
    const select = [
      "id",
      "author",
      "tags",
      "seo_title",
      "seo_keywords",
      "url_slug",
      "seo_description",
      "thumbnail_image",
      "thumbnail_alt",
      "title",
      "subtitle",
      "body",
      "body_images",
      "created_at",
    ];
    const selectAr = [
      "id",
      "author_ar",
      "tags_ar",
      "seo_title_ar",
      "seo_keywords_ar",
      "url_slug_ar",
      "seo_description_ar",
      "thumbnail_image",
      "thumbnail_alt_ar",
      "title_ar",
      "subtitle_ar",
      "body_ar",
      "body_images_ar",
      "created_at",
    ];
    const selected = sanitizedLocale === "en" ? select : selectAr;

    let article = await articleRepo.findOne({
      select: selected as FindOptionsSelect<BlogArticle>,
      where: [
        {
          id: sanitizedSlug.includes("blog_article_")
            ? sanitizedSlug
            : `blog_article_${sanitizedSlug}`,
        },
        { url_slug: sanitizedSlug },
        { url_slug_ar: sanitizedSlug },
      ],
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const normalizedArticle = {
      id: article.id,
      thumbnail_image: article.thumbnail_image,
      author: article.author || article.author_ar,
      tags: article.tags || article.tags_ar,
      seo_title: article.seo_title || article.seo_title_ar,
      url_slug: article.url_slug || article.url_slug_ar,
      seo_keywords: article.seo_keywords || article.seo_keywords_ar,
      seo_description: article.seo_description || article.seo_description_ar,
      title: article.title || article.title_ar,
      subtitle: article.subtitle || article.subtitle_ar,
      body: article.body || article.body_ar,
      body_images: article.body_images || article.body_images_ar,
      created_at: transformDate(article.created_at, locale),
    };

    return res.json({
      success: true,
      article: normalizedArticle,
    });
  } catch (e) {
    return res.json({ success: false, error: e.toString(), error_obj: e });
  }
};

function transformDate(dateString, locale = "en") {
  const date = new Date(dateString);

  const day = date.getDate();
  const year = date.getFullYear();

  const monthsEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const months = locale === "ar" ? monthsAr : monthsEn;

  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  return locale === "ar"
    ? `${day} ${month} ${year}`
    : `${day} ${month} ${year}`;
}
