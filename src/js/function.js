
// Day gia tri len LOCAL Storage---------------------------------------
function postApi(name, value) {
    if ( typeof value == 'number' || typeof value == 'string') {
        localStorage.setItem(name, value);
    } else {
        localStorage.setItem(name, JSON.stringify(value));
    }
}
// Lay gia tri tren LOCAL Storage---------------------------------------
function getApi(name) {
    let valueApi = JSON.parse(localStorage.getItem(name));
    return valueApi;
}
// Day gia tri cua duong dan chuong len  Local Storage------------------
function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/ /g, "");
    return str;
};
// Xu ly duong link chuong----------------------------------------------
function handleChapHref (nameHref, nameChap) {
    const dataWeb = getApi ("dataWeb");
    const nameWebsite = nameHref;
    if(nameWebsite.includes("truyenqq")){
        let createLinkChap = nameHref + '-chap-' + nameChap + '.html';
        postHref (createLinkChap);
    } else if (nameWebsite.includes("timtruyen3s")){
            // https://timtruyen3ss.com/doc-tinh-giap-hon-tuong-chuong-1.html
            // https://timtruyen3ss.com/truyen-tinh-giap-hon-tuong.html
        let getNameComic = nameHref.replace(nameHref.split('truyen'), 'doc');
        let createLinkChap = getNameComic.replace('.html', "-chuong-" + nameChap + ".html")
        postHref (createLinkChap);
    } else if(nameWebsite.includes("goctruyentranh")) {
            // https://goctruyentranhvui2.com/truyen/ta-la-ta-de
            // https://goctruyentranhvui2.com/truyen/ta-la-ta-de/chuong-472
        let createLinkChap = nameHref + "/chuong-" + nameChap;
        postHref (createLinkChap);
    } else if(nameWebsite.includes("mangakakalot")) {
            // https://ww8.mangakakalot.tv/manga/manga-zl1003294
            // https://ww8.mangakakalot.tv/chapter/manga-zl1003294/chapter-1
        let getNameComic = nameHref.replace("/manga", "/chapter");
        let createLinkChap = getNameComic + "/chapter-" + nameChap;
        postHref (createLinkChap);
    } else if(nameWebsite.includes("mangafire")) {
            // https://mangafire.to/manga/the-artistic-genius-of-music-is-the-reincarnation-of-paganini.zxjqw
            // https://mangafire.to/read/the-artistic-genius-of-music-is-the-reincarnation-of-paganini.zxjqw/en/chapter-1
        let getNameComic = nameHref.replace("/manga", "/read");
        let createLinkChap = getNameComic + "/en/chapter-" + nameChap;
        postHref (createLinkChap);
    } else if(nameWebsite.includes("manhuatop")) {
            // https://manhuatop.org/manhua/the-beginning-after-the-end/
            // https://manhuatop.org/manhua/the-beginning-after-the-end/chapter-175/
        let createLinkChap = nameHref + "chapter-" + nameChap;
        postHref (createLinkChap);
    } 
    else { postHref (nameHref)};
    function postHref(chapHref) {
        dataWeb.statusWeb.chapterHref = chapHref;
        postApi("dataWeb", dataWeb);
    }
};

export {postApi, getApi, xoa_dau, handleChapHref}




