# Version

> [!TIP]
>
> Location within the framework `onic-agent-framework/version`.

<!-- embedme examples/version.ts -->

```ts
import { Version } from "onic-agent-framework/version";

console.log(`Framework version is ${Version}`);
```

_Source: [examples/version.ts](/examples/version.ts)_

> [!NOTE]
>
> If you develop the framework locally, the version will always be `0.0.0`.

> [!NOTE]
>
> The framework's serializer attaches the framework's version to its metadata. Read more about [Serialization](./serialization.md).
