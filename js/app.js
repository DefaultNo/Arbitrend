(() => {
    "use strict";
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function spoilers() {
        const spoilersArray = document.querySelectorAll("[data-spoilers]");
        if (spoilersArray.length > 0) {
            const spoilersRegular = Array.from(spoilersArray).filter((function(item, index, self) {
                return !item.dataset.spoilers.split(",")[0];
            }));
            if (spoilersRegular.length) initSpoilers(spoilersRegular);
            let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpoilers(spoilersArray, matchMedia = false) {
                spoilersArray.forEach((spoilersBlock => {
                    spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spoilersBlock.classList.add("_spoiler-init");
                        initSpoilerBody(spoilersBlock);
                        spoilersBlock.addEventListener("click", setSpoilerAction);
                    } else {
                        spoilersBlock.classList.remove("_spoiler-init");
                        initSpoilerBody(spoilersBlock, false);
                        spoilersBlock.removeEventListener("click", setSpoilerAction);
                    }
                }));
            }
            function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
                let spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");
                if (spoilerTitles.length) {
                    spoilerTitles = Array.from(spoilerTitles).filter((item => item.closest("[data-spoilers]") === spoilersBlock));
                    spoilerTitles.forEach((spoilerTitle => {
                        if (hideSpoilerBody) {
                            spoilerTitle.removeAttribute("tabindex");
                            if (!spoilerTitle.classList.contains("_spoiler-active")) spoilerTitle.nextElementSibling.hidden = true;
                        } else {
                            spoilerTitle.setAttribute("tabindex", "-1");
                            spoilerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpoilerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoiler]")) {
                    const spoilerTitle = el.closest("[data-spoiler]");
                    const spoilersBlock = spoilerTitle.closest("[data-spoilers]");
                    const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler");
                    const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    if (!spoilersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoiler && !spoilerTitle.classList.contains("_spoiler-active")) hideSpoilersBody(spoilersBlock);
                        spoilerTitle.classList.toggle("_spoiler-active");
                        if (spoilerTitle.closest(".item-program")) spoilerTitle.closest(".item-program").classList.toggle("_spoiler-active");
                        _slideToggle(spoilerTitle.nextElementSibling, spoilerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpoilersBody(spoilersBlock) {
                const spoilerActiveTitle = spoilersBlock.querySelector("[data-spoiler]._spoiler-active");
                const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                if (spoilerActiveTitle && !spoilersBlock.querySelectorAll("._slide").length) {
                    spoilerActiveTitle.classList.remove("_spoiler-active");
                    _slideUp(spoilerActiveTitle.nextElementSibling, spoilerSpeed);
                }
            }
            const spoilersClose = document.querySelectorAll("[data-spoiler-close]");
            if (spoilersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spoilers]")) spoilersClose.forEach((spoilerClose => {
                    const spoilersBlock = spoilerClose.closest("[data-spoilers]");
                    const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    spoilerClose.classList.remove("_spoiler-active");
                    _slideUp(spoilerClose.nextElementSibling, spoilerSpeed);
                }));
            }));
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const menu = document.querySelector(".header__menu"), menuTarget = document.querySelector(".header__burger");
    menuTarget.addEventListener("click", (() => {
        menu.classList.toggle("_active");
        menuTarget.classList.toggle("_active");
        document.body.classList.toggle("lock");
    }));
    let script_isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return script_isMobile.Android() || script_isMobile.BlackBerry() || script_isMobile.iOS() || script_isMobile.Opera() || script_isMobile.Windows();
        }
    };
    const dealsItems = document.querySelectorAll(".tabs-deals__item");
    const dealsTabs = document.querySelectorAll(".content-deals__item");
    function clearItems() {
        dealsItems.forEach((item => {
            item.classList.remove("_active");
        }));
        dealsTabs.forEach((item => {
            item.classList.remove("_active");
        }));
    }
    if (dealsItems) {
        let isTouch = false;
        window.addEventListener("resize", (() => {
            if (script_isMobile.any() || window.innerWidth < 767.98) isTouch = true; else isTouch = false;
        }));
        dealsItems.forEach(((dealsItem, i) => {
            if (isTouch) dealsItem.addEventListener("click", (() => {
                clearItems();
                dealsTabs[i].classList.add("_active");
                dealsItem.classList.add("_active");
            })); else dealsItem.addEventListener("mouseenter", (() => {
                clearItems();
                dealsTabs[i].classList.add("_active");
                dealsItem.classList.add("_active");
            }));
        }));
    }
    const video = document.querySelectorAll("[data-yt-video]");
    if (video.length) video.forEach((item => {
        let src = item.dataset.src;
        item.addEventListener("click", (() => {
            if (item.classList.contains("_active")) return;
            item.classList.add("_active");
            item.insertAdjacentHTML("afterbegin", `<iframe width="560" height="315" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        }));
    }));
    spoilers();
})();