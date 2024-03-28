// ~/utils/parseMarkdown.js
import markdownParser from '@nuxt/content/transformers/markdown'

// first arg to parse() is for id, which is unused
export const parseMarkdown = md => {
    let modifiedMd = md.replace(/\\n/g, '\n\n');

    // Ensure all links are treated as absolute URLs
    modifiedMd = modifiedMd.replace(/\[([^\]]+)\]\((?!http)([^\)]+)\)/g, (match, text, url) => {
        // Prefix the URL with "https://" if it doesn't start with "http"
        // This handles http and https URLs correctly, assuming non-http URLs are intended to be absolute

        url = url.replace('"', '')
        url = url.replace('"', '')
        
        const prefixedUrl = url.startsWith('http') ? url : `https://${url}`;


        return `[${text}](${prefixedUrl})`;
    });

    return markdownParser.parse('custom.md', modifiedMd)
}