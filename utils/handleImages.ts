export function extractImage({item, baseUrl = '', field = 'cover'} : {item: any, baseUrl?: string, field?: string}) {

    if (!item) return null
    if (!item.attributes) return null
    if (!item.attributes[field]) return null
    if (!item.attributes[field] || item.attributes[field].length === 0 || !item.attributes[field][0]) {
        try {
            if (item.attributes[field].data?.attributes?.formats?.small) {
                return {
                    url: `${baseUrl}${item.attributes[field].data.attributes.formats.small.url}`,
                    alternativeText: item.attributes[field].data.attributes.alternativeText
                }
            }
    
            if (item.attributes[field].data?.attributes?.url) {
                return {
                    url: `${baseUrl}${item.attributes[field].data.attributes.url}`,
                    alternativeText: item.attributes[field].data.attributes.alternativeText
                }
            }
    
            return null
        } catch (e) {
            return null
        }
    }

    if (item.attributes[field][0].__component === 'images.url') {
        return {
            url: item.attributes[field][0].url,
            alternativeText: null
        }
    } else if (item.attributes[field][0].__component === 'images.cover-image') {
        try {
            if (item.attributes[field][0].image.data?.attributes?.formats?.small) {
                return {
                    url: `${baseUrl}${item.attributes[field][0].image.data.attributes.formats.small.url}`,
                    alternativeText: item.attributes[field][0].image.data.attributes.alternativeText
                }
            }
    
            if (item.attributes[field][0].image.data?.attributes?.url) {
                return {
                    url: `${baseUrl}${item.attributes[field][0].image.data.attributes.url}`,
                    alternativeText: item.attributes[field][0].image.data.attributes.alternativeText
                }
            }
    
            return null
        } catch (e) {
            return null
        }
    }

    
}