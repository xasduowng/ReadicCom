
// -------------------------------------------Day gia tri len LOCAL Storage-------------------------------------------
function postApi(name, value) {
    if ( typeof value == 'number' || typeof value == 'string') {
        localStorage.setItem(name, value);
    } else {
        localStorage.setItem(name, JSON.stringify(value));
    }
}
// -------------------------------------------Lay gia tri tren LOCAL Storage------------------------------------------
function getApi(name) {
    let valueApi = JSON.parse(localStorage.getItem(name));
    return valueApi;
}
export {postApi, getApi}
// -----------------------------Day gia tri cua duong dan chuong len  Local Storage-----------------------------------
