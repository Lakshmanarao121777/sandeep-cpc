export const pasteEvent = (e : any) => {
    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData;
    return clipboardData.getData('Text');
};