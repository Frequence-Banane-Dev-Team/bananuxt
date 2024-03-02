// ~/utils/parseMarkdown.js
import markdownParser from '@nuxt/content/transformers/markdown'

// first arg to parse() is for id, which is unused
export const parseMarkdown = md => {
    const modifiedMd = md.replace(/\\n/g, '\n\n');
    return markdownParser.parse('custom.md', modifiedMd)
}