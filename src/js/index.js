import {getApi, postApi, xoa_dau, handleChapHref} from "./function.js";
//-------------------------------
const z = document.querySelector.bind(document);
const zz = document.querySelectorAll.bind(document);
// Ten truyen, ten NV, Duong dan truyen, duong dan anh
// THe loai truyen, So chuong, Tinh trang
/* ----------------------------------XU LY DU LIEU KHI NGUOI DUNG LAN DAU LOAD WEBSITE---------------------------------- */
(function startWeb() {
    const dataWeb = {
        "arrayComic":[],
        "arrayWebsite": [],
        "arrayGenre": [],
        "statusWeb": {
            chapterHref: "none",
            idFilter: 0,
            idRandom: "none",
            idRespon: 1
        }
    }
    // Ham dung de day mang ban dau len LocalStorage
    let x = localStorage.getItem('viewWeb');
    if ( x == 1){} else {
        postApi("dataWeb", dataWeb); 
        postApi("viewWeb", 1);
    }
}) ();
/* ----------------------------------XU LY CAC SU KIEN CUA NGUOI DUNG KHI TAC DONG ---------------------------------- */
const overLay = z('#overlay');
const boxExtra = z('.box-extra');
const size = screen.width; 
const boxNav = z('#box-nav');
/* -------------------------------------------------------------------*/
const dataWeb = getApi ("dataWeb");
const idFilter = (dataWeb.statusWeb).idFilter;
const arrWebsite = dataWeb.arrayWebsite;
handleBoxWebsite(arrWebsite);
const arrComic = dataWeb.arrayComic;
    arrComic.length >= 1 ? (handleBoxComic(arrComic, idFilter), handleBoxGenre())
        : console.log("Chưa có dữ liệu!");
/* -------------------------------------------------------------------*/
    // Ham xu ly hop the loai----------------------
