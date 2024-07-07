


export interface SectionCard {
    title: string
    slug: string
    columns: number
    layout: string
    items: any[]
}


export interface SectionHero {
    title: string
    subtitle: string
    background_image: BackgroundImageComponentStrapi
    cover: CoverImageComponentStrapi
}

export interface HeroStrapi {
    data: {
        attributes: {
            title: string
            subtitle: string
            background_image: BackgroundImageComponentStrapi
            cover: CoverImageComponentStrapi
        }
    }
}

export interface Hero {
    title: string
    subtitle: string
    background_image: BackgroundImage
    cover: CoverImage,
    button?: {
        title: string
        url: string
    }
}

export interface BackgroundImageComponentStrapi {
    image?: {
        data: {
            attributes: {
                url: string
                alternativeText: string
            }
        }
    },
    url?: string,
    alternativeText?: string
}

export interface CoverImageComponentStrapi {
    image?: {
        data: {
            attributes: {
                url: string
                alternativeText: string
            }
        }
    },
    url?: string,
    alternativeText?: string
}

export interface BackgroundImageStrapi {
    data: {
        attributes: {
            url: string
            alternativeText: string
        }
    }

}

export interface CoverImageStrapi {
    data: {
        attributes: {
            url: string
            alternativeText: string
        }
    }
}

export interface CoverImage {
    id: string
    url: string
    format?: string
}

export interface BackgroundImage {
    url: string
    alternativeText: string
}

export interface Emission {
    id: string
    cover: CoverImage
    data?: any
}

export interface Category {
    data: {
        attributes: {
            name: string
        }
    }
}

export interface BaseAttributes {
    date: Date; // Assuming `date` is a common attribute, adjust as necessary
    title?: string; // Present in emissions and possibly others, optional if not universally present
    cover?: CoverImage;
    category?: Category;
    emission?: Emission;
    // Include other common attributes here
}

export interface BaseResponse {
    id: number;
    attributes: BaseAttributes;
    slug?: string; // You're adding this property dynamically
}
// Specific response interfaces
export interface PodcastResponse extends BaseResponse {
    // Add any podcast-specific properties or override BaseAttributes with more specific ones
     // Assuming `emission` is a common attribute, adjust as necessary
}

export interface ArticleResponse extends BaseResponse {
    // Special treatment for `cover.format` implies you might have article-specific attributes
}

export interface SectionCardResponse {
    data: Array<PodcastResponse | ArticleResponse>; // Assuming your response structure, adjust as needed
    // Add any other top-level response properties here
}

export interface EmissionResponse extends BaseResponse {
    // Emission-specific extensions or overrides
}