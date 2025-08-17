import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { BlogCategory } from './blog_categorie';

@Entity()
export class BlogArticle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  author_ar: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column('text', { array: true, nullable: true })
  tags_ar: string[];

  @Column({ nullable: true, unique: true })
  seo_title: string;

  @Column({ nullable: true, unique: true })
  seo_title_ar: string;

  @Column({ nullable: true })
  seo_keywords: string;

  @Column({ nullable: true })
  seo_keywords_ar: string;

  @Column({ nullable: true, unique: true })
  url_slug: string;

  @Column({ nullable: true, unique: true })
  url_slug_ar: string;

  @Column({ nullable: true, unique: true })
  seo_description: string;

  @Column({ nullable: true, unique: true })
  seo_description_ar: string;

  @Column({ nullable: true, unique: true })
  thumbnail_alt: string;

  @Column({ nullable: true, unique: true })
  thumbnail_alt_ar: string;

  @Column({ nullable: true })
  thumbnail_image: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  title_ar: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ nullable: true })
  subtitle_ar: string;

  @Column('json', { nullable: true, array: false })
  body: any; // Assuming body will be a complex JSON structure

  @Column('json', { nullable: true, array: false })
  body_ar: any; // Assuming body will be a complex JSON structure

  @Column('text', { array: true, nullable: true })
  body_images: string[];

  @Column('text', { array: true, nullable: true })
  body_images_ar: string[];

  @Column({ nullable: false })
  draft: boolean;

  @ManyToOne(() => BlogCategory, (category) => category.articles, {
    onDelete: 'SET NULL',
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category_id: BlogCategory;

  @ManyToOne(() => BlogCategory, (category_ar) => category_ar.articles, {
    onDelete: 'SET NULL',
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'category_id_ar' })
  category_id_ar: BlogCategory;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'blog_article');
  }
}
