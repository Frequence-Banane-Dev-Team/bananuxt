import {
    type Hero,
    type HeroStrapi,
    type BackgroundImage,
    type CoverImage,
    type BackgroundImageStrapi,
    type CoverImageStrapi
} from './types'

export default async function (heroStrapi: HeroStrapi, config: any) {
    const STRAPI_URL = config.public.STRAPI_URL;

    let hero: Hero = {
        ...heroStrapi.data.attributes
    } as Hero
    
    const hero_background_image = heroStrapi?.data.attributes.background_image as BackgroundImageStrapi
    if (hero_background_image.data?.attributes) {
        hero.background_image = {} as BackgroundImage
        hero.background_image.url = `${STRAPI_URL}${hero_background_image.data?.attributes.url}`
    }

    const hero_cover_image = heroStrapi?.data.attributes.cover as CoverImageStrapi
    if (hero_cover_image.data?.attributes) {
        hero.cover = {} as CoverImage
        hero.cover.url = `${STRAPI_URL}${hero_cover_image.data?.attributes.url}`
    }

    if (hero.button) {
        // If button.url has frequencebanane.ch/ in the url just put the relative url
        if (hero.button.url.includes('frequencebanane.ch/')) {
            hero.button.url = hero.button.url.split('frequencebanane.ch/')[1]
        }
    }

    return hero 
}