import {getApi, postApi, xoa_dau} from "./function.js";
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
            idRandom: "none"

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
const boxGenre = z('.box-genre_list');
const size = screen.width; 
const navIcon = zz('.nav-icon');
const boxNav = z('#box-nav');
const btnNav = z('.box-nav_close');
/* -------------------------------------------------------------------*/
function handleNavIcon() {
    navIcon[0].onclick = () => {openNav()};
    navIcon[3].onclick = () => {closeNav()};
    for (let i = 2; i < (navIcon.length); i++) {
        navIcon[i].onclick = () => {closeNav();}
    }
    function closeNav() {
        navIcon[0].classList.remove('close');
        for (let i = 1; i < (navIcon.length); i++) {
            navIcon[i].classList.add('close');
        }
    };
    function openNav() {
        navIcon[0].classList.add('close');
        for (let i = 1; i < navIcon.length; i++) {
            navIcon[i].classList.remove('close');
        }
    };
    navIcon[5].onclick = () => {
        boxNav.style = "left: 0"
        overLay.classList.remove('close')
    }
    btnNav.onclick = () => {
        boxNav.style = "left: -600px";
        overLay.classList.remove('close');
    }
    z('.genre-web').onclick = () => {
        boxNav.style = "left: 0"
        overLay.classList.remove('close')
    }
} handleNavIcon();
/* -------------------------------------------------------------------*/
function handleNavWeb() {
    if (size < 479) {
        const nav = z('#comic-head .col');
        nav.onclick = () => {z('.list-nav').classList.toggle('open');}
        z('.genre-web').onclick = () => {
            boxGenre.classList.add('open');
            z('.list-nav').classList.toggle('open');
            overLay.classList.remove('close');
        }
        overLay.onclick = () => {
            overLay.classList.add('close');
            boxGenre.classList.remove('open');
            boxExtra.classList.add('close');
        }
        z('.bg_list-close').onclick = () => {
            boxGenre.classList.remove('open');
            boxExtra.classList.add('close')
            z('.list-nav').classList.remove('open');
            overLay.classList.add('close');
        }
        zz('.list-nav_btn a').forEach((btn) => {
            btn.onclick = () => {
                z('.list-nav').classList.remove('open');
            }
        })
    }
} handleNavWeb();
/* -------------------------------------------------------------------*/
const dataWeb = getApi ("dataWeb");
const idFilter = (dataWeb.statusWeb).idFilter;
const arrWebsite = dataWeb.arrayWebsite;
handleBoxWebsite(arrWebsite);
const arrComic = dataWeb.arrayComic;
    arrComic.length >= 1 ? (handleBoxComic(arrComic, idFilter), handleBoxGenre())
        : console.log("Chưa có dữ liệu!");
