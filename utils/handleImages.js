export const extractImage = (item, field = 'cover') => {
    try {
        if (item.attributes[field].data?.attributes?.formats?.small) {
            return {
                url: item.attributes[field].data.attributes.formats.small.url,
                alternativeText: item.attributes[field].data.attributes.alternativeText
            }
        }

        if (item.attributes[field].data?.attributes?.url) {
            return {
                url: item.attributes[field].data.attributes.url,
                alternativeText: item.attributes[field].data.attributes.alternativeText
            }
        }

        return null
    } catch (e) {
        return null
    }
}