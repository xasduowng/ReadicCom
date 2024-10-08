import {getApi, postApi, xoa_dau, handleChapHref, renderDate} from "./function.js";
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
        "arrayHistory": [],
        "statusWeb": {
            chapterHref: "none",
            idFilter: 0,
            idComic: "none",
            idRespon: 1,
            idSearch: 0
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
const size = screen.width; const dataWeb = getApi ("dataWeb");
const idFilter = (dataWeb.statusWeb).idFilter;
const arrHistory = dataWeb.arrayHistory;
const arrWebsite = dataWeb.arrayWebsite;
var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
handleBoxWebsite(arrWebsite);
const arrComic = dataWeb.arrayComic;
    arrComic.length >= 1 ? (handleBoxComic(arrComic, idFilter), handleBoxGenre())
        : console.log("Chưa có dữ liệu!");

// Ham xu ly o tim kiem---------------------------------------------//
function handleBoxSearch() {
    const getIdSearch = getApi ("dataWeb").statusWeb.idSearch;
    const searchStyle = zz('.head_search-style p');
    const inputSearch = z('.comic-head_search input');
    const boxComicSearch = z('.search-box_comic');
    const searchTitle = z('.search-box_title');
    const headSearchBox = z('.head_search-box');

    (function displayElement() {
        $('.search-icon_open').click(function() {
            $(".search-icon_close").show();
            $('.search-icon_open').hide();
            $(".head_search-style").fadeIn();
        })
        $('.search-icon_close').click(function() {
            $(".search-icon_close").hide();
            $('.search-icon_open').show();
            $(".head_search-style").fadeOut();
        })
    }) ();
    function handleEventStyle() {
        searchStyle[getIdSearch].classList.add('choose');
        inputSearch.placeholder = searchStyle[getIdSearch].innerText + "...";
        searchStyle.forEach((ele, index) => {
            ele.onclick = () => {
                z('.head_search-style p.choose').classList.remove('choose');
                ele.classList.add('choose');
                inputSearch.placeholder = searchStyle[index].innerText + "...";
                handleEventSearch(index);
                dataWeb.statusWeb.idSearch = index;
                postApi('dataWeb', dataWeb);
                // ----------------//
                z('.head_search-style').style = "display: none";
                z('.search-icon_open').style = "display: block";
                z('.search-icon_close').style = "display: none";
            }
        });
    } handleEventStyle();
    function handleEventSearch(index) {
        inputSearch.oninput = () => {
            let getValue = xoa_dau(inputSearch.value);
            headSearchBox.classList.remove("close");
            z('.head_search-clear').classList.remove('close');
            if (index == 0) {
                let newArrComic = arrComic.filter((item) => {
                    return xoa_dau(item.nameComic.toLowerCase()).includes(getValue);
                });
                renderComicSearch(newArrComic, getValue);
            } else if (index == 1) {
                let newArrComic = arrComic.filter((item) => {
                    return xoa_dau(item.listGenre.toLowerCase()).includes(getValue);
                });
                renderComicSearch(newArrComic, getValue);
            } else if (index == 2) {
                let newArrComic = arrComic.filter((item) => {
                    return +item.nameChap >= inputSearch.value;
                });
                renderComicSearch(newArrComic, getValue);
            } else {
                let newArrComic = arrComic.filter((item) => {
                    return xoa_dau(item.nameCharacter.toLowerCase()).includes(getValue);
                });
                renderComicSearch(newArrComic, getValue);
            }
        };
        function renderComicSearch(arr, getValue) {
            if (arr != []) {
                const newArr = arr.sort((a, b) => b.nameChap - a.nameChap);
                searchTitle.innerText = "Đã tìm thấy truyện! Có tổng cộng " + newArr.length + " truyện được tìm thấy."
                boxComicSearch.innerHTML = newArr.map((item) => {
                    const {nameComic, listGenre, nameChap, imgHref, nameCharacter} = item;
                    return (`
                        <a href="" class="sb_comic-item">
                            <img src=${imgHref} alt="">
                            <div class="sb_comic-item_wrap">
                                <p>${nameComic}</p>
                                <p>${listGenre}</p>
                                <p>Chương ${nameChap}</p>
                                <p>${nameCharacter}</p>
                            </div>
                        </a>
                    `)
                }).join("")
                for (let i = 0; i < newArr.length; i++) {
                    zz('.search-box_comic a')[i].href = "#" + newArr[i].nameComic;
                }
            } else {
                searchTitle.innerText = "Không tìm thấy truyện!! Vui lòng nhập từ khóa khác."
            };
            z('.head_search-clear').onclick = () => {
                inputSearch.value = "";
                headSearchBox.classList.add("close");
                z('.head_search-clear').classList.add('close');
            }
            if (getValue.length == 0) {
                headSearchBox.classList.add("close");
                z('.head_search-clear').classList.add('close');
            }
        } 
    } handleEventSearch(getIdSearch);
} handleBoxSearch();
// Ham xu ly hop the loai--------------------------------------------//
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
    let rd1 = Math.floor(Math.random()*arrGenre.length);
        dataWeb.arrayGenre = arrGenre;
    let genre = arrGenre[rd1].nameGenre.toLowerCase();
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
                        setInterval(insertValue, 20000);
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
                            const a = document.createElement('a');
                            a.innerText = arrGenre[i];
                            a.href = "#" + arrGenre[i].toLowerCase();
                            if (arrGenre[i].toLowerCase() == genre) {
                                a.classList.add('choose');
                            }
                            spans[4].appendChild(a)
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
}
// Ham xu ly tra ve danh sach truyen--------------------------------//
function handleBoxComic(arrComic, idFilter) {
    const boxComic = z('.box-comic');
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
            handleArrComic(index); handleBoxNav(index);

        }
    });   
    function handleArrComic(index) {
        if (index == 0) {
            // Sắp xếp theo số chương
            arrComic.sort((a, b)=>{
                return b.nameChap - a.nameChap;
            });
            Object.assign((boxComic).style, {
                display: "grid"
            })
            handleRenderComic(arrComic);
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
            handleRenderComic(arrComic);
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
                }).sort((a,b) => b.nameChap - a.nameChap);
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
        };
         // Them danh sach ten theo the loai
        handleBoxExtra(); handleComicHistory();
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
            // Them gia tri cap nhat truyen-------------------------
            const chapUp = zz('.cin-chap_update');
            renderDate(chapUp, arrComic, today);
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
    } handleArrComic(idFilter);
};
// Ham xu ly tra ve danh sach truyen--------------------------------//
function handleComicHistory() {
    const comicItem = zz('.comic-item');
    const listImg = zz('.ci_infor-img');
    const listName = zz('.ci_name-comic');
    const listChap = zz('.ci_name-chap');
    const boxList = z('.comic_genre-list');
    function handleEventClick(items) {
        items.forEach((ele, index) => {
            ele.onclick = () => {
                const getNameComic = (zz('.ci_name-comic')[index].innerText).toLowerCase();
                const currentComic = arrComic.filter((item) => {
                    return item.nameComic.toLowerCase().includes(getNameComic);
                });
                let removeHistory = arrHistory.findIndex(item => item.nameComic == currentComic[0].nameComic);
                if (removeHistory != -1) {
                    arrHistory.splice(removeHistory, 1);
                    arrHistory.push(currentComic[0]);
                    handleReduceArr(arrHistory);
                } else {
                    arrHistory.push(currentComic[0]);
                    handleReduceArr(arrHistory);
                };
            }
        }); 
    } handleEventClick(listImg); handleEventClick(listName); handleEventClick(listChap); 
    function handleReduceArr(arrHistory) {
        let array = [];
        let length = arrHistory.length;
        if (length > 6) {
            for (let i = length-1 ; i > length -7; i--) {
                array.push(arrHistory[i]);
            }
            renderComicGenre(array); // renderListHistory(array)
            dataWeb.arrayHistory = array;
            postApi("dataWeb", dataWeb);
        } else {
            renderComicGenre(arrHistory); // renderListHistory(arrHistory);
            dataWeb.arrayHistory = arrHistory;
            postApi("dataWeb", dataWeb);
        }
    } handleReduceArr(arrHistory);
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
                        <a href=${chapterHref} class="genre-box_chap" target="_blank">Đọc từ chương ${nameChap}</a>
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
    };
    function renderListHistory(arr) {
        boxList.innerHTML = arr.map(item => {
            const {nameComic, chapterHref, nameChap, nameHref} = item;
            return (`
                <div class="genre-list_item">
                    <a href=${nameHref}>${nameComic}</a>
                    <a href=${chapterHref}>Đọc tiếp chương <span>${nameChap}</span></a>-
                    <p>Cập nhật lúc : <span></span></p>
                </div>
            `)
        }).join("");
        const listUpdate = zz('.genre-list_item p > span');
        renderDate(listUpdate, arr, today);
    }
} ;
// Ham xu ly cac website--------------------------------------------//
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
// Ham xu ly hop noi dung truyen------------------------------------//
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
            // Xu ly gia tri truyen trong phan lich su
            let removeHistory = arrHistory.findIndex(item => item.nameComic == nowComic.nameComic);
            if (removeHistory != -1) {
                arrHistory.splice(removeHistory, 1);
                arrHistory.push(getValueInput());
                dataWeb.arrayHistory = arrComic;
                postApi("dataWeb", dataWeb);
            };
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
// Ham dung de them danh sach the loai, so chuong-------------------//
function handleBoxNav(index) {
    const titleNav = z('.box-nav_title span');
    const boxNavItem = z('.box-nav_item');
    const inputSearch = z('.box-nav_input');
    const getArrGenre = dataWeb.arrayGenre;
    const getArrComic = dataWeb.arrayComic;
    // Cac ham de tra ve gia tri truyen
    if (index == 0)         { handleNavChap();
    } else if(index == 1)   { handleNavAlpha();
    } else if(index == 2 )  { handleNavGenre();
    } else                  { handleNavWeb()};
    function handleNavGenre() {
        const length = getArrGenre.length;
        inputSearch.style = "display:block";
        boxNavItem.innerHTML = getArrGenre.map(renderGenre).join("");   
        titleNav.innerText = "Thể loại"   
        function searchInput() {
            inputSearch.oninput = () => {
                const getValue = inputSearch.value;
                const newArray = getArrGenre.filter((item) => {
                    return item.nameGenre.toLowerCase().includes(getValue);
                });
                if (newArray.length == 0) {
                    boxNavItem.style= "display:block";
                    boxNavItem.innerHTML =  "Không thể tìm thấy thể loại bạn nhập!";
                } else {
                    boxNavItem.style= "display:grid";
                    boxNavItem.innerHTML = newArray.map(renderGenre).join("");
                    insertInfor(newArray);
                }
            }
        } searchInput();
        function insertInfor (arrayGenre) {
            const getNum = zz('.nav_item-num');
            const getLink = zz('.box-nav_item a');
            for(let i = 0; i < length; i++) {
                const getGenre = arrayGenre[i].nameGenre;
                getLink[i].href = "#" + getGenre;
                const array = getArrComic.filter((item) => {
                    return item.listGenre.toLowerCase().includes(getGenre)
                })
                if (array.length > 1) { getNum[i].innerText = array.length};
            };
        } insertInfor(getArrGenre);
        function renderGenre(item) {
            const {nameGenre} = item;
            return (`
                <div>
                    <a href="">${nameGenre}
                        <p class="nav_item-num"></p>
                    </a>
                </div>
            `)
        }

    };
    function handleNavChap() {
        titleNav.innerText = "Số chương";
        inputSearch.style = "display:none";
        const arrTitle = [
            {nameItem: "Trên 500", value: [500, 5000]},
            {nameItem: "300 - 500",value: [300, 499]},
            {nameItem: "201 - 300",value: [200, 299]},
            {nameItem: "101 - 200",value: [100, 199]},
            {nameItem: "50 - 100",value: [50, 99]},
            {nameItem: "Dưới 50",value: [0, 49]}
        ];
        boxNavItem.innerHTML = arrTitle.map(renderItem).join("");  
        function insertInfor () {
            const length = arrTitle.length;
            const getNum = zz('.nav_item-num');
            const getLink = zz('.box-nav_item a');
            for (let i = 0; i < length; i++ ) {
                const newArr = getArrComic.filter(item => {
                    return item.nameChap > arrTitle[i].value[0] && item.nameChap < arrTitle[i].value[1]
                })
                getNum[i].innerText = newArr.length;
                const getNameComic = newArr[0].nameComic;
                getLink[i].href = "#" + getNameComic;
            }
            
        } insertInfor(); 
    };
    function handleNavAlpha() {
        titleNav.innerText = "Xếp theo Alpha";
        const length = getArrComic.length;
        const array = [];
        for (let i = 0; i < length; i++) {
            const nameComic = getArrComic[i].nameComic;
            const arrName = nameComic.split("")[0];
            array.push(arrName);
        };
        const arrayAlpha = (Array.from(new Set(array))).sort();
        const newArray = [];
        for (let j = 0; j < arrayAlpha.length; j++) {
            newArray.push ({nameItem: arrayAlpha[j]})

        };
        boxNavItem.innerHTML = newArray.map(renderItem).join("");  
        function insertInfor () {
            const getNum = zz('.nav_item-num');
            const getLink = zz('.box-nav_item a');   
        } insertInfor(); 
    };
    function handleNavWeb() {
        inputSearch.style = "display: none";
        titleNav.innerText = "Website";
        const webLength = arrWebsite.length;
        const arrWeb = [];
        for (let i = 0; i < webLength; i++) {
            const getNameWeb = arrWebsite[i].nameWeb.toLowerCase();
            const newArrComic = getArrComic.filter((item) => {
                return item.nameHref.toLowerCase().includes(xoa_dau(getNameWeb));
            });
            if (newArrComic.length >= 1) {
                arrWeb.push({
                    nameItem: arrWebsite[i].nameWeb,
                    lengthItem: newArrComic.length
                })
            }
        };
        boxNavItem.innerHTML = arrWeb.map(renderItem).join("");  
        function insertInfor () {
            const getNum = zz('.nav_item-num');
            const getLink = zz('.box-nav_item a');
            for (let i = 0; i < arrWeb.length; i++) {
                getNum[i].innerText = arrWeb[i].lengthItem;
                getLink[i].href = "#" + arrWeb[i].nameItem.toLowerCase();
            }  
        } insertInfor();
    }; 
        function renderItem(item) {
            const {nameItem} = item;
            return (`
                <div>
                    <a href="">${nameItem}<p class="nav_item-num"></p></a>
                </div>
            `)
        }
} handleBoxNav(idFilter);
// Bat tat den------------------------------------------------------//
function ligthToggle() {
    const statusBtn = zz('.ci_infor-status');
    setInterval(()=> {
        for (let i = 0; i< statusBtn.length; i++) {
            statusBtn[i].classList.toggle('light')
        }
    }, 500)
} ligthToggle();
// Ham xu ly nguoi dung them mang truyen----------------------------//
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
// Ham dung de an hien phan tu--------------------------------------//
function handleDisplayElement() {
    const navIcons = zz('#web-fixed i');
    const genreBtn = z('.genre-web');
    const numNav = navIcons.length;
    let getIdRespon = getApi("dataWeb").statusWeb.idRespon;
    function toggleNavIcon() {
        navIcons[0].onclick = () => {showIcon()};
        navIcons[1].onclick = () => {hideIcon()};
        navIcons[2].onclick = () => {hideIcon()};
        navIcons[3].onclick = () => {hideIcon()};
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
            if (getIdRespon == 1) {(z('.list-nav').style="display: none")} 
            for (let i = 2; i < numNav; i++) {
                navIcons[i].classList.add('close');
            }
        }
    // Cac chuc nang khi responsive---------------------------
    size < 479 ? handleNavWeb() : (
        dataWeb.statusWeb.idRespon = 0,
        postApi("dataWeb", dataWeb) // ("Tablet or Laptop")
    );
    function handleNavWeb() {
        $(".comic-head_logo").click(function() {
            $(".list-nav").slideToggle();
            $(".comic-head_search").slideUp();
        });
        $(".search-icon").click(function() {
            $(".comic-head_search").slideToggle();
            $(".list-nav").slideUp();
        }) 
    } ;
    // Nut the loai tren nav----------------------------------
    genreBtn.onclick = () => {
        dataWeb.statusWeb.idFilter = 2;
        postApi("dataWeb", dataWeb);
    };
    // Su kien khi ban click vao lop phu----------------------
    overLay.onclick = () => {
        hideIcon();
        overLay.classList.add('close');
        z("#box-nav").classList.add('close');
        z('.list-nav').style = "display: none";
        z('.box-extra').classList.add('close');
        getIdRespon == 1 ? (z('.list-nav').style="display: none") : console.log("Unknown");
    }
    // Nut dong trong box extra ------------------------------
    const boxExtraClose = z('.bec-handle_clo');
    boxExtraClose.onclick = () => {
        z('.box-extra').classList.add('close');
        overLay.classList.add('close');
    };
    // Nut dong trong nav
    const closeBtn = z('.box-nav_close');
    z('.fa-list').onclick = () => {
        z("#box-nav").classList.remove('close');
        z("#overlay").classList.remove('close');
    }
    closeBtn.onclick = () => {
        z("#box-nav").classList.add('close');
        z("#overlay").classList.add('close');
        hideIcon();
    }
    z('.genre-web').onclick = () => {
        z("#box-nav").classList.remove('close');
        z("#overlay").classList.remove('close');
    }
} handleDisplayElement();