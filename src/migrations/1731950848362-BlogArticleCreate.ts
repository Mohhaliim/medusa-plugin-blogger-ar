import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class BlogArticleCreate1731950848362 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the blog_article table
        await queryRunner.createTable(new Table({
            name: "blog_article",
            columns: [
                { name: "id", type: "varchar", isPrimary: true },
                { name: "author", type: "varchar", isNullable: true },
                { name: "author_ar", type: "varchar", isNullable: true },
                { name: "tags", type: "text[]", isNullable: true },
                { name: "tags_ar", type: "text[]", isNullable: true },
                { name: "seo_title", type: "varchar", isNullable: true, isUnique: true },
                { name: "seo_title_ar", type: "varchar", isNullable: true, isUnique: true },
                { name: "seo_keywords", type: "varchar", isNullable: true },
                { name: "seo_keywords_ar", type: "varchar", isNullable: true },
                { name: "url_slug", type: "varchar", isNullable: true, isUnique: true },
                { name: "url_slug_ar", type: "varchar", isNullable: true, isUnique: true },
                { name: "seo_description", type: "varchar", isNullable: true},
                { name: "seo_description_ar", type: "varchar", isNullable: true},
                { name: "thumbnail_alt", type: "varchar", isNullable: true },
                { name: "thumbnail_alt_ar", type: "varchar", isNullable: true},
                { name: "thumbnail_image", type: "varchar", isNullable: true },
                { name: "title", type: "varchar", isNullable: true },
                { name: "title_ar", type: "varchar", isNullable: true },
                { name: "subtitle", type: "varchar", isNullable: true },
                { name: "subtitle_ar", type: "varchar", isNullable: true },
                { name: "body", type: "jsonb", isNullable: true },
                { name: "body_ar", type: "jsonb", isNullable: true },
                { name: "body_images", type: "text[]", isNullable: true },
                { name: "body_images_ar", type: "text[]", isNullable: true },
                { name: "draft", type: "boolean" },
                { name: "category_id", type: "varchar", isNullable: true },
                { name: "category_id_ar", type: "varchar", isNullable: true },
                { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' },
                { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' }
            ]
        }));

        // Add foreign key to category_id
        await queryRunner.createForeignKey(
            "blog_article",
            new TableForeignKey({
                columnNames: ["category_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "blog_category",
                onDelete: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "blog_article",
            new TableForeignKey({
                columnNames: ["category_id_ar"],
                referencedColumnNames: ["id"],
                referencedTableName: "blog_category",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("blog_article");

        const foreignKeyDefault = table.foreignKeys.find(fk => fk.columnNames.indexOf("category_id") !== -1);
        if (foreignKeyDefault) {
            await queryRunner.dropForeignKey("blog_article", foreignKeyDefault);
        }

        const foreignKeyAr = table.foreignKeys.find(fk => fk.columnNames.indexOf("category_id_ar") !== -1);
        if (foreignKeyAr) {
            await queryRunner.dropForeignKey("blog_article", foreignKeyAr);
        }

        await queryRunner.dropTable("blog_article");
    }

}
