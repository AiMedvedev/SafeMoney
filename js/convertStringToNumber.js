export const convertStringToNumber = (str) => {
    const noSpaceStr = str.replace(/\s+/g, '');
    const number = parseFloat(noSpaceStr);

    if(!isNaN(number) && isFinite(number)) {
        return number;
    }
}