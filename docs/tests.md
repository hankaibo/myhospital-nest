# 测试

## 目录 <!-- omit in toc -->

- [单元测试](#单元测试)
- [端到端 (E2E) 测试](#端到端-e2e-测试)
- [Docker 中的测试](#docker-中的测试)
  - [适用于关系型数据库](#适用于关系型数据库)
  - [适用于文档型数据库](#适用于文档型数据库)

## 单元测试

```bash
npm run test
```

## 端到端 (E2E) 测试

```bash
npm run test:e2e
```

## Docker 中的测试

### 适用于关系型数据库

```bash
npm run test:e2e:relational:docker
```

### 适用于文档型数据库

```bash
npm run test:e2e:document:docker
```

---

上一篇：[文件上传](file-uploading.md)

下一篇：[基准测试](benchmarking.md)
