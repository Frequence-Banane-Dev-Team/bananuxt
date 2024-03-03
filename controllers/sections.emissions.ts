

// controller for sections.cards component
// Path: controllers/sections.cards.ts
// process the data from the API and return the data processed


import {
    type SectionCard,
    type SectionCardResponse,
    type CoverImage,
    type Emission,
    type Category,
    type BaseAttributes,
    type BaseResponse,
    type PodcastResponse,
    type ArticleResponse,
    type EmissionResponse
} from './types'


export default async function (section: any, config: any, find: any) {
    const STRAPI_URL = config.public.STRAPI_URL;

    const items = await Promise.all(section.emissions.data.map(async (item: any) => {
        const image = extractImage({ item, baseUrl: STRAPI_URL }) as CoverImage | null

        if (image) {
            image.format = item.attributes.cover?.format
        }

        let itemData = {
            id: item.id,
            ...item.attributes,
            slug: item.slug,
            image
        } as any


        itemData.url = `/emissions/${itemData.code}`

        const emissionImage = extractImage({ item: itemData, baseUrl: STRAPI_URL }) as CoverImage | null

        if (emissionImage) {
            itemData.image = emissionImage
        }

        return itemData
    }))

    section.items = items
    section.columns = items.length

    return section
}