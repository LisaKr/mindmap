# Japan Field Notes

An interactive, searchable guide generated from the destinations in
[`japan.md`](./japan.md). The browser parses the Markdown directly, so additions
to the list appear on the site without a separate data conversion step.

## Local development

```sh
npm test
npm run check
npm run preview
```

The preview is available at <http://127.0.0.1:4173/>.

## Deployment

The `deploy-pages.yml` workflow publishes the site to GitHub Pages after each
push to `main`. Configure the repository's Pages source as **GitHub Actions**.