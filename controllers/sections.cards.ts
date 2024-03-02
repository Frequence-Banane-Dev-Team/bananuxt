

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


export default async function (section: SectionCard, config: any, find: any) {
    const STRAPI_URL = config.public.STRAPI_URL;

    let data = []

    if (section.slug == 'unes') {
        const response = await find('podcasts', {
            sort: 'date:desc',
            populate: {
                cover: {
                    populate: {
                        image: true
                    }
                },
                emission: {
                    populate: {
                        cover: {
                            populate: {
                                image: true
                            }
                        }
                    }
                }
            }
        }) as SectionCardResponse

        const podcasts = response.data.map(item => {
            item.slug = 'podcasts'
            return item
        })

        const responseArticles = (await find('articles', {
            sort: 'date:desc',
            populate: {
                cover: true,
                category: true
            }
        })) as SectionCardResponse

        const articles = responseArticles.data.map(item => {
            item.slug = 'articles'
            
            if (item.attributes?.cover) {
                item.attributes.cover.format = 'video'
            }
            return item
        }) as ArticleResponse[]

        articles.map(item => {
            console.log(item.attributes.cover)
        })

        data = [...podcasts, ...articles] as (PodcastResponse | ArticleResponse)[]

        data = data.sort((a: BaseResponse, b: BaseResponse) => {
            return new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
        })

    } else {

        data = (await find(section.slug, {
            sort: section.slug == 'emissions' ? 'title:asc' : 'date:desc',
            populate: {
                cover: {
                    populate: {
                        image: true
                    }
                },
                category: true,
                emission: {
                    populate: {
                        cover: {
                            populate: {
                                image: true
                            }
                        }
                    }
                }
            }
        })).data.map((item : any)=> {
            item.slug = section.slug
            return item
        }) as (PodcastResponse | ArticleResponse | EmissionResponse)[]

    }

    const LIMIT = section.columns;

    const items = await Promise.all(data.slice(0, LIMIT).map(async (item) => {
        const image = extractImage({item, baseUrl: STRAPI_URL}) as CoverImage | null
        
        if (image) {
            image.format = item.attributes.cover?.format
        }

        let itemData = {
            id: item.id,
            ...item.attributes,
            slug: item.slug,
            image
        } as any


        if (itemData.slug == 'podcasts') {
            itemData.url = `/emissions/${itemData.emission?.data?.attributes.code}/${itemData.id}`
        } else if (itemData.slug == 'emissions') {
            itemData.url = `/emissions/${itemData.code}`
        } else {
            itemData.url = `/${itemData.slug}/${itemData.id}`
        }

        if (item.attributes.category) {
            const category =  item.attributes.category as Category
            itemData.category = category.data?.attributes
        }

        if (itemData.date) {
            itemData.date = formatDate(itemData.date)
        }

        if (itemData.duration) {
            itemData.duration = formatDuration(itemData.duration)
        }

        if (itemData.emission) {

            const emissionImage = extractImage({item: itemData.emission?.data, baseUrl: STRAPI_URL}) as CoverImage | null

            itemData.emission = itemData.emission?.data?.attributes

            if (itemData.emission) {
                itemData.emission.image = emissionImage
                itemData.emission.url = `/emissions/${itemData.emission.code}`
    
                if (!itemData.image) {
                    itemData.image = emissionImage
                }
            }
        }
        return itemData
    }))


    section.items = items

    return section
}