export const formatDate = (date) => {
// format of input: '2023-12-25',
// output '4 Fév'

    const options = { month: 'short' }; 
    const dateArray = date.split('-');
    const month = new Date(`${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`).toLocaleDateString('fr-FR', options);
    const day = dateArray[2];
    return `${day} ${month}`;
}