function handleBoxGenre() {
    function handleArrGenre() {
        const arrGenre = [];
        for (let i = 0; i < arrComic.length; i++) {
            let x = arrComic[i].arrayGenre;
            for (let j = 0; j < x.length; j++) {
                let y = x[j].toLowerCase();
                arrGenre.push(y)
            }
        };
            // Xoa cac phan tu trung lap trong mang
        let arrayGenre = (Array.from(new Set(arrGenre))).sort();
        const newArr = [];
        for (let i = 0; i< arrayGenre.length; i++) {
            let x = {
                    nameGenre: arrayGenre[i],
                    vietToEng: xoa_dau(arrayGenre[i])
                }
            newArr.push(x);
        }
        return newArr;
    }; 
    const arrGenre = handleArrGenre();
    // Tra ve mot truyen truyen ngau nhien--------------------------------  
    const genreTitle = z('.comic_genre-title span');
    let rd1 = Math.floor(Math.random()*arrGenre.length);
        dataWeb.arrayGenre = arrGenre;
        dataWeb.statusWeb.idRandom = rd1;
        postApi("dataWeb", dataWeb);
    let genre = arrGenre[rd1].nameGenre.toLowerCase();
    genreTitle.innerText = genre;
    let newArr = arrComic.filter((item) => item.listGenre.toLowerCase().includes(genre))
    let rd2 = Math.floor((Math.random() * newArr.length));
        function handleComicRandom() {
            // -------------------------------------------//
            function handleNavComic() {
                const idComic = z('.box-suggest_nav span');
                const boxIcon = z('.box-suggest_nav > div');
                idComic.innerText = rd2 + 1;
                const lengthNewArr = newArr.length;
                if(lengthNewArr != 1) {
                    const iLeft = document.createElement('i');
                    const iRight = document.createElement('i');
                    iLeft.className = "fa-solid fa-chevron-left btn";
                    iRight.className = "fa-solid fa-chevron-right btn";
                    boxIcon.appendChild(iLeft);
                    boxIcon.appendChild(iRight);
                    hanleClickNav(iLeft, iRight);
                };
                function hanleClickNav(iLeft, iRight) {
                    let currentIdComic  = +rd2;
                    const idNewArr = lengthNewArr -1;
                    function handleNav() {
                        iRight.onclick = () => {
                            if (currentIdComic == idNewArr) {
                                currentIdComic =0;
                            } else {
                                currentIdComic++;
                            }
                            renderRandom(currentIdComic);
                            idComic.innerText = currentIdComic + 1;
                        };
                        iLeft.onclick = () => {
                            if (currentIdComic == 0) {
                                currentIdComic = idNewArr;
                            } else {
                                currentIdComic--;
                            }
                            renderRandom(currentIdComic);
                            idComic.innerText = currentIdComic + 1;
                        }
                        setInterval(insertValue, 10000);
                        function insertValue() {
                            if (currentIdComic == idNewArr) {
                                currentIdComic = 0;
                            } else {
                                currentIdComic++;
                            }
                            renderRandom(currentIdComic);
                            idComic.innerText = currentIdComic + 1;
                        }
                    } handleNav();
                }
            } handleNavComic();
            // -------------------------------------------//
            function renderRandom(index) {
                const ranImg = z('.box-suggest_comic img');
                const ranName = z('.sc-item_name');
                const spans = zz('.sc-item_wrap span');
                const ranHref = z('.box-suggest_comic > a');
                const linkReads = zz('.sc-item_read a');
                const currentComic = newArr[index];
                function renderValue() {
                    ranImg.src = currentComic.imgHref;
                    ranName.innerText = currentComic.nameComic;
                    ranHref.href = currentComic.nameHref;
                    spans[0].innerText = currentComic.nameComic;
                    spans[1].innerText = currentComic.nameCharacter;
                    spans[2].innerText = currentComic.nameHref;
                    spans[3].innerText = handleUpdate();
                    function handleGenre() {
                        const arrGenre = currentComic.arrayGenre;
                        const lengthGenre = arrGenre.length;
                        spans[4].innerHTML = "";
                        for (let i = 0; i < lengthGenre; i++){
                            const p = document.createElement('p');
                            p.innerText = arrGenre[i];
                            if (arrGenre[i].toLowerCase() == genre) {
                                p.classList.add('choose');
                            }
                            spans[4].appendChild(p)
                        };
                    } handleGenre();
                    function handleUpdate() {
                        const updateChap = currentComic.updateChap.split(', ');
                        const getDate = updateChap[0].split('/');
                        let date = "Cập nhật lúc " + updateChap[1] + ", Ngày " + getDate[1] +"/ " +getDate[0] +"/ "+ getDate[2];
                        return date;
                    };
                    function handleWeb() {
                        const hrefComic = currentComic.nameHref;
                        const arrHref = hrefComic.split("/");
                        const getNameWeb = (arrHref)[2].split('.')[0];
                        spans[5].innerText = getNameWeb;
                        const a = z('.sc-item_web a');
                        a.href = arrHref[0] + "//" + arrHref[2];
                    } handleWeb();
                    function handleLinkRead() {
                        linkReads[0].href = currentComic.nameHref;
                        linkReads[1].innerText = "Đọc tiếp chương " + currentComic.nameChap;
                        linkReads[1].href = currentComic.chapterHref;
                    } handleLinkRead();
                } renderValue();
            } renderRandom(rd2);
        } handleComicRandom();
    //  ---------------------------------------  //
    function renderComicGenre(newArr) {
        const genreBox = z('.comic_genre-box');
        genreBox.innerHTML = newArr.map((item) => {
            let {nameComic, chapterHref, nameChap, imgHref, nameHref} = item;
            return (`
                <div class="genre-box_item">
                    <a>
                        <img src=${imgHref} alt="">
                    </a>
                    <div>
                        <a href=${nameHref} class="genre-box_name name" target="_blank">${nameComic}</a>
                        <a href=${chapterHref} class="genre-box_chap" target="_blank">Chương ${nameChap}</a>
                    </div>
                </div>
            `)
        }).join('');
        function insertIdComic() {
            const nameLinks = zz('.genre-box_item > a');
            nameLinks.forEach((link, index) => {
                link.href = "#" + newArr[index].nameComic;
            })
        } insertIdComic();
    } renderComicGenre(newArr);
}
/* -------------------------------------------------------------------*/
    // Ham xu ly tra ve danh sach truyen-----------
