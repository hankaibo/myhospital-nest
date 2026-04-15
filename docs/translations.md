# 翻译 (国际化)

## 目录 <!-- omit in toc -->

- [如何添加新翻译](#如何添加新翻译)
- [如何在前端使用翻译](#如何在前端使用翻译)
- [如何在代码中使用翻译](#如何在代码中使用翻译)

## 如何添加新翻译

1. 复制 `en` 文件夹并将其重命名为您要添加的语言。
2. 翻译新文件夹中的文件。

## 如何在前端使用翻译

1. 在请求中添加带有您要使用的语言的 `x-custom-lang` 标头。

## 如何在代码中使用翻译

```typescript
import { I18nContext } from 'nestjs-i18n';

// 代码 ...

@Injectable()
export class SomeService {
  // 代码 ...

  async someMethod(): Promise<void> {
    const i18n = I18nContext.current();

    if (!i18n) {
      throw new Error('I18nContext is not available');
    }

    const emailConfirmTitle = await i18n.t('common.confirmEmail');

    // 代码 ...
  }
}
```

---

上一篇：[自动更新依赖](automatic-update-dependencies.md)
