
import { 
    type SectionHero,
    type BackgroundImageComponentStrapi,
    type CoverImageComponentStrapi
} from './types'

export default async function (section: SectionHero, config: any) {
    const STRAPI_URL = config.public.STRAPI_URL || '';


    // Background image
    if (section.background_image) {
        const hero_background_image = section.background_image as BackgroundImageComponentStrapi

        if (hero_background_image.image?.data?.attributes) {
            section.background_image = {
                url: `${STRAPI_URL}${hero_background_image.image.data.attributes.url}`,
                alternativeText: hero_background_image.image.data.attributes.alternativeText
            }
        }
    }

    // Cover image
    if (section.cover?.image?.data) {
        const hero_cover_image = section.cover as CoverImageComponentStrapi

        if (hero_cover_image.image?.data?.attributes) {

            section.cover = {
                url: `${STRAPI_URL}${hero_cover_image.image?.data?.attributes.url}`,
                alternativeText: hero_cover_image.image?.data?.attributes.alternativeText
            }
        }
    }

    return section
}