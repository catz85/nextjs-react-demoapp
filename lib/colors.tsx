export const generateColor = (id:number):string => {
    const colorId = (id+1)/10000;
    return `0000${Math.floor(colorId*16777215).toString(16)}`.slice(-6)
}
export const generatePhotoUrl = (id:number, width: number):string => {
    return `https://via.placeholder.com/${width}/${generateColor(id)}`
}