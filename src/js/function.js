
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
function handleLink(nameHref, nameChap) {
    const nameWebsite = (nameHref.split("/")[2]).split(".")[0];
    if(nameWebsite.includes("truyenqq")){
        let createLinkChap = nameHref + '-chap-' + nameChap + '.html';
        localStorage.setItem('chapterHref', createLinkChap);
    } else if (nameWebsite.includes("timtruyen3s")){
        // https://timtruyen3ss.com/doc-tinh-giap-hon-tuong-chuong-1.html
        // https://timtruyen3ss.com/truyen-tinh-giap-hon-tuong.html
        let getNameComic = nameHref.replace(nameHref.split('truyen'), 'doc');
        let createLinkChap = getNameComic.replace('.html', "-chuong-" + nameChap + ".html")
        localStorage.setItem('chapterHref', createLinkChap);
    } else if(nameWebsite.includes("goctruyentranh")) {
        // https://goctruyentranhvui2.com/truyen/ta-la-ta-de
        // https://goctruyentranhvui2.com/truyen/ta-la-ta-de/chuong-472
        let createLinkChap = nameHref + "/chuong-" + nameChap;
        localStorage.setItem("chapterHref", createLinkChap);
    } else{
        localStorage.setItem('chapterHref', nameHref);
    }
}
export {handleLink}