// Export models
export { BlogArticle } from "./models/blog_article";
export { BlogCategory } from "./models/blog_categorie";

// Export migrations
export { BlogCategoryCreate1731950410317 } from "./migrations/1731950410317-BlogCategoryCreate";
export { BlogArticleCreate1731950848362 } from "./migrations/1731950848362-BlogArticleCreate";

// Plugin configuration
export default {
  // Plugin metadata
  name: "medusa-plugin-blogger-ar",
  version: "0.1.1",

  // Define the plugin's entities
  entities: [
    require("./models/blog_article").BlogArticle,
    require("./models/blog_categorie").BlogCategory,
  ],

  // Define migrations
  migrations: [
    require("./migrations/1731950410317-BlogCategoryCreate")
      .BlogCategoryCreate1731950410317,
    require("./migrations/1731950848362-BlogArticleCreate")
      .BlogArticleCreate1731950848362,
  ],

  // Admin UI routes will be auto-discovered from src/admin
  // API routes will be auto-discovered from src/api
};
