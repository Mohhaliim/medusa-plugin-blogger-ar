import {
    BeforeInsert,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
} from "typeorm"
import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { BlogArticle } from "./blog_article"

@Entity()
export class BlogCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @OneToMany(() => BlogArticle, (article) => article.category_id, { cascade: true })
    articles: BlogArticle[];

    @OneToMany(() => BlogArticle, (article) => article.category_id_ar, { cascade: true })
    articles_ar: BlogArticle[];

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "blog_category")
    }
}