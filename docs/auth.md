# 认证

---

## 目录 <!-- omit in toc -->

- [通用信息](#通用信息)
  - [通过电子邮件认证流程](#通过电子邮件认证流程)
  - [通过外部服务或社交网络认证流程](#通过外部服务或社交网络认证流程)
- [配置认证](#配置认证)
- [通过 Apple 认证](#通过-apple-认证)
- [通过 Facebook 认证](#通过-facebook-认证)
- [通过 Google 认证](#通过-google-认证)
- [关于 JWT 策略](#关于-jwt-策略)
- [刷新令牌流程](#刷新令牌流程)
  - [视频示例](#视频示例)
  - [支持多设备登录/会话](#支持多设备登录会话)
- [登出](#登出)
- [问答](#问答)
  - [在 `POST /api/v1/auth/logout` 或从数据库中删除会话后，用户在一段时间内仍可以使用 `access token` 进行请求。为什么？](#在-post-apiv1authlogout-或从数据库中删除会话后用户在一段时间内仍可以使用-access-token-进行请求为什么)

---

## 通用信息

### 通过电子邮件认证流程

默认情况下，样板代码使用电子邮件和密码进行注册和登录。

```mermaid
sequenceDiagram
    participant A as 前端应用 (Web, Mobile, Desktop)
    participant B as 后端应用

    A->>B: 1. 通过电子邮件和密码注册
    A->>B: 2. 通过电子邮件和密码登录
    B->>A: 3. 获取 JWT 令牌
    A->>B: 4. 使用 JWT 令牌进行任何请求
```

<https://user-images.githubusercontent.com/6001723/224566194-1c1f4e98-5691-4703-b30e-92f99ec5d929.mp4>

### 通过外部服务或社交网络认证流程

您还可以通过其他外部服务或社交网络（如 Apple、Facebook 和 Google）进行注册。

```mermaid
sequenceDiagram
    participant B as 外部认证服务 (Apple, Google, etc)
    participant A as 前端应用 (Web, Mobile, Desktop)
    participant C as 后端应用

    A->>B: 1. 通过外部服务登录
    B->>A: 2. 获取访问令牌 (Access Token)
    A->>C: 3. 发送访问令牌到认证端点
    C->>A: 4. 获取 JWT 令牌
    A->>C: 5. 使用 JWT 令牌进行任何请求
```

对于使用外部服务或社交网络进行认证，您需要：

1. 通过外部服务登录并获取访问令牌。
1. 使用第 1 步在前端应用中收到的访问令牌调用其中一个端点，并从后端应用获取 JWT 令牌。

   ```text
   POST /api/v1/auth/facebook/login

   POST /api/v1/auth/google/login

   POST /api/v1/auth/apple/login
   ```

1. 使用 JWT 令牌进行任何请求

---

## 配置认证

1. 为 `access token` 和 `refresh token` 生成密钥：

   ```bash
   node -e "console.log('\nAUTH_JWT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_REFRESH_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_FORGOT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_CONFIRM_EMAIL_SECRET=' + require('crypto').randomBytes(256).toString('base64'));"
   ```

1. 转到 `/.env` 并用第 1 步的输出替换 `AUTH_JWT_SECRET` 和 `AUTH_REFRESH_SECRET`。

   ```text
   AUTH_JWT_SECRET=这里填第1步生成的密钥
   AUTH_REFRESH_SECRET=这里填第1步生成的密钥
   ```

## 通过 Apple 认证

1. [在 Apple 上设置您的服务](https://www.npmjs.com/package/apple-signin-auth)
1. 在 `.env` 中更改 `APPLE_APP_AUDIENCE`

   ```text
   APPLE_APP_AUDIENCE=["com.company", "com.company.web"]
   ```

## 通过 Facebook 认证

1. 前往 https://developers.facebook.com/apps/creation/ 并创建一个新应用
   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/05721db2-9d26-466a-ad7a-072680d0d49b">

   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/9f4aae18-61da-4abc-9304-821a0995a306">
2. 转到 `Settings` -> `Basic` 并获取应用的 `App ID` 和 `App Secret`
   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/b0fc7d50-4bc6-45d0-8b20-fda0b6c01ac2">
3. 在 `.env` 中更改 `FACEBOOK_APP_ID` 和 `FACEBOOK_APP_SECRET`

   ```text
   FACEBOOK_APP_ID=123
   FACEBOOK_APP_SECRET=abc
   ```

## 通过 Google 认证

1. 您需要 `CLIENT_ID` 和 `CLIENT_SECRET`。您可以前往 [开发者控制台](https://console.cloud.google.com/)，点击您的项目（如果没有，请在这里创建 https://console.cloud.google.com/projectcreate） -> `APIs & services` -> `credentials` 找到这些信息。
1. 在 `.env` 中更改 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`

   ```text
   GOOGLE_CLIENT_ID=abc
   GOOGLE_CLIENT_SECRET=abc
   ```

## 关于 JWT 策略

在 `src/auth/strategies/jwt.strategy.ts` 文件的 `validate` 方法中，您可以看到我们没有检查用户是否存在于数据库中，因为这是多余的，可能会失去 JWT 方法的优势并影响应用程序性能。

为了更好地理解 JWT 的工作原理，请观看视频解释 https://www.youtube.com/watch?v=Y2H3DXDeS3Q 并阅读这篇文章 https://jwt.io/introduction/

```typescript
// src/auth/strategies/jwt.strategy.ts

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ...

  public validate(payload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
```

> 如果您需要获取完整的用户信息，请在服务 (services) 中获取。

## 刷新令牌流程

1. 登录时 (`POST /api/v1/auth/email/login`)，您将在响应中收到 `token`、`tokenExpires` 和 `refreshToken`。
1. 在每个常规请求中，您需要在 `Authorization` 头中发送 `token`。
1. 如果 `token` 过期（在客户端应用中检查 `tokenExpires` 属性），您需要在 `Authorization` 头中发送 `refreshToken` 到 `POST /api/v1/auth/refresh` 以刷新 `token`。您将在响应中收到新的 `token`、`tokenExpires` 和 `refreshToken`。

### 视频示例

https://github.com/brocoders/nestjs-boilerplate/assets/6001723/f6fdcc89-5ec6-472b-a6fc-d24178ad1bbb

### 支持多设备登录/会话

样板代码支持使用刷新令牌流程进行多设备登录。这是通过 `sessions` 实现的。当用户登录时，会创建一个新会话并存储在数据库中。会话记录包含 `sessionId (id)`、`userId` 和 `hash`。

在每次 `POST /api/v1/auth/refresh` 请求中，我们将数据库中的 `hash` 与刷新令牌中的 `hash` 进行检查。如果它们相等，我们返回新的 `token`、`tokenExpires` 和 `refreshToken`。然后我们在数据库中更新 `hash`，以禁止使用以前的刷新令牌。

## 登出

1. 调用以下端点：

   ```text
   POST /api/v1/auth/logout
   ```

2. 从您的客户端应用（cookie、localStorage 等）中移除 `access token` 和 `refresh token`。

## 问答

### 在 `POST /api/v1/auth/logout` 或从数据库中删除会话后，用户在一段时间内仍可以使用 `access token` 进行请求。为什么？

这是因为我们使用 `JWT`。`JWT` 是无状态的，所以我们无法撤销它们，但不用担心，这是正确的行为，访问令牌将在 `AUTH_JWT_TOKEN_EXPIRES_IN` 指定的时间后过期（默认值为 15 分钟）。如果您仍然需要立即撤销 `JWT` 令牌，您可以在每次请求时在 [jwt.strategy.ts](https://github.com/brocoders/nestjs-boilerplate/blob/2896589f52d2df025f12069ba82ba4fac1db8ebd/src/auth/strategies/jwt.strategy.ts#L20-L26) 中检查会话是否存在。但是，不建议这样做，因为它会影响应用程序的性能。

---

上一篇：[数据库](database.md)

下一篇：[序列化](serialization.md)