/* -------------------------------------------------------------------*/
function handleBoxGenre() {
    function getArrGenre() {
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
    const arrGenre = getArrGenre();
    dataWeb.arrayGenre = arrGenre;
    postApi("dataWeb", dataWeb); 
        // Tra ve danh sach the loai truyen-----------------------------------
    const boxGenre = z('.bg_list-genre');
    const boxNavGenre = z('.box-nav_genre');
    //  ---------------------------------------  //
    function renderListGenre(array) {
        boxGenre.innerHTML = array.map(renderList).join('');
        boxNavGenre.innerHTML = array.map(renderList).join('');
        function renderList(item) {
            const {nameGenre} = item;
            return (`
                <a class="btn">${nameGenre}</a>
            `)
        }
        for(let i = 0; i < array.length; i++) {
            zz('.bg_list-genre a')[i].href = "#" + array[i].nameGenre;
            zz('.box-nav_genre a')[i].href = "#" + array[i].nameGenre;
        }
    } renderListGenre(arrGenre);
    // Tra ve mot truyen truyen ngau nhien--------------------------------  
    const genreTitle = z('.comic_genre-title span');
    function handleComicRandom() {
        let rd1 = Math.floor(Math.random()*arrGenre.length);
            dataWeb.statusWeb.idRandom = rd1;
            postApi('dataWeb', dataWeb);
        let genre = arrGenre[rd1].nameGenre.toLowerCase();
        let newArr = arrComic.filter((item) => {
            return item.listGenre.toLowerCase().includes(genre);        
        })
        renderComicGenre(newArr);
        // renderG(newArr, arrGenre[rd1]);
        let rd2 = Math.floor((Math.random() * newArr.length));
        function renderRandom() {
            const name = z('.box-genre_random > p');
            const links = zz('.bg_random-link a');
            const img = z('.bg_random-img img');
            const ranComic = newArr[rd2];
            name.innerText = ranComic.nameComic;
            z('.bg_random-img').href = ranComic.nameHref;
            links[0].href = ranComic.nameHref;
            links[1].href = ranComic.chapterHref;
            links[1].innerText = "Chương " + ranComic.nameChap;
            img.src = ranComic.imgHref;
            genreTitle.innerText = arrGenre[rd1].innerText;
        } renderRandom();
    } handleComicRandom();
    //  ---------------------------------------  //
    function handleClickGenre() {
        const listGenre1 = zz('.bg_list-genre a');
        const listGenre2 = zz('.box-nav_genre a');
        let getIdRandom = getApi("dataWeb").statusWeb.idRandom;
        genreTitle.innerText = arrGenre[getIdRandom].nameGenre;
        arrGenre.length >= 1 ? ( 
            listGenre1[getIdRandom].classList.add('choose'),
            listGenre2[getIdRandom].classList.add('choose')
        ) : console.log("Không tìm thấy thể loại!")
            listGenre1.forEach((ele, index) => {
                ele.onclick = () => {
                    displayElement(ele, index);
                    listGenre2[index].classList.add('choose');
                }
            });
            listGenre2.forEach((ele, index) => {
                ele.onclick = () => {
                    displayElement(ele, index);
                    listGenre1[index].classList.add('choose');
                }
            });
    } handleClickGenre();
    //  ---------------------------------------  //
    function displayElement(ele, index) {
        z('.bg_list-genre a.choose').classList.remove('choose');
        z('.box-nav_genre a.choose').classList.remove('choose');
        ele.classList.add('choose');
        // ------
        genreTitle.innerText = ele.innerText;

        // ------
        dataWeb.statusWeb.idRandom = index;
        postApi('dataWeb', dataWeb);
        // ------
        let genre = ele.innerText.toLowerCase();
        let newArr = arrComic.filter((item) => {
            return item.listGenre.toLowerCase().includes(genre);        
        });
        renderComicGenre(newArr);
        }
    // Ham nay dung de tim kiem the loai--------------------------------
    function handleComicSearch() {
        const inputSearch = zz('.search-input');
        inputSearch.forEach((ele, index) => {
            ele.oninput = () => {
                if (index == 0) {inputSearch[1].value = ele.value;}
                else if (index == 1) {inputSearch[0].value = ele.value;}
                searchGenre(xoa_dau(ele.value.toLowerCase()));
            }; 
        })
        function searchGenre(value) {
            const valInput = value;
            const newGenre = arrGenre.filter((val) => {
                return val.vietToEng.includes(valInput)
            })
            dataWeb.statusWeb.idRandom = 0;
            postApi('dataWeb', dataWeb);
            renderListGenre(newGenre); handleClickGenre();
            newGenre.length >= 1 ? ( 
                zz('.bg_list-genre a')[0].classList.add('choose'),
                zz('.box-nav_genre a')[0].classList.add('choose')
            ) : console.log("Không tìm thấy thể loại!");
            // Neu nguoi nhap tim duoc mot the loai no se tra ve mang do
            if (newGenre.length == 1) {
                const genre = zz('.bg_list-genre a')[0].innerText.toLowerCase();
                genreTitle.innerText = zz('.bg_list-genre a')[0].innerText;
                let newArr = arrComic.filter((item) => {
                    return item.listGenre.toLowerCase().includes(genre);        
                }); renderComicGenre(newArr);
            }
        }
    } handleComicSearch();
    // Xu ly viec tai ra danh sach truyen theo ngau nhien---------------
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
    };
} ;
/* -------------------------------------------------------------------*/
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
        newArrComic.length >=1 ? (z('.sld.close').classList.remove('close'))
            : console.log("Chưa có dữ liệu!")
    }
    // --------------------------------//
    comicNavs.forEach((comic, index) => {
        comic.onclick = () => {
            dataWeb.statusWeb.idFilter = index;
            postApi("dataWeb", dataWeb);
            // ----------------------------------
            z('.box-comic_nav span.choose').classList.remove('choose');
            comicNavs[index].classList.add('choose');
            handleArrComic(index);
                $('.box-comic_nav span.sld').click(function() {
                    $('.box-comic_genre').slideDown();
                })
        }
    }); 
    if (idFilter == 2) {$('.box-comic_genre').slideUp();}
    $('.comic_nav-genre').click(function() {
        $('.box-comic_genre').slideUp(600);
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
            for (let i = 0; i < lengthGenre; i++) {
                const div = document.createElement('div');
                const h2 = document.createElement('h2');
                h2.id = arrGenre[i].nameGenre;
                h2.innerText = (i + 1) + ". " + arrGenre[i].nameGenre;
                const newArrComic = (arrComic.filter((a) => {
                    return a.listGenre.toLowerCase().includes(arrGenre[i].nameGenre);
                })).sort((a,b) => {
                    return b.nameChap - a.nameChap;
                })
                div.className = "genre-wrap";
                div.innerHTML = newArrComic.map(renderComicGenre).join("");
                boxComic.appendChild(h2);
                boxComic.appendChild(div);
            }
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
                    const h2 = document.createElement('h2');
                    const div = document.createElement('div');
                    h2.innerText = getNameWeb;
                    div.className = "genre-wrap";
                    div.innerHTML = newArrComic.map(renderComicGenre).join("")
                    boxComic.appendChild(h2);
                    boxComic.appendChild(div);
                }
            };
            handleBoxExtra();
        } 
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
                    const arrToDate = today.split(', ');
                    const getToDay = arrToDate[0].split('/');
                    const getToHour = arrToDate[1].split(' ')[0].split(":");
                    const getToOn = arrToDate[1].split(' ')[1];
                    for (let i = 0; i < arrComic.length; i++) {
                        const arrPassDate = arrComic[i].updateChap.split(', ');
                        const getPassDay = arrPassDate[0].split('/');
                        const updateDay = getPassDay[1] + "-" + getPassDay[0] + "-" + getPassDay[2];
                        const getPassHour = arrPassDate[1].split(' ')[0].split(":");
                        const getPassOn = arrPassDate[1].split(' ')[1];
                        handleDatetoPage(updateDay, getPassDay, getPassHour, getPassOn, i);
                    }
                    function handleDatetoPage(updateDay, getPassDay, getPassHour, getPassOn, i) {
                        // Tinh toan tim gia tri
                        let getYear =  +getToDay[2] - getPassDay[2];
                        let getMonth =  +getToDay[0] - getPassDay[0];
                        let getDay =  +getToDay[1] - getPassDay[1];
                        let getHour = +getToHour[0] - getPassHour[0];
                        let getMinute = +getToHour[1] - (+getPassHour[1]);
                        let getSecond = +getToHour[2] - (+getPassHour[2]);
                        if (getYear == 0) {
                            if (getMonth == 0) {
                                if (getDay < 0) {
                                    handleDay(getToDay[2], getToDay[0]);
                                } else if (getDay >= 8) {
                                    chapUp[i].innerText = updateDay;
                                } else if (getDay == 0) {
                                    if (getPassOn == getToOn) {
                                        if (getHour == 0) {
                                            if (getMinute == 0) {
                                                if (getSecond >= 0) {
                                                    chapUp[i].innerText = getSecond + " giây trước";
                                                } else {
                                                    chapUp[i].innerText = 60 + getSecond + " giây trước";
                                                }
                                            } else if (getMinute > 0) {
                                                chapUp[i].innerText = getMinute + " phút trước";
                                            } else {
                                                chapUp[i].innerText = 60 + getMinute + " phút trước";
                                            }
                                        } else {
                                            chapUp[i].innerText = getHour + " giờ trước";
                                        }
                                    } else {
                                        let hour = 12 + getHour;
                                        chapUp[i].innerText = hour + " giờ trước";
                                    }
                                } else {
                                    chapUp[i].innerText = getDay + " ngày trước";
                                }
                            } else {
                                chapUp[i].innerText = updateDay;
                            }
                        } else {
                            chapUp[i].innerText = updateDay;
                        }
                        function handleDay(year, month) {
                            let day;
                            switch (month) {
                                case 4: ;case 6: ;case 9: ;case 11: ;
                                    day = 30; renderDay(day)
                                    break;
                                case 2 :
                                    // nếu năm nhập vào là năm nhuận thì tháng 2 sẽ có 29 ngày
                                    if (year% 4 == 0 ) {
                                        day =  29; renderDay(day);
                                        break;
                                    }
                                    //ngược lại nếu không phải năm nhuận thì tháng 2 sẽ có 28 ngày
                                    else {
                                        day =  28; renderDay(day);
                                        break;
                                    }
                                default: {
                                    day = 31; renderDay(day);
                                }   
                            };
                            function renderDay(day) {
                                let numDay = day + getToDay[1] - getPassDay[1];
                                if (numDay >= 8)   {
                                    chapUp[i].innerText = updateDay;
                                }
                            }
                        };
                    };
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
} ;
/* -------------------------------------------------------------------*/
function handleBoxNav() {
    
} handleBoxNav();
/* -------------------------------------------------------------------*/
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
                    extraWeb[1].classList.remove('close');
                    extraWeb[1].innerText = "Sửa trang Web";
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
function handleBoxExtra() {
    const extraBtns = zz('.extra-btn');
    const editBtns = zz('.comic-i_edit');
    const listNameComic = zz('.ci_name-comic');
    const postBtn = z('.box-extra_btn')
    const btnHandle = zz('.be_col-handle span');
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
            overLay.onclick = () => {closeBox()};
            btnHandle[1].onclick = () => {closeBox()};
            btnNav.onclick = () => {closeBox()};
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
        anotherBtn.onclick = () => {
            z('.be_another-wrap').classList.remove('close');
        }
        // -----------------------
        function closeBox() {
            boxExtra.classList.add('close');
            overLay.classList.add('close');
            boxGenre.classList.remove('open');
            z('.list-nav').classList.remove('open');
            navIcon[0].classList.remove('close');
            boxNav.style = "left: -600px";

            for (let i = 1; i < (navIcon.length); i++) {
                navIcon[i].classList.add('close');
        }
        };
        function openBox() {
            boxExtra.classList.remove('close');
            overLay.classList.remove('close');
        };
    } displayElement();
    // arrComic
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
            btnHandle[0].classList.remove('close');
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
        btnHandle[0].onclick = ()=> {
            const ans = confirm("Bạn có muốn xóa truyện " + arrComic[index].nameComic + " hay không?");
            if (ans == 1) {
                dataWeb.arrayComic == replaceComic()
                postApi("dataWeb", dataWeb);
                location.reload();
            } else{
                console.log("NO DELETE");
            }
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
            btnHandle[0].classList.add('close');
            nameC.innerText = "ReadicName";
            imgC.src = "src/img/29_10_2021(1).jpg";
        } newInput();
        function renderValue() {
            inputs[0].oninput = () => nameC.innerText = inputs[0].value;
            inputs[3].oninput = () => imgC.src = inputs[3].value;
        } renderValue();
        postBtn.onclick = () => {
            handleChapHref (inputs[2].value, inputs[5].value);
            console.log(getApi("dataWeb").statusWeb.chapterHref)
            arrComic.push(getValueInput());
            dataWeb.arrayComic = arrComic;
                postApi("dataWeb", dataWeb);
            location.reload();
        };
    } 
    // handleChapHref()---
    function handleChapHref (nameHref, nameChap) {
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
    ligthToggle();
} handleBoxExtra();
/* -------------------------------------------------------------------*/
function ligthToggle() {
    const statusBtn = zz('.ci_infor-status');
    setInterval(()=> {
        for (let i = 0; i< statusBtn.length; i++) {
            statusBtn[i].classList.toggle('light')
        }
    }, 1500)
} ligthToggle();
/* -------------------------------------------------------------------*/
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
