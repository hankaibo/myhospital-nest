# 数据库

## 目录 <!-- omit in toc -->

- [关于数据库](#about-databases)
- [使用数据库模式 (TypeORM)](#working-with-database-schema-typeorm)
  - [生成迁移](#generate-migration)
  - [运行迁移](#run-migration)
  - [撤销迁移](#revert-migration)
  - [删除数据库中的所有表](#drop-all-tables-in-database)
- [使用数据库模式 (Mongoose)](#working-with-database-schema-mongoose)
  - [创建模式](#create-schema)
- [数据填充 (TypeORM)](#seeding-typeorm)
  - [创建 Seeds (TypeORM)](#creating-seeds-typeorm)
  - [运行 Seed (TypeORM)](#run-seed-typeorm)
  - [工厂和 Faker (TypeORM)](#factory-and-faker-typeorm)
- [数据填充 (Mongoose)](#seeding-mongoose)
  - [创建 Seeds (Mongoose)](#creating-seeds-mongoose)
  - [运行 Seed (Mongoose)](#run-seed-mongoose)
- [性能优化 (PostgreSQL + TypeORM)](#performance-optimization-postgresql--typeorm)
  - [索引和外键](#indexes-and-foreign-keys)
  - [最大连接数](#max-connections)
- [性能优化 (MongoDB + Mongoose)](#performance-optimization-mongodb--mongoose)
  - [设计模式](#design-schema)
- [将 PostgreSQL 切换为 MySQL](#switch-postgresql-to-mysql)

---

## 关于数据库

样板代码支持两种类型的数据库：PostgreSQL (TypeORM) 和 MongoDB (Mongoose)。您可以选择其中一种，也可以在项目中同时使用两者。数据库的选择取决于您的项目需求。

为了支持同时使用这两种数据库，我们使用了 [六边形架构](architecture.md#hexagonal-architecture)。

## 使用数据库模式 (TypeORM)

### 生成迁移

1. 创建扩展名为 `.entity.ts` 的实体文件。例如 `post.entity.ts`：

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   import { EntityRelationalHelper } from '@shared/relational-entity-helper';

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     body: string;

     // 在这里添加您需要的任何字段
   }
   ```

1. 接下来，生成迁移文件：

   ```bash
   npm run migration:generate -- src/core/database/migrations/CreatePostTable
   ```

1. 通过 [npm run migration:run](#run-migration) 将此迁移应用到数据库。

### 运行迁移

```bash
npm run migration:run
```

### 撤销迁移

```bash
npm run migration:revert
```

### 删除数据库中的所有表

```bash
npm run schema:drop
```

---

## 使用数据库模式 (Mongoose)

### 创建模式

1. 创建扩展名为 `.schema.ts` 的实体文件。例如 `post.schema.ts`：

   ```ts
   // /src/posts/infrastructure/persistence/document/entities/post.schema.ts

   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import { HydratedDocument } from 'mongoose';

   export type PostSchemaDocument = HydratedDocument<PostSchemaClass>;

   @Schema({
     timestamps: true,
     toJSON: {
       virtuals: true,
       getters: true,
     },
   })
   export class PostSchemaClass extends EntityDocumentHelper {
     @Prop()
     title: string;

     @Prop()
     body: string;

     // 在这里添加您需要的任何字段
   }

   export const PostSchema = SchemaFactory.createForClass(PostSchemaClass);
   ```

---

## 数据填充 (TypeORM)

### 创建 Seeds (TypeORM)

1. 使用 `npm run seed:create:relational -- --name Post` 创建 seed 文件。其中 `Post` 是实体名称。
1. 转到 `src/core/database/seeds/relational/post/post-seed.service.ts`。
1. 在 `run` 方法中扩展您的逻辑。
1. 运行 [npm run seed:run:relational](#run-seed-typeorm)

### 运行 Seed (TypeORM)

```bash
npm run seed:run:relational
```

### 工厂和 Faker (TypeORM)

1. 安装 faker：

    ```bash
    npm i --save-dev @faker-js/faker
    ```

1. 创建 `src/core/database/seeds/relational/user/user.factory.ts`：

    ```ts
    import { faker } from '@faker-js/faker';
    import { RoleEnum } from '@modules/roles/roles.enum';
    import { StatusEnum } from '../../../../statuses/statuses.enum';
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { RoleEntity } from '@modules/roles/infrastructure/persistence/relational/entities/role.entity';
    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Injectable()
    export class UserFactory {
      constructor(
        @InjectRepository(UserEntity)
        private repositoryUser: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private repositoryRole: Repository<RoleEntity>,
        @InjectRepository(StatusEntity)
        private repositoryStatus: Repository<StatusEntity>,
      ) {}

      createRandomUser() {
        // 需要用于保存 "this" 上下文
        return () => {
          return this.repositoryUser.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: this.repositoryRole.create({
              id: RoleEnum.user,
              name: 'User',
            }),
            status: this.repositoryStatus.create({
              id: StatusEnum.active,
              name: 'Active',
            }),
          });
        };
      }
    }
    ```

1. 在 `src/core/database/seeds/relational/user/user-seed.service.ts` 中进行更改：

    ```ts
    // 一些代码...
    import { UserFactory } from './user.factory';
    import { faker } from '@faker-js/faker';

    @Injectable()
    export class UserSeedService {
      constructor(
        // 一些代码...
        private userFactory: UserFactory,
      ) {}

      async run() {
        // 一些代码...

        await this.repository.save(
          faker.helpers.multiple(this.userFactory.createRandomUser(), {
            count: 5,
          }),
        );
      }
    }
    ```

1. 在 `src/core/database/seeds/relational/user/user-seed.module.ts` 中进行更改：

    ```ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    
    import { UserSeedService } from './user-seed.service';
    import { UserFactory } from './user.factory';

    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { RoleEntity } from '@modules/roles/infrastructure/persistence/relational/entities/role.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([UserEntity, Role, Status])],
      providers: [UserSeedService, UserFactory],
      exports: [UserSeedService, UserFactory],
    })
    export class UserSeedModule {}

    ```

1. 运行 seed：

    ```bash
    npm run seed:run
    ```

---

## 数据填充 (Mongoose)

### 创建 Seeds (Mongoose)

1. 使用 `npm run seed:create:document -- --name Post` 创建 seed 文件。其中 `Post` 是实体名称。
1. 转到 `src/core/database/seeds/document/post/post-seed.service.ts`。
1. 在 `run` 方法中扩展您的逻辑。
1. 运行 [npm run seed:run:document](#run-seed-mongoose)

### 运行 Seed (Mongoose)

```bash
npm run seed:run:document
```

---

## 性能优化 (PostgreSQL + TypeORM)

### 索引和外键

不要忘记在外键 (FK) 列上创建 `indexes` (索引)（如果需要），因为默认情况下 PostgreSQL [不会自动向 FK 添加索引](https://stackoverflow.com/a/970605/18140714)。

### 最大连接数

在 `/.env` 中为您的应用程序设置数据库的最佳 [最大连接数](https://node-postgres.com/apis/pool)：

```txt
DATABASE_MAX_CONNECTIONS=100
```

您可以将此参数视为您的应用程序可以处理多少个并发数据库连接。

## 性能优化 (MongoDB + Mongoose)

### 设计模式

为 MongoDB 设计模式与为关系型数据库设计模式完全不同。为了获得最佳性能，您应该根据以下内容设计您的模式：

1. [MongoDB 模式设计反模式](https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-massive-arrays)
1. [MongoDB 模式设计最佳实践](https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/)

## 将 PostgreSQL 切换为 MySQL

如果您想使用 `MySQL` 而不是 `PostgreSQL`，您可以在按照 [此处](installing-and-running.md) 给出的完整指南进行操作后进行更改。

完成所有步骤后，您应该有一个正在运行的应用程序。
![image](https://github.com/user-attachments/assets/ec60b61a-65e6-43e2-9bcf-72dad4c8a9fa)

如果您已经做到了这一步，只需要做一些更改即可从 `PostgreSQL` 切换到 `MySQL`。

**将 `.env` 文件更改为以下内容：**

```env
DATABASE_TYPE=mysql
# 如果您在本地机器上运行应用程序，请设置为 "localhost"
# 如果您在 docker 上运行应用程序，请设置为 "mysql"
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
DATABASE_NAME=app
```

**将 `docker-compose.yml` 更改为以下内容：**

```yml
services:
  mysql:
    image: mysql:9.2.0
    ports:
      - ${DATABASE_PORT}:3306
    volumes:
      - mysql-boilerplate-db:/var/lib/mysql
    environment:
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}

  # 其他服务...

volumes:
  # 其他卷...
  mysql-boilerplate-db:
```

完成上述设置后，使用以下命令运行 Docker：

```bash
docker compose up -d mysql adminer maildev
```

所有三个服务都应该如下所示运行：

![image](https://github.com/user-attachments/assets/73e10325-66ed-46ca-a0c5-45791ef0750f)

一旦您的服务启动并运行，您就快完成一半了。

现在安装 MySQL 客户端：

```bash
npm i mysql2 --save
```

**删除现有的迁移文件，并使用以下脚本生成一个新的迁移文件：**

```bash
npm run migration:generate -- src/core/database/migrations/newMigration --pretty=true
```

运行迁移：

```bash
npm run migration:run
```

运行 seeds：

```bash
npm run seed:run:relational
```

以开发模式运行应用程序：

```bash
npm run start:dev
```

打开 <http://localhost:3000>

要设置 Adminer：

在浏览器中打开运行端口。
打开 <http://localhost:8080>

![image](https://github.com/user-attachments/assets/f4b86daa-d93f-4ae9-a9e3-3c29bb3bba9d)

运行中的应用程序：
![image](https://github.com/user-attachments/assets/5dc0609d-5f6d-4176-918d-1744906f4f88)
![image](https://github.com/user-attachments/assets/ff2201a6-d834-4c8b-9ab7-b9413a0a95c1)

---

上一页: [命令行工具 (CLI)](cli.md)

下一页: [认证](auth.md)
