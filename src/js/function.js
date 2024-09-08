
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
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/gi, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi, "y");
    str = str.replace(/đ/gi, "d");
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
// Xu ly tra ve thoi gian-----------------------------------------------
function renderDate(chapUp, arrComic, today) {
    // ['8/6/2024', '3:33:59 PM']
    // Current time---------------------
    const getToDay = today.split(", ")[0];
    const getToTime = today.split(', ')[1];
    let getToMonth = +getToDay.split('/')[0];
    let getToDate = +getToDay.split('/')[1];
    let getToYear = +getToDay.split('/')[2];
    let getToHour = +getToTime.split(' ')[0].split(":")[0] == 12 ? 0: +getToTime.split(' ')[0].split(":")[0];
    let getToMinute = +getToTime.split(' ')[0].split(":")[1];
    let getToSecond = +getToTime.split(' ')[0].split(":")[2];
    let getToOn = getToTime.split(' ')[1];
    for (let i = 0; i < arrComic.length; i++) {
        // Comic time--------------------------
        const passDay = arrComic[i].updateChap;
        const getPassDay = passDay.split(", ")[0];
        const getPassTime = passDay.split(', ')[1];
        let getPassMonth = +getPassDay.split('/')[0];
        let getPassDate = +getPassDay.split('/')[1];
        let getPassYear = +getPassDay.split('/')[2];
        let getPassHour = +getPassTime.split(' ')[0].split(":")[0] == 12 ? 0: +getPassTime.split(' ')[0].split(":")[0];
        let getPassMinute = +getPassTime.split(' ')[0].split(":")[1];
        let getPassSecond = +getPassTime.split(' ')[0].split(":")[2];
        let getPassOn = getPassTime.split(' ')[1];
        // 9/1/2024, 8:27:40 AM
        // 8/31/2024, 11:16:55 PM
        function renderTimeComic() {
            const second = [60, 3600, 43200, 86400];
                const arrayHour = handleConvertSecond();
                if (getToYear - getPassYear == 0) {
                    if (getToMonth - getPassMonth == 0) {
                        if (getToDate - getPassDate == 0) {
                            if (arrayHour[0] == 0 ) {
                                if (arrayHour[1] == 0) {
                                    if (arrayHour[2] == 0) {
                                        renderTimeComic(2, "giây");
                                    } else renderTimeComic(arrayHour[2], "giây");
                                } else {
                                    renderTimeComic(arrayHour[1], "phút");
                                }
                            } else {
                                arrayHour[1] <= 30? renderTimeComic(arrayHour[0] , "giờ") : renderTimeComic(arrayHour[0] + 1, "giờ")
                            }
                        } else {
                            let getCurrentHour = arrayHour[0];
                            let valueSecond = arrayHour[3];
                            if (valueSecond < 0) {
                                if (getToDate - getPassDate == 1) {
                                    arrayHour[1] <= 30? renderTimeComic(getCurrentHour - 1 + 24, "giờ") : renderTimeComic(getCurrentHour + 24, "giờ")
                                } else {
                                    let getCurentDate = getCurrentHour > 12 ? getToDate - getPassDate + 1 : getToDate - getPassDate;
                                    renderTimeComic(getCurentDate, "ngày");
                                }
                            } else {
                                let getCurentDate = getCurrentHour > 12 ? getToDate - getPassDate + 1 : getToDate - getPassDate;
                                renderTimeComic(getCurentDate, "ngày");
                            }
                        }
                    } else {
                        if (getToMonth - getPassMonth == 1) {
                            handleDay(getPassYear, getPassMonth);
                        } else {renderDateComic()}
                    } 
                } else {renderDateComic()}   
            function handleConvertSecond() {
                let timeToSecond = (getToOn == "AM") ? getToHour *second[1] + getToMinute*second[0] + getToSecond : getToHour *second[1] + getToMinute*second[0] + getToSecond + second[2];
                let timePassSecond = (getPassOn == "AM") ? getPassHour *second[1] + getPassMinute*second[0] + getPassSecond : getPassHour *second[1] + getPassMinute*second[0] + getPassSecond + second[2];
                let valueSecond = timeToSecond - timePassSecond;
                let currentHour = Math.floor(valueSecond / 3600);
                const x = (valueSecond / 3600).toString().includes(".");
                let currentMinute = (x == true)  ? (Math.floor(+("0." +((valueSecond / 3600).toString()).split('.')[1]) * 60)) : 0
                let currentSecond = (valueSecond % 60);
                return [currentHour, currentMinute, currentSecond, valueSecond];
            } ;
            function handleDay(year, month) {
                let day;
                switch (month) {
                    case 4: ; case 6:; case 9:; case 11:;
                        day = 10; insertDay(day)
                        break;
                    case 2 : 
                        if (year%4 == 0) {
                            day = 29; insertDay(day);
                            break;
                        } else {
                            day = 28; insertDay(day);
                            break;
                        }
                    default: {
                        day = 31; insertDay(day);
                    }
                };
                function insertDay(day) {
                    let getCurentDate = arrayHour[0] > 12 ? getToDate - getPassDate + day + 1 : getToDate - getPassDate + day;
                    if (getCurentDate == 0 ) {
                        arrayHour[1] <= 30? renderTimeComic(arrayHour[0] , "giờ") : renderTimeComic(arrayHour[0] + 1, "giờ")
                    } else renderTimeComic(getCurentDate, "ngày")
                }
            }
            function renderTimeComic(num, text) {
                chapUp[i].innerText = num +" " + text + " trước";
                if (num < 0) {
                    console.log(num +" " + text + " trước" )
                }
            };
            function renderDateComic() {
                let getComicDate = getPassDate < 10 ? "0" + getPassDate : getPassDate;
                let getComicMonth = getPassMonth< 10 ? "0" + getPassMonth: getPassMonth;
                let getComicYear = getPassYear;
                chapUp[i].innerText = (getComicDate + "/ " + getComicMonth + "/ " + getComicYear);
            }
        } renderTimeComic();
    }
};
export {postApi, getApi, xoa_dau, handleChapHref, renderDate}
