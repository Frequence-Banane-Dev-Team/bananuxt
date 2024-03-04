export const formatDate = (date, format=null) => {
// format of input: '2023-12-25',
// output '4 Fév' if format is 'DD MM' or '4 Février 2023' if format is 'DD MMM YYYY' or '4/02/2023' if format is 'DD/MM/YYYY' 

    const dateArray = date.split('-');
    const dateTime = new Date(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`);

   switch (format) {
        case 'DD MMM YYYY':
            return `${dateTime.getDate()} ${dateTime.toLocaleString('fr-FR', { month: 'long' })} ${dateTime.getFullYear()}`;
        case 'DD/MM/YYYY':
            return `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
        case 'long':
            return `${dateTime.getDate()} ${dateTime.toLocaleString('fr-FR', { month: 'long' })} ${dateTime.getFullYear()}`;
        default:
            return `${dateTime.getDate()} ${dateTime.toLocaleString('fr-FR', { month: 'short' })}`;
    }

}