# 架构

---

## 目录 <!-- omit in toc -->

- [六边形架构](#六边形架构)
- [动机](#动机)
- [模块结构描述](#模块结构描述)
- [建议](#建议)
  - [仓库 (Repository)](#仓库-repository)
- [常见问题](#常见问题)
  - [有没有办法使用六边形架构生成新资源（控制器、服务、DTO 等）？](#有没有办法使用六边形架构生成新资源控制器服务dto-等)
- [链接](#链接)

---

## 六边形架构

NestJS 样板代码基于 [六边形架构](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))。这种架构也被称为端口和适配器。

![Hexagonal Architecture Diagram](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## 动机

使用六边形架构的主要原因是将业务逻辑与基础设施分离。这种分离使我们可以轻松更改数据库、文件上传方式或任何其他基础设施，而无需更改业务逻辑。

## 模块结构描述

```txt
.
├── domain
│   └── [DOMAIN_ENTITY].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── document
│       │   ├── document-persistence.module.ts
│       │   ├── entities
│       │   │   └── [SCHEMA].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       ├── relational
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

`[DOMAIN ENTITY].ts` 表示业务逻辑中使用的实体。领域实体不依赖于数据库或任何其他基础设施。

`[SCHEMA].ts` 表示 **数据库结构**。它用于面向文档的数据库 (MongoDB)。

`[ENTITY].ts` 表示 **数据库结构**。它用于关系型数据库 (PostgreSQL)。

`[MAPPER].ts` 是将 **数据库实体** 转换为 **领域实体** 的映射器，反之亦然。

`[PORT].repository.ts` 是一个仓库 **端口**，定义了与数据库交互的方法。

`[ADAPTER].repository.ts` 是实现 `[PORT].repository.ts` 的仓库。它用于与数据库交互。

`infrastructure` 文件夹 - 包含所有与基础设施相关的组件，如 `persistence` (持久化), `uploader` (上传器), `senders` (发送器) 等。

每个组件都有 `port` (端口) 和 `adapters` (适配器)。`Port` 是定义与基础设施交互方法的接口。`Adapters` 是 `port` 的实现。

## 建议

### 仓库 (Repository)

不要尝试在仓库中创建通用方法，因为它们在项目的生命周期中难以扩展。相反，应该创建具有单一职责的方法。

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }
  
  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }
  
  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

---

## 常见问题

### 有没有办法使用六边形架构生成新资源（控制器、服务、DTO 等）？

是的，您可以使用 [CLI](cli.md) 生成具有六边形架构的新资源。

---

## 链接

- [依赖倒置原则](https://trilon.io/blog/dependency-inversion-principle) 与 NestJS。

---

上一页: [安装与运行](installing-and-running.md)

下一页: [命令行工具 (CLI)](cli.md)
