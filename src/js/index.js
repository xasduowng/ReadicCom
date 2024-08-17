import {getApi, postApi, handleLink} from "./function.js";
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
            idComic: 0,
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
            boxExtra.classList.add('close')
        }
        z('.bgl-comic_close').onclick = () => {
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
const arrComic = dataWeb.arrayComic;
const idComic = (dataWeb.statusWeb).idComic;
    arrComic.length >= 1 ? handleBoxComic(arrComic, idComic)
        : console.log("Chưa có dữ liệu!");
const arrWebsite = dataWeb.arrayWebsite;
    arrWebsite.length >=1 ? (z('.sld.close').classList.remove('close'))
        : console.log("Chưa có dữ liệu!")
    handleBoxWebsite(arrWebsite);
/* -------------------------------------------------------------------*/
function handleBoxGenre() {
    if (arrComic.length >= 1) {
        const arrGenre = [];
        function getArrGenre() {
            for (let i = 0; i < arrComic.length; i++) {
                let x = arrComic[i].arrayGenre;
                for (let j = 0; j < x.length; j++) {
                    let y = x[j].toLowerCase();
                    arrGenre.push(y)
                }
            }
                // Xoa cac phan tu trung lap trong mang
            let arrayGenre = (Array.from(new Set(arrGenre))).sort();
            dataWeb.arrayGenre = arrayGenre;
            postApi("dataWeb", dataWeb);
            return arrayGenre; ;
        } ;
        // Xu ly danh sach the loai truyen-----------------------------------
        const arrayGenre = getArrGenre();
        const boxGenre = z('.bg_list-genre');
        for (let i = 0; i < arrayGenre.length; i++) {
            let a  = document.createElement('a');
            a.className = 'btn';
            a.href = "#" + arrayGenre[i];
            a.innerText = arrayGenre[i];
            boxGenre.appendChild(a); 
        }
        // Ham nay dung de tim kiem the loai--------------------------------
        const listGenre = zz('.bg_list-genre a');
        const genreTitle = z('.comic_genre-title span');
        function handleComicSearch() {
            const inputSearch = z('.bg_list-search');
            const newArr = [];
            for (let i = 0; i< arrayGenre.length; i++) {
                let x = {
                    nameGenre: arrayGenre[i]
                }
                newArr.push(x);
            }
            inputSearch.oninput = () => {
                const valInput = inputSearch.value.toLowerCase();
                const newGenre = newArr.filter((val) => {
                    return val.nameGenre.includes(valInput)
                })
                boxGenre.innerHTML = newGenre.map((item) => {
                    let {nameGenre} = item;
                    return (`
                        <span class="btn">${nameGenre}</span>
                        `)
                }).join("");
                handleGenre(zz('.bg_list-genre a'))
                zz('.bg_list-genre a')[0].classList.add('choose');
                handleGenre(zz('.bg_list-genre a'))
            }
        } handleComicSearch();
        // Xu ly viec tai ra danh sach truyen theo ngau nhien---------------
        function handleComicRandom() {
            let rd1 = Math.floor(Math.random()*arrayGenre.length);
            listGenre[rd1].classList.add('choose');
            let newArr = arrComic.filter((a) => {
                return a.listGenre.toLowerCase().includes(arrayGenre[rd1].toLowerCase());        
            })
            renderG(newArr, arrayGenre[rd1]); renderComic(newArr);
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
                genreTitle.innerText = listGenre[rd1].innerText;
                // z('.box-genre_backgr').src = ranComic.imgHref;
            } renderRandom();
        } handleComicRandom();
        function handleGenre(listGenre) {
            listGenre.forEach((genre, index) => {
                genre.onclick = () => {
                    z('.bg_list-genre a.choose').classList.remove('choose');
                    listGenre[index].classList.add('choose');
                    let currentGenre = genre.innerText.toLowerCase();
                    genreTitle.innerText = listGenre[index].innerText;
                    let newArr = arrComic.filter((a) => {
                        return a.listGenre.toLowerCase().includes(currentGenre);        
                    })
                    renderG(newArr, genre.innerText)
                    renderComic(newArr);
                }
            })
        } handleGenre(listGenre);
        function renderG(newArr, nameGenre) {
            const sections = zz('.bg_list-comic section');
            sections[0].innerText = newArr.length;
            sections[1].innerText = nameGenre;
        }
        function renderComic(newArr) {
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
    }
}  handleBoxGenre();
/* -------------------------------------------------------------------*/
function handleBoxComic(arrComic, idComic) {
    const boxComic = z('.box-comic');
    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    const comicNavs = zz('.box-comic_nav span');
    comicNavs[idComic].classList.add('choose');
    comicNavs.forEach((comic, index) => {
        comic.onclick = () => {
            dataWeb.statusWeb.idComic = index;
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
    if (idComic == 2) {$('.box-comic_genre').slideUp();}
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
            const arrGenre = dataWeb.arrayGenre.sort();
            const lengthGenre = arrGenre.length;
            for (let i = 0; i < lengthGenre; i++) {
                const div = document.createElement('div');
                const h2 = document.createElement('h2');
                h2.id = arrGenre[i];
                h2.innerText = (i + 1) + ". " + arrGenre[i];
                const newArrComic = (arrComic.filter((a) => {
                    return a.listGenre.toLowerCase().includes(arrGenre[i]);
                })).sort((a,b) => {
                    return b.nameChap - a.nameChap;
                })
                div.className = "genre-wrap";
                div.innerHTML = newArrComic.map(renderComic).join("");
                boxComic.appendChild(h2);
                boxComic.appendChild(div);
                // insertValueComic(newArrComic);
            }
            handleBoxExtra();
        } else if (index == 3) {
            const arrWebsite = dataWeb.arrayWebsite;
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
                    div.innerHTML = newArrComic.map(renderComic).join("")
                    boxComic.appendChild(h2);
                    boxComic.appendChild(div);
                }
            };
            handleBoxExtra();
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
        } 
        function handleRenderComic(arrComic) {
            boxComic.innerHTML = arrComic.map(renderComic).join("");
            insertValueComic(arrComic);
        };
            function renderComic(item) {
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
        
    } handleArrComic(idComic)
} ;
/* -------------------------------------------------------------------*/
function handleBoxWebsite(arrWebsite) {
    const inputs = zz('.box-web_input input');
    const btnWeb = z('.btn-web');
    const extraWeb = zz('.extra-web span');
    const webList = z('.box-web_list');
    function eventExtraWeb() {
        arrWebsite.length >= 1 ? (renderWebsite(), moveMouseEnter()): renderEmty();
        inputs[1].oninput = () => {
            if (inputs[1].value.length >= 5 && extraWeb[0].innerText.toLowerCase() == "thêm website") {
                extraWeb[0].onclick = () => {postWeb(); location.reload();}
            }
        }
        function moveMouseEnter() {
            const webBtns = zz('.box-web_list a');
            webBtns.forEach((btn, index) => {
                btn.onmouseenter = () => {
                    inputs[0].value = arrWebsite[index].nameWeb;
                    inputs[1].value = arrWebsite[index].linkWeb;
                    extraWeb[0].innerText = "Sửa website";
                    extraWeb[1].classList.remove("close");
                    extraWeb[0].onclick = () => {
                        let currentWeb = arrWebsite.findIndex((item) => {
                            return item.nameWeb == inputs[0].value;
                        });
                        arrWebsite.splice(currentWeb, 1 );
                        dataWeb.arrayWebsite = arrWebsite;
                        postWeb();
                    }
                    extraWeb[1].onclick = () => {
                        let currentWeb = arrWebsite.findIndex((item) => {
                            return item.nameWeb == inputs[0].value;
                        });
                        arrWebsite.splice(currentWeb, 1 );
                        let x = confirm("Bạn có muốn xóa website hiện tại không?");
                        if(x == 1) {
                            dataWeb.arrayWebsite = arrWebsite;
                            postApi("dataWeb", dataWeb);
                            location.reload();
                        } else{
                            console.log("Không cập nhật!");
                        }
                       
                    }
                };
            });
        } ;
        function postWeb() {
            let obj = {
                nameWeb: inputs[0].value.length >=5 ? inputs[0].value : "readicWeb",
                linkWeb: inputs[1].value.length >=5 ? inputs[1].value : "#"
            }
            arrWebsite.push(obj);
            dataWeb.arrayWebsite = arrWebsite;
                postApi("dataWeb", dataWeb);
            location.reload();
        }
        function renderEmty() {
            webList.innerText = "Bạn vẫn chưa thêm website!"
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
        webList.innerHTML = arrWebsite.map((item) => {
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
            btnHandle[1].onclick = () => {closeBox()}
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
            arrComic.push(getValueInput());
            dataWeb.arrayComic = arrComic;
                postApi("dataWeb", dataWeb);
            location.reload();
        };
    } 
    function handleChapHref (nameHref, nameChap) {
        const nameWebsite = (nameHref.split("/")[2]).split(".")[0];
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
        } else { postHref (nameHref)};
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
            listGenre: inputs[4].value.length >= 1 ? inputs[4].value : "Truyện",
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
