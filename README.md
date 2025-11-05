### Next.js 15+ Note

Next.js 15 uses Turbopack by default, which doesn't support Babel plugins yet.

**Solution:** Run Next.js in webpack mode:
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build"
  }
}
```

The installer creates `.babelrc` automatically for you!