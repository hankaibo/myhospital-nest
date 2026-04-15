# 命令行工具 (CLI)

---

## 目录 <!-- omit in toc -->

- [生成资源](#生成资源)
  - [适用于文档型数据库 (MongoDB + Mongoose)](#适用于文档型数据库-mongodb--mongoose)
  - [适用于关系型数据库 (PostgreSQL + TypeORM)](#适用于关系型数据库-postgresql--typeorm)
    - [关系型数据库视频指南 (PostgreSQL + TypeORM)](#关系型数据库视频指南-postgresql--typeorm)
  - [适用于两种数据库](#适用于两种数据库)
- [向资源添加属性](#向资源添加属性)
  - [适用于文档型数据库的属性 (MongoDB + Mongoose)](#适用于文档型数据库的属性-mongodb--mongoose)
  - [适用于关系型数据库的属性 (PostgreSQL + TypeORM)](#适用于关系型数据库的属性-postgresql--typeorm)
    - [如何为关系型数据库添加属性的视频指南 (PostgreSQL + TypeORM)](#如何为关系型数据库添加属性的视频指南-postgresql--typeorm)
  - [适用于两种数据库的属性](#适用于两种数据库的属性)

---

## 生成资源

使用以下命令生成资源：

### 适用于文档型数据库 (MongoDB + Mongoose)
  
```bash
npm run generate:resource:document -- --name ResourceName
```

示例：

```bash
npm run generate:resource:document -- --name Category
```

### 适用于关系型数据库 (PostgreSQL + TypeORM)

```bash
npm run generate:resource:relational -- --name ResourceName
```

示例：

```bash
npm run generate:resource:relational -- --name Category
```

#### 关系型数据库视频指南 (PostgreSQL + TypeORM)

<https://github.com/user-attachments/assets/f7f91a7d-f9ff-4653-a78a-152ac5e7a95d>

### 适用于两种数据库

```bash
npm run generate:resource:all-db -- --name ResourceName
```

示例：

```bash
npm run generate:resource:all-db -- --name Category
```

## 向资源添加属性

### 适用于文档型数据库的属性 (MongoDB + Mongoose)

```bash
npm run add:property:to-document
```

### 适用于关系型数据库的属性 (PostgreSQL + TypeORM)

```bash
npm run add:property:to-relational
```

#### 如何为关系型数据库添加属性的视频指南 (PostgreSQL + TypeORM)

<https://github.com/user-attachments/assets/95b9d70a-70cf-442a-b8bf-a73d32810e0c>

### 适用于两种数据库的属性

```bash
npm run add:property:to-all-db
```

---

上一篇：[架构](architecture.md)

下一篇：[数据库](database.md)
