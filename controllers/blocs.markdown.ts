
import { parseMarkdown } from '~/utils/parseMarkdown'

export default async function (section: any) {

    section.content = await parseMarkdown(section.content)
    
    return section
}