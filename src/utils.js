const formatPrice = (price) => {
    //add a space every 3 digits
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export { formatPrice };