function handleBoxComic(arrComic, idFilter) {
    const boxComic = z('.box-comic');
    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    const comicNavs = zz('.box-comic_nav span');
    comicNavs[idFilter].classList.add('choose');
    // --------------------------------//
    for (let i = 0; i < arrWebsite.length; i++) {
        const getNameWeb = arrWebsite[i].nameWeb.toLowerCase();
        const newArrComic = arrComic.filter((item) => {
            return item.nameHref.toLowerCase().includes(xoa_dau(getNameWeb));
        });
        if (newArrComic.length >=1) {
            if(z('.sld.close')){
                z('.sld.close').classList.remove('close')
            }
        }
    }
    // --------------------------------//
    comicNavs.forEach((comic, index) => {
        comic.onclick = () => {
            dataWeb.statusWeb.idFilter = index;
            postApi("dataWeb", dataWeb);
            // ----------------------------------
            z('.box-comic_nav span.choose').classList.remove('choose');
            comicNavs[index].classList.add('choose');
            handleArrComic(index); handleBoxNav();
                $('.box-comic_nav span.sld').click(function() {
                    $('.box-comic_genre').slideDown();
                })
        }
    }); 
    if (idFilter == 2) {$('.box-comic_genre').slideUp();}
    $('.comic_nav-genre').click(function() {
        $('.box-comic_genre').slideUp(1000);
    })
    function handleArrComic(index) {
        if (index == 0) {
            // Sắp xếp theo số chương
            arrComic.sort((a, b)=>{
                return b.nameChap - a.nameChap;
            });
            Object.assign((boxComic).style, {
                display: "grid"
            })
            handleRenderComic(arrComic); handleBoxExtra();
        } else if (index == 1) {
            // Sắp xếp theo alpha
            arrComic.sort((a,b) => {
                var x = a.nameComic.toLowerCase();
                var y = b.nameComic.toLowerCase();
                if(x < y) {
                    return -1;
                }
                if(x > y) {
                    return 1;
                } else {
                    // Tên giống nhau
                    return 0;
                }
            });
            Object.assign((boxComic).style, {
                display: "grid"
            })
            handleRenderComic(arrComic); handleBoxExtra()
        } else if (index == 2) {
           // Sap xep truyện theo the loai
            boxComic.innerHTML = "";
            Object.assign((boxComic).style, {
                display: "block"
            });
            const arrGenre = dataWeb.arrayGenre;
            const lengthGenre = arrGenre.length;
                //Them danh sach truyen theo the loai---
            for (let i = 0; i < lengthGenre; i++) {
                const newArrComic = (arrComic.filter((a) => {
                    return a.listGenre.toLowerCase().includes(arrGenre[i].nameGenre);
                })).sort((a,b) => b.nameChap - a.nameChap);

                const div = document.createElement('div');
                const span = document.createElement('span');
                const p1 = document.createElement('p');
                const p2 = document.createElement('p');
                    span.appendChild(p1);
                    span.appendChild(p2);
                    span.id = arrGenre[i].nameGenre;
                    p1.innerText = (i + 1) + ". " + arrGenre[i].nameGenre ;
                    p2.innerText = " (có " + newArrComic.length + " truyện )" 
                div.className = "genre-wrap";
                div.innerHTML = newArrComic.map(renderComicGenre).join("");
                boxComic.appendChild(span);
                boxComic.appendChild(div);
            }
                // Them danh sach ten theo the loai
            handleBoxExtra();
        } else if (index == 3) {
            // Trả về danh sách các website
            boxComic.innerHTML = "";
            Object.assign((boxComic).style, {
                display: "block"
            });
            for (let i = 0; i < arrWebsite.length; i++) {
                const getNameWeb = arrWebsite[i].nameWeb.toLowerCase();
                const newArrComic = arrComic.filter((item) => {
                    return item.nameHref.toLowerCase().includes(xoa_dau(getNameWeb));
                });
                if (newArrComic.length >= 1) {
                    const span = document.createElement('span');
                    const p1 = document.createElement('p');
                    const p2 = document.createElement('p');
                        span.appendChild(p1);
                        span.appendChild(p2);
                    p1.innerText = i + 1 + ". " + getNameWeb ;
                    p1.id = getNameWeb;
                    p2.innerText = " ( có " + newArrComic.length + " truyện )";
                    const div = document.createElement('div');
                    div.className = "genre-wrap";
                    div.innerHTML = newArrComic.map(renderComicGenre).join("")
                    boxComic.appendChild(span);
                    boxComic.appendChild(div);
                }
            };
            handleBoxExtra();
        };
        function handleRenderComic(arrComic) {
            boxComic.innerHTML = arrComic.map(renderComicGenre).join("");
            insertValueComic(arrComic);
        };
        function renderComicGenre(item) {
            let {nameComic, nameHref, imgHref, nameChap,statusComic,nameCharacter, chapterHref} = item;
            return (`
            <div class="comic-item">
                <div class="comic-i_edit btn">Edit</div>
                <div class="comic-i_infor">
                    <a href= ${nameHref} target="_blank">
                        <img class="ci_infor-img" src= ${imgHref} alt="" >
                        <div class="ci_infor-main">Main: <span>${nameCharacter}</span></div>
                    </a>
                    <p class="ci_infor-status">${statusComic}</p>
                </div>
                <div class="comic-i_name">
                    <a href=${nameHref} target="_blank" class="ci_name-comic name">${nameComic}</a>
                    <a href=${chapterHref} target="_blank" class="ci_name-chap">
                        <div class="cin-chap_name">Đọc tiếp <span>Chương ${nameChap}</span></div>
                        <div class="cin-chap_update"></div>
                    </a>
                </div>
                <div class="comic-i_web"></div>
            </div>
            `)
        };
        function insertValueComic(arrComic) {
            function renderNameLink() {
                const comicItems = zz('.comic-item');
                comicItems.forEach((item, index) => {
                    item.id = arrComic[index].nameComic;
                })
            } renderNameLink();
            function renderDate() {
                // ['8/6/2024', '3:33:59 PM']
                const chapUp = zz('.cin-chap_update');
                // Current time---------------------
                const getToDay = today.split(", ")[0];
                const getToTime = today.split(', ')[1];
                let getToMonth = +getToDay.split('/')[0];
                let getToDate = +getToDay.split('/')[1];
                let getToYear = +getToDay.split('/')[2];
                let getToHour = +getToTime.split(' ')[0].split(":")[0];
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
                    let getPassHour = +getPassTime.split(' ')[0].split(":")[0];
                    let getPassMinute = +getPassTime.split(' ')[0].split(":")[1];
                    let getPassSecond = +getPassTime.split(' ')[0].split(":")[2];
                    let getPassOn = getPassTime.split(' ')[1];
                    function renderTimeComic() {
                        // Time-----------------------------
                        const getYear = getToYear - getPassYear;
                        const getMonth = getToMonth - getPassMonth;
                        const getDate = getToDate - getPassDate;
                        const getHour = getToHour - getPassHour;
                        const getMinute = getToMinute - getPassMinute;
                        const getSecond = getToSecond - getPassSecond;
                        function handleTimeComic() {
                            if (getYear == 0) {
                                if( getMonth == 0) {
                                    if (getDate == 0) {
                                        if (getHour == 0 && getPassOn == getToOn) {
                                            if (getMinute == 0) {
                                                if (getSecond < 1) {
                                                    renderTimeComic1(getSecond + 60, "giây");
                                                } else {
                                                    renderTimeComic1(getSecond , "giây");
                                                }
                                            } else if(getMinute == 1 && getSecond < 0) {
                                                renderTimeComic1(getSecond + 60, "giây");
                                            } else{
                                                renderTimeComic1(getMinute , "phút");
                                            }
                                        } else {
                                            if (getPassOn == getToOn) {
                                                renderTimeComic1(getHour, "giờ");
                                            } else {
                                                renderTimeComic1(getHour + 12, "giờ");
                                            }
                                        }
                                    } else if (getDate <= 14 && getDate > 1){
                                        renderTimeComic1(getDate, "ngày");
                                    } else if (getDate == 1 && getHour < 0 ) {
                                        if (getPassOn == getToOn) {
                                            renderTimeComic1(getHour + 12, "giờ");
                                        } else {
                                            renderTimeComic1(getHour + 24, "giờ");
                                        }
                                    } else {
                                        renderTimeComic1(getDate, "ngày");
                                    }
                                } else if (getMonth == 1 && getDate <0 ){
                                    handleDay(getToMonth, getToYear);
                                } else {
                                    renderTimeComic2(getPassDate, getPassMonth, getPassYear);
                                }
                            } else {
                                renderTimeComic2(getPassDate, getPassMonth, getPassYear);
                            }
                            // ----------------------------------------//
                                function renderTimeComic1(num, text) {
                                    chapUp[i].innerText = num +" " + text + " trước";
                                };
                                function renderTimeComic2(a, b, c) {
                                    const numDate = a < 10 ? "0" + a: a;
                                    const numMonth = b < 10 ? "0" + b : b;
                                    chapUp[i].innerText = numDate + "/ " + numMonth + "/ " + c;
                                };
                                function handleDay(year, month) {
                                    let day;
                                    switch (month) {
                                        case 4: ;case 6: ;case 9: ;case 11: ;
                                            day = 30; insertDay(day)
                                            break;
                                        case 2 :
                                            // nếu năm nhập vào là năm nhuận thì tháng 2 sẽ có 29 ngày
                                            if (year% 4 == 0 ) {
                                                day =  29; insertDay(day);
                                                break;
                                            }
                                            //ngược lại nếu không phải năm nhuận thì tháng 2 sẽ có 28 ngày
                                            else {
                                                day =  28; insertDay(day);
                                                break;
                                            }
                                        default: {
                                            day = 31; insertDay(day);
                                        }   
                                    };
                                    function insertDay(day) {
                                        renderTimeComic1(getDate + day, "ngày")
                                    }
                                };
                        } handleTimeComic();
                    } renderTimeComic();
                }
            } renderDate();
            function renderAnotherWeb() {
                const comicWeb = zz('.comic-i_web');
                for (let i = 0; i <arrComic.length; i++) {
                    let nameWeb = arrComic[i].listWeb[0].nameWeb;
                    if (nameWeb.length != 0) {
                        let p = document.createElement('p');
                        p.innerText = "Phiên bản khác";
                        let a = document.createElement('a');
                        a.target = "_blank";
                        a.innerText = arrComic[i].listWeb[0].nameWeb;
                        a.href = arrComic[i].listWeb[0].linkWeb;
                        comicWeb[i].appendChild(p);
                        comicWeb[i].appendChild(a);
                    }
                }
            } renderAnotherWeb();
        };
    } handleArrComic(idFilter)
};
/* -------------------------------------------------------------------*/
    // Ham xu ly cac website-----------------------
function handleBoxWebsite(arrWebsite) {
    const inputs = zz('.box-web_input input');
    const btnWeb = z('.btn-web');
    const extraWeb = zz('.extra-web span');
    const webBox = z('.box-web_list');
    function eventExtraWeb() {
        arrWebsite.length >= 1 ? (renderWebsite(), moveMouseEnter()): renderEmty();
        function moveMouseEnter() {
            const webBtns = zz('.box-web_list a');
            webBtns.forEach((btn, index) => {
                btn.onmouseenter = () => {
                    inputs[0].value = arrWebsite[index].nameWeb;
                    inputs[1].value = arrWebsite[index].linkWeb;
                    extraWeb[1].innerText = "Sửa trang Web";
                    extraWeb[1].classList.remove('close');
                    extraWeb[2].classList.remove('close');
                    extraWeb[0].onclick = () => {
                        extraWeb[1].classList.add('close');
                        extraWeb[2].classList.add('close');
                        inputs[0].value = ""; inputs[1].value = "";
                        extraWeb[0].onclick = () => {postWeb(arrWebsite)};
                    };
                    extraWeb[1].onclick = () => {
                        let getNameWeb = webBtns[index].innerText;
                        const getIdWeb = arrWebsite.findIndex((item) => {
                            return item.nameWeb.toLowerCase().includes(getNameWeb);
                        })
                        arrWebsite.splice(getIdWeb, 1 );
                        postWeb(arrWebsite);
                    };
                    extraWeb[2].onclick = () => {
                        let getNameWeb = webBtns[index].innerText;
                        const getIdWeb = arrWebsite.findIndex((item) => {
                            return item.nameWeb.toLowerCase().includes(getNameWeb);
                        })
                        arrWebsite.splice(getIdWeb, 1 );
                        let x = confirm("Bạn có muốn xóa '" + getNameWeb + "' khỏi danh sách website hiện tại không?");
                        if(x == 1) {
                            dataWeb.arrayWebsite = arrWebsite;
                            postApi("dataWeb", dataWeb);
                            location.reload();
                        } else{
                            console.log("Không cập nhật!");
                        }
                    }
                }
            });
            extraWeb[0].onclick = () => {postWeb(arrWebsite)};
        } ;
        extraWeb[0].onclick = () => {postWeb(arrWebsite)};
        function postWeb(arrWebsite) {
            let obj = {
                nameWeb: inputs[0].value.length >=5 ? inputs[0].value : "readicWeb",
                linkWeb: inputs[1].value.length >=5 ? inputs[1].value : "#"
            }
            if (inputs[1].value.length >=5) {
                arrWebsite.push(obj);
                dataWeb.arrayWebsite = arrWebsite;
                    postApi("dataWeb", dataWeb);
                location.reload();
            }
        } postWeb();
        function renderEmty() {
            webBox.innerText = "Bạn vẫn chưa thêm website!"
        }
    } eventExtraWeb();
    function eventPostWeb() {
        inputs[2].oninput = () => {
            btnWeb.onclick = () => {
                let getValue = inputs[2].value;
                if (getValue.includes("[")){
                    let x = confirm("Bạn có muốn cập nhật danh sách website hiện tại không?");
                    if(x == 1) {
                        dataWeb.arrayWebsite = JSON.parse(getValue);
                        postApi("dataWeb", dataWeb);
                        location.reload();
                    } else{
                        console.log("Không cập nhật!");
                    }
                }
            }
        }
    } eventPostWeb();
    function renderWebsite() {
        webBox.innerHTML = arrWebsite.map((item) => {
            let {nameWeb, linkWeb} = item;
            return (`
                <a href=${linkWeb} target="_blank">${nameWeb}</a>
            `)
        }).join("");
        inputs[2].value = JSON.stringify(arrWebsite);
    } ;
};
/* -------------------------------------------------------------------*/
    // Ham xu ly hop noi dung truyen---------------
function handleBoxExtra() {
    const extraBtns = zz('.extra-btn');
    const editBtns = zz('.comic-i_edit');
    const listNameComic = zz('.ci_name-comic');
    const postBtn = z('.box-extra_btn')
    const delBtn = z('.bec-handle_del');
    const statusComic = z('#status-comic');
    const title = z('.box-extra_title');
    const anotherBtn = z('.be_status-link');
    // -----------------------
    const inputs = zz('form input');
    const nameC = z('.be_col-name');
    const imgC = z('.be_col-img');
    // -----------------------
    function displayElement() {
        extraBtns.forEach((btn) => {
            btn.onclick = () => {
                openBox();
                getValueComic();
            };
        });
        arrComic.length >= 1 ?  editBtns.forEach((btn, index) => {
            btn.onclick = () => {
                const getNameComic = listNameComic[index].innerText.toLowerCase();
                const idArr = arrComic.findIndex((item) => {
                    return item.nameComic.toLowerCase().includes(getNameComic);
                })
                renderValueComic(idArr); openBox(); 
            };
        }) : console.log("Chưa có dữ liệu!");
        anotherBtn.onclick = () => {z('.be_another-wrap').classList.remove('close')};
        // // -----------------------
        function openBox() {
            boxExtra.classList.remove('close');
            overLay.classList.remove('close');
        };
    } displayElement();
    function renderValueComic(index) {
        let nowComic = arrComic[index];
        function renderInput() {
            inputs[0].value = nowComic.nameComic;
            inputs[1].value = nowComic.nameCharacter;
            inputs[2].value = nowComic.nameHref;
            inputs[3].value = nowComic.imgHref;
            inputs[4].value = nowComic.listGenre;
            inputs[5].value = nowComic.nameChap;
            inputs[6].value = nowComic.listWeb[0].nameWeb;
            inputs[7].value = nowComic.listWeb[0].linkWeb;
            imgC.src= nowComic.imgHref;
            nameC.innerText = nowComic.nameComic
        } renderInput();
        function renderValue() {
            title.innerText = "Sửa truyện tranh";
            postBtn.innerText = "Cập nhật truyện";
            delBtn.classList.remove('close');
        } renderValue();
        postBtn.onclick = () => {
            let removeComic = arrComic.findIndex(item => item.nameComic == nowComic.nameComic);
            arrComic.splice(removeComic, 1 );
                handleChapHref (inputs[2].value, inputs[5].value);
            arrComic.push(getValueInput());
            dataWeb.arrayComic = arrComic;
                postApi("dataWeb", dataWeb);
            location.reload();
        }
        // Xoa phan tu trong mang
        delBtn.onclick = ()=> {
            const ans = confirm("Bạn có muốn xóa truyện " + arrComic[index].nameComic + " hay không?");
            if (ans == 1) {
                dataWeb.arrayComic == replaceComic()
                postApi("dataWeb", dataWeb);
                location.reload();
            } else{console.log("NO DELETE")}
        }
        // Mang thay the
        function replaceComic() {
            let removeComic = arrComic.findIndex(item => item.nameComic == nowComic.nameComic);
            arrComic.splice(removeComic, 1 );
            return arrComic;
        }
    } ;
    function getValueComic() {
        function newInput() {
            for( let i = 0; i< inputs.length; i++ ) {
                inputs[i].value = "";
            }
            title.innerText = "Thêm truyện tranh mới!";
            postBtn.innerText = "Thêm truyện";
            delBtn.classList.add('close');
            nameC.innerText = "ReadicName";
            imgC.src = "src/img/29_10_2021(1).jpg";
        } newInput();
        function renderValue() {
            inputs[0].oninput = () => nameC.innerText = inputs[0].value;
            inputs[3].oninput = () => imgC.src = inputs[3].value;
        } renderValue();
        postBtn.onclick = () => {
            handleChapHref (inputs[2].value, inputs[5].value);
            arrComic.push(getValueInput());
            dataWeb.arrayComic = arrComic;
            postApi("dataWeb", dataWeb);
            location.reload();
        };
    } 
    // handleChapHref()---
    function getValueInput() {
        let x =  {
            nameComic: inputs[0].value,
            nameCharacter: inputs[1].value.length >= 1 ? inputs[1].value : "ReadicChar",
            nameHref: inputs[2].value,
            imgHref: inputs[3].value.length >= 10 ? inputs[3].value : "src/img/29_10_2021(1).jpg",
            listGenre: inputs[4].value.length >= 1 ? inputs[4].value : "Truyện tranh",
            nameChap: inputs[5].value.length >=1 ? inputs[5].value: 1,
            chapterHref: getApi("dataWeb").statusWeb.chapterHref, 
            arrayGenre: inputs[4].value.length >= 1 ? inputs[4].value.split(', ') : ["Truyện"],
            listWeb: [
                {   nameWeb: inputs[6].value,
                    linkWeb: inputs[7].value
                }
            ],
            statusComic: statusComic.value,
            updateChap: new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}),
        }
        return x;
    };   
} handleBoxExtra();
/* -------------------------------------------------------------------*/
    // Bat tat den---------------------------------
function ligthToggle() {
    const statusBtn = zz('.ci_infor-status');
    setInterval(()=> {
        for (let i = 0; i< statusBtn.length; i++) {
            statusBtn[i].classList.toggle('light')
        }
    }, 500)
} ligthToggle();
/* -------------------------------------------------------------------*/
    // Ham xu ly nguoi dung them mang truyen-------
function handlePostApi() {
    const inputs = zz('.box-inf label input');
    const listComic = JSON.stringify(arrComic);
    const postBtn = z('.bx_col-btn');
    inputs[0].value = listComic;
    postBtn.onclick = () => {
        let getValue = inputs[1].value;
        if (getValue.includes("[")){
            let x = confirm("Bạn có muốn cập nhật mảng truyện tranh không?");
            if(x == 1) {
                dataWeb.arrayComic = JSON.parse(getValue);
                postApi("dataWeb", dataWeb);
                location.reload();
            } else{
                console.log("Không cập nhật!");
            }
        }
    }
} handlePostApi();
/* -------------------------------------------------------------------*/
function handleBoxNav() {
    const getIdFilter = getApi("dataWeb").statusWeb.idFilter;
    const getIdRandom = getApi("dataWeb").statusWeb.idRandom;
    const getIdRespon = getApi("dataWeb").statusWeb.idRespon;
    const getArrGenre = getApi("dataWeb").arrayGenre;
    const input = z('.box-nav_input');
    const boxNavTitle = z('.box-nav_title');
    // arrComic, arrWebsite, 
    const boxItem = z('.box-nav_item');
    if      (getIdFilter == 0) {renderFilterChap()}
    else if (getIdFilter == 1) {renderFilterAlpha()}
    else if (getIdFilter == 2) {renderListGenre()}
    else                       {renderListWeb()};
        // Danh sach the loai truyen---
        function renderListGenre() {
            // const getGenre = getArrGenre[getIdRandom].nameGenre;
            boxItem.innerHTML = getArrGenre.map(renderList).join("");
                getIdRespon == 1 ? (
                    boxItem.style = "grid-template-columns: repeat(2, 1fr)"
                ) : boxItem.style = "grid-template-columns: repeat(4, 1fr)"
            boxNavTitle.innerText = "Danh sách thể loại truyện!";
            input.setAttribute("placeholder", "Nhập thể loại bạn muốn tìm...")
            function renderList(item) {
                const {nameGenre} = item;
                return (`
                    <a class="btn">${nameGenre}</a>
                `)
            };
            function handleSearch() {
                input.oninput = () => {
                    const getValue = input.value.toLowerCase();
                    let getNewGenre = getArrGenre.filter((item) => {
                        return item.nameGenre.toLowerCase().includes(getValue);
                    })
                    boxItem.innerHTML = getNewGenre.map(renderList).join("");
                    renderExtraInfor(getNewGenre, 0);
                }
            } handleSearch();
            // Them thong tin 
            function renderExtraInfor(arrayGenre, idGenre) {
                for(let i = 0; i < arrayGenre.length; i++) {
                    zz('.box-nav_item a')[i].href = "#" + arrayGenre[i].nameGenre;
                };
                arrayGenre.length >=1 ? (
                    zz('.box-nav_item a')[idGenre].classList.add('choose')
                ) : console.log("Không tìm thấy thể loại bạn nhập!");
                zz('.box-nav_item a').forEach((ele) => {
                    ele.onclick = () => {
                        z('.box-nav_item a.choose').classList.remove('choose');
                        ele.classList.add('choose');
                    }
                })
            } renderExtraInfor(getArrGenre, getIdRandom);
        };
        // Danh sach website-----------
        function renderListWeb() {
            let arrayWeb = [];
                getIdRespon == 1 ? (
                    boxItem.style = "grid-template-columns: repeat(2, 1fr)"
                ) : boxItem.style = "grid-template-columns: repeat(3, 1fr)"
                boxNavTitle.innerText = "Danh sách Website truyện!";
                input.setAttribute("placeholder", "Nhập website bạn muốn tìm...");
            // Tim ra danh sach website-------
            for (let i = 0; i < arrWebsite.length; i++) {
                const getNameWeb = arrWebsite[i].nameWeb.toLowerCase();
                const newArrComic = arrComic.filter((item) => {
                    return item.nameHref.toLowerCase().includes(xoa_dau(getNameWeb));
                });
                if (newArrComic.length >= 1) {
                    let x = {nameWeb: getNameWeb};
                    arrayWeb.push(x);
                }
            };
            boxItem.innerHTML = arrayWeb.map(renderListWeb).join("");
            function renderListWeb(item) {
                const {nameWeb} = item;
                return (`
                    <a class="btn">${nameWeb}</a>
                `)
            }
            function renderExtraInfor(array, index) {
                for(let i = 0; i < array.length; i++) {
                    zz('.box-nav_item a')[i].href = "#" + array[i].nameWeb;
                };
                array.length >=1 ? (
                    zz('.box-nav_item a')[index].classList.add('choose')
                ) : console.log("Không thể tìm thấy website bạn nhập")
                zz('.box-nav_item a').forEach((ele) => {
                    ele.onclick = () => {
                        z('.box-nav_item a.choose').classList.remove('choose');
                        ele.classList.add('choose')
                    }
                });
            } renderExtraInfor(arrayWeb, 0);
            function handleSearch() {
                input.oninput = () => {
                    const getValue = input.value.toLowerCase();
                    let getNewWeb = arrayWeb.filter((item) => {
                        return item.nameWeb.toLowerCase().includes(getValue);
                    })
                    boxItem.innerHTML = getNewWeb.map(renderListWeb).join("");
                    renderExtraInfor(getNewWeb, 0);
                }
            } handleSearch();
        };
        // Danh sach truyen theo alpha-
        function renderFilterAlpha() {
            // const a = "Nguyễn Văn Hoàng";
            // for (var x of a) {
            //     console.log(x);
            // }
        }
        // Danh sach cac chuong-------
        function renderFilterChap() {
        }
} handleBoxNav();
/* -------------------------------------------------------------------*/
    // Ham dung de an hien phan tu---------------------
