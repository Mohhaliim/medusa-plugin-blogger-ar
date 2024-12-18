import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BlogCategoryCreate1731950410317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blog_category',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'name', type: 'varchar', isNullable: false },
          {
            name: 'created_at',
            type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()',
          },
          {
            name: 'updated_at',
            type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()',
          },
        ],
        indices: [
          {
            name: 'idx_blog_category_name_unique',
            columnNames: ['name'],
            isUnique: true
          }
        ]
      }),

    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blog_category');
  }
}