function handleDisplayElement() {
    const navIcons = zz('#web-fixed i');
    const btnClose = z('.box-nav_close');
    const genreBtn = z('.genre-web');
    const numNav = navIcons.length;
    function toggleNavIcon() {
        navIcons[0].onclick = () => {showIcon()};
        navIcons[1].onclick = () => {hideIcon()};
        navIcons[2].onclick = () => {hideIcon()};
        navIcons[3].onclick = () => {hideIcon()};
        navIcons[4].onclick = () => {showBoxNav()};
    } toggleNavIcon();
        function showIcon() {
            navIcons[0].classList.add('close');
            navIcons[1].classList.remove('close');
            for (let i = 2; i < numNav; i++) {
                navIcons[i].classList.remove('close');
            }
        }
        function hideIcon() {
            navIcons[0].classList.remove('close');
            navIcons[1].classList.add('close');
            z('.list-nav').style="display: none";
            for (let i = 2; i < numNav; i++) {
                navIcons[i].classList.add('close');
            }
        }
        function showBoxNav() {
            boxNav.style = "left: 0px";
            overLay.classList.remove('close');
            hideIcon();
        };
        function hideBoxNav() {
            boxNav.style = "left: -600px";
            overLay.classList.add('close');
        }
    // Cac chuc nang khi responsive---------------------------
    size < 479 ? handleNavWeb() : (
        dataWeb.statusWeb.idRespon = 0,
        postApi("dataWeb", dataWeb) // ("Tablet or Laptop")
    );
    function handleNavWeb() {
        dataWeb.statusWeb.idRespon = 1;
        postApi("dataWeb", dataWeb);
        $("#comic-head .col").click(function() {
            $(".list-nav").slideToggle();
        })
    } ;
    // Nut the loai tren nav----------------------------------
    genreBtn.onclick = () => {
        dataWeb.statusWeb.idFilter = 2;
        postApi("dataWeb", dataWeb);
        showBoxNav();  handleBoxNav();
        // z('.sld.choose').classList.remove('choose');
        // z('.comic_nav-genre').classList.add('choose');
    };
    // Su kien khi ban click vao lop phu----------------------
    overLay.onclick = () => {
        hideBoxNav(); hideIcon();
        overLay.classList.add('close');
        z('.box-extra').classList.add('close');
        z('.list-nav').style="display: none";
    }
    // Nut dong trong box extra ------------------------------
    const boxExtraClose = z('.bec-handle_clo');
    boxExtraClose.onclick = () => {
        z('.box-extra').classList.add('close');
        overLay.classList.add('close');
    }
    // Nut dong trong box nav----------------------------------
    btnClose.onclick = () => {hideBoxNav()};
    
} handleDisplayElement();
/* -------------------------------------------------------------------*/
