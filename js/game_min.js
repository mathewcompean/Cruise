function LegalPanel(a) {
    var c = this,
        e = document.getElementById(a || "div_legal");
    e.style.pointerEvents = "none";
    e.style.background = "transparent";
    var g, f;
    this.doResizeUpdate = function () {
        g = oSTAGE.is_landscape ? Math.min(1, oSTAGE.screen_width / 960) : Math.min(1, oSTAGE.screen_width / 800);
        e.style.transform = e.style.webkitTransform = "scale(" + g + "," + g + ")";
        e.style.width = 1 / g * oSTAGE.screen_width + "px";
        f = Math.max(e.clientHeight) * g;
        e.style.left = "0px";
        e.style.top = oSTAGE.screen_height - f + "px"
    };
    a = e.appendChild(document.createElement("table"));
    a.style.margin = "0px";
    a.setAttribute("width", "100%");
    a.border = 0;
    var d = a.appendChild(document.createElement("tr"));
    a = d.appendChild(document.createElement("td"));
    a.style.textAlign = "left";
    a.style.whiteSpace = "nowrap";
    a.setAttribute("valign", "bottom");
    a.setAttribute("cellpadding", "0");
    d = d.appendChild(document.createElement("td"));
    d.style.textAlign = "right";
    d.setAttribute("valign", "bottom");
    d.setAttribute("cellpadding", "0");
    d = d.appendChild(document.createElement("div"));
    d.className = "legal_block";
    d.style.textAlign =
        "right";
    d.style.background = "transparent";
    d.style.textShadow = "0px 0px 8px black, 0px 0px 8px black";
    for (var k = 0; k < legal_images.length; k++) {
        var h = legal_images[k],
            m = a.appendChild(document.createElement("img"));
        m.className = "legal_image";
        m.src = h.src;
        m.alt = h.alt;
        m.prohibit_touch = !0;
        m.draggable = "false";
        m.ondragstart = function () {
            return !1
        };
        m.onload = function () {
            c.doResizeUpdate()
        }
    }
    for (k = 0; k < legal_links.length; k++) legal_links[k].link ? (a = d.appendChild(document.createElement("a")), a.className = platform.isMobile ?
        "legal_link_mobile" : "legal_link", a.setAttribute("href", legal_links[k].link), a.setAttribute("target", "_blank")) : (a = d.appendChild(document.createElement("div")), a.style.whiteSpace = "nowrap", a.style.pointerEvents = "none", a.prohibit_touch = !0), a.style.fontSize = "14px", __utils.doHTMLText(a, oLANG[legal_links[k].msg]), legal_links[k].after && k < legal_links.length - 1 && (a = d.appendChild(document.createElement("div")), a.style.position = "relative", a.style.marginLeft = "4px", a.style.marginRight = "4px", a.style.display = "inline-block",
        a.innerHTML = legal_links[k].after, a.prohibit_touch = !0);
    c.doResizeUpdate();
    this.doHide = function () {};
    this.doShow = function () {};
    update_queue.push({
        doResizeUpdate: c.doResizeUpdate
    })
};

function ControlsPanel() {
    var a = document.getElementById("div_controls");
    if (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled) {
        var c = a.appendChild(document.createElement("div"));
        c.className = "b_fullscreen";
        c.onclick = function (a) {
            oSTAGE.is_fullscreen ? (__utils.doFullScreenOff(), c.className = "b_fullscreen") : (__utils.doFullScreenOn(), c.className = "b_fullscreen_on")
        };
        c.className = oSTAGE.is_fullscreen ? "b_fullscreen_on" : "b_fullscreen"
    }
    var e = a.appendChild(document.createElement("div"));
    e.className = "b_mute";
    e.onclick = function () {
        0 == __snds.toggleMute() ? (e.className = "b_mute_on", oUSER.is_mute = !1) : (e.className = "b_mute", oUSER.is_mute = !0);
        __localsaver.doSaveData("user", oUSER)
    };
    e.className = oUSER.is_mute ? "b_mute" : "b_mute_on";
    var g = a.appendChild(document.createElement("div"));
    g.className = "b_pause";
    g.style.pointerEvents = "none";
    g.style.transform = "translateX(100px)";
    g.onclick = function () {
        GAME.is_paused ? GAME.doUnPause() : GAME.doPause()
    };
    this.doResizeUpdate = function () {
        var c = oSTAGE.is_landscape ? Math.min(1,
            oSTAGE.screen_width / 960) : Math.min(1, oSTAGE.screen_width / 640);
        a.style.transform = a.style.webkitTransform = "scale(" + c + "," + c + ")"
    };
    this.doShowPause = function () {
        g.style.pointerEvents = "auto";
        TweenLite.set(g, {
            transform: "translateX(100px)",
            overwrite: !0
        });
        TweenLite.to(g, 1.2, {
            transform: "translateX(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .5)
        })
    };
    this.doHidePause = function () {
        g.style.pointerEvents = "none";
        TweenLite.to(g, .4, {
            transform: "translateX(100px)",
            overwrite: !0,
            ease: Back.easeIn.config(1.5)
        })
    };
    this.doResizeUpdate();
    update_queue.push({
        doResizeUpdate: this.doResizeUpdate
    })
};

function PopupPause(a) {
    var c = this,
        e = document.getElementById("div_pause");
    __utils.doDestroyAllChildren(e);
    var g = e.appendChild(document.createElement("div"));
    g.className = "pause_menu_block";
    for (var f = 0; f < a.length; f++) {
        var d = a[f],
            k = g.appendChild(document.createElement("div"));
        k.className = "pause_menu";
        __utils.doHTMLText(k, d.msg);
        k.callback = d.callback;
        k.snd = d.snd;
        k.onmouseup = function (a) {
            a.target.callback();
            __snds.playSound(a.target.snd, "interface");
            c.doDestroy()
        }
    }
    this.doResizeUpdate = function () {
        var a = Math.min(Infinity,
            oSTAGE.screen_width / 800, oSTAGE.screen_height / 800);
        e.style.transform = e.style.webkitTransform = "scale(" + a + "," + a + ")";
        e.style.width = 1 / a * oSTAGE.screen_width + "px";
        e.style.height = 1 / a * oSTAGE.screen_height + "px";
        g.style.top = .5 * (e.clientHeight - g.clientHeight) + "px"
    };
    this.doReveal = function () {};
    this.doDestroy = function () {
        __utils.doDestroyAllChildren(e);
        h.forget = !0;
        e.style.display = "none";
        __snds.unforceMute()
    };
    __snds.forceMute();
    e.style.display = "block";
    c.doResizeUpdate();
    c.doReveal();
    var h = {
        doResizeUpdate: c.doResizeUpdate
    };
    update_queue.push(h)
};

function Loader(a) {
    var c = this,
        e = document.getElementById("div_loading");
    __utils.doDestroyAllChildren(e);
    e.style.display = "block";
    e.style.opacity = 1;
    this.doResizeUpdate = function () {
        trace("loading -> doResizeUpdate()");
        var a = Math.min(Infinity, oSTAGE.screen_width / 800, oSTAGE.screen_height / 800);
        e.style.transform = e.style.webkitTransform = "scale(" + a + "," + a + ")";
        e.style.width = 1 / a * oSTAGE.screen_width + "px";
        e.style.height = 1 / a * oSTAGE.screen_height + "px"
    };
    this.doUpdateBar = function (a) {
        d.style.width = 100 * a + "%"
    };
    this.doFadeAndDestroy =
        function () {
            __utils.doDestroyAllChildren(e);
            TweenLite.to(e, 1, {
                opacity: 0,
                overwrite: !0,
                onComplete: c.doDestroy
            })
        };
    this.doDestroy = function () {
        __utils.doDestroyAllChildren(e);
        k.forget = !0;
        e.style.display = "none"
    };
    var g = e.appendChild(document.createElement("table"));
    g.setAttribute("border", "0");
    g.setAttribute("width", "100%");
    g.setAttribute("height", "100%");
    g = g.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
    g.setAttribute("align", "center");
    g.setAttribute("valign", "middle");
    if (a) {
        a = g.appendChild(document.createElement("div"));
        a.className = "film_logo_block";
        a.style.position = "relative";
        a.style.display = "block";
        a.style.top = "20px";
        a.style.left = "0px";
        var f = a.appendChild(document.createElement("img"));
        f.className = "film_logo_img";
        f.style.height = "100px";
        f.src = oLANG_IMAGES.logo;
        f.onload = function () {
            c.doResizeUpdate()
        };
        a = a.appendChild(document.createElement("div"));
        a.className = "film_logo_date";
        __utils.doHTMLText(a, date_msg)
    }
    a = g.appendChild(document.createElement("div"));
    a.className =
        "loader_spinner";
    a.style.position = "relative";
    a.style.display = "block";
    g = g.appendChild(document.createElement("div"));
    g.className = "loader_bar";
    g.style.position = "relative";
    g.style.display = "block";
    var d = g.appendChild(document.createElement("div"));
    d.className = "loader_bar_fill";
    c.doResizeUpdate();
    var k = {
        doResizeUpdate: c.doResizeUpdate
    };
    update_queue.push(k)
};

function TitleScreen() {
    var a = this,
        c = function () {
            __snds.playSound("music_title_loop", "music", -1, .25);
            window.removeEventListener("touchstart", c)
        };
    "music_title_loop" != __snds.getNowPlaying("music") && (platform.isMobile && !__snds.initialized ? window.addEventListener("touchstart", c, {
        passive: !1,
        capture: !1
    }) : __snds.playSound("music_title_loop", "music", -1, .25));
    var e = document.getElementById("div_screens");
    __utils.doDestroyAllChildren(e);
    var g = e.appendChild(document.createElement("div"));
    g.className = "character_title";
    var f = e.appendChild(document.createElement("div"));
    f.className = "film_logo_block";
    var d = f.appendChild(document.createElement("img"));
    d.className = "film_logo_img";
    d.src = oLANG_IMAGES.logo;
    d = f.appendChild(document.createElement("div"));
    d.className = "film_logo_date";
    __utils.doHTMLText(d, date_msg);
    var k = e.appendChild(document.createElement("div"));
    k.className = "game_logo";
    __utils.doHTMLText(k, oLANG.title);
    var h = e.appendChild(document.createElement("div"));
    h.className = "b_main";
    __utils.doHTMLText(h, oLANG.main_site);
    h.ontouchend = h.onmouseup = function (a) {
        window.open(main_site_url, "_blank")
    };
    var m = e.appendChild(document.createElement("div"));
    m.className = "b_play";
    __utils.doHTMLText(m, oLANG.play);
    m.onmouseup = function (c) {
        sCode.trackGame("cruiseshiprun", "start");
        a.doDestroy();
        doFinishLoading(function () {
            SCREEN = new PickerScreen
        });
        __snds.playSound("snd_click", "interface")
    };
    m.onmouseover = function (a) {
        TweenLite.to(a.target, .1, {
            transform: "scale(1.1, 1.1)",
            overwrite: !0
        })
    };
    m.onmouseout = function (a) {
        TweenLite.to(a.target, .5, {
            transform: "scale(1.0, 1.0)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .5)
        })
    };
    var l = e.appendChild(document.createElement("div"));
    l.className = "b_instructions";
    __utils.doHTMLText(l, oLANG.instructions);
    l.onmouseup = function (c) {
        sCode.trackGame("cruiseshiprun", "instructions");
        __snds.playSound("snd_click", "interface");
        a.doDestroy();
        SCREEN = new InstructionsScreen
    };
    l.onmouseover = function (a) {
        TweenLite.to(a.target, .1, {
            transform: "scale(1.1, 1.1)",
            overwrite: !0
        })
    };
    l.onmouseout = function (a) {
        TweenLite.to(a.target, .5, {
            transform: "scale(1.0, 1.0)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .5)
        })
    };

    var titleNavigation = {};
    titleNavigation.hasFocus = r;
    titleNavigation.playButton = m;
    titleNavigation.instructionButton = l;

    titleNavigation.doUpdate = function(){
        if(__input.right){
            if(this.hasFocus == this.playButton){
                TweenLite.to(this.playButton, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
                TweenLite.to(this.instructionButton, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
                this.hasFocus = this.instructionButton;
                console.log("Instruction Focused");
            }
        }
        else if (__input.left){
            if(this.hasFocus == this.instructionButton){
                TweenLite.to(this.instructionButton, .5, {transform: "scale(1.0, 1.0)", overwrite:true, ease: Elastic.easeOut.config(1, 0.5)});
                TweenLite.to(this.playButton, .1, {transform: "scale(1.1, 1.1)", overwrite:true});
                this.hasFocus = this.playButton;
                console.log("Play Focused");
            }
        }
        else if (__input.enter){
            if(this.hasFocus.className == this.playButton.className){
                console.log("Enter Play");
                this.hasFocus = null;
                this.forget = true;
                sCode.trackGame("cruiseshiprun", "start");
                a.doDestroy();
                doFinishLoading(function () {
                    SCREEN = new PickerScreen
                });
                __snds.playSound("snd_click", "interface")
            }
            else if(this.hasFocus.className == this.instructionButton.className){
                console.log("Enter Instruction");
                this.hasFocus = null;
                this.forget = true;
                sCode.trackGame("cruiseshiprun", "instructions");
                __snds.playSound("snd_click", "interface");
                a.doDestroy();
                SCREEN = new InstructionsScreen
            }
        }
    }

    actives.push(titleNavigation);

    a.checkCheat = function () {
        -1 !== __input.keys_down.indexOf(65) && (oUSER.char1 = 600, oUSER.char2 = 100, __localsaver.doSaveData("user", oUSER)); - 1 !== __input.keys_down.indexOf(81) && (oUSER.char1 = -1, oUSER.char2 = -1, oUSER.char3 = -1, oUSER.char4 = -1, __localsaver.doSaveData("user", oUSER))
    };
    a.cheaterInterval = setInterval(a.checkCheat, 42);
    this.doResizeUpdate = function () {
        if (oSTAGE.is_landscape) {
            var a = Math.max(h.clientWidth + 20 + .5 * f.clientWidth, .33 * oSTAGE.wrapper_width) | 0;
            m.style.left =
                (a - .5 * m.clientWidth | 0) + "px";
            l.style.right = (.5 * (oSTAGE.wrapper_width - (m.offsetLeft + m.clientWidth)) - .5 * l.clientWidth | 0) + "px";
            m.style.bottom = "78px";
            l.style.bottom = "78px"
        } else a = .5 * oSTAGE.wrapper_width, m.style.left = "24px", l.style.right = "24px", m.style.bottom = "80px", l.style.bottom = "80px", g.style.webkitTransform = "rotate(0deg)", g.style.mozTransform = "rotate(0deg)", g.style.msTransform = "rotate(0deg)", g.style.oTransform = "rotate(0deg)", g.style.transform = "rotate(0deg)";
        f.style.left = (a - .5 * f.clientWidth | 0) + "px";
        k.style.left = (a - .5 * k.clientWidth - 50 | 0) + "px"
    };
    this.doReveal = function () {
        g.style.transform = "translateX(" + (oSTAGE.wrapper_width - g.offsetLeft) + "px)";
        m.style.transform = "translateY(" + (oSTAGE.wrapper_height - m.offsetTop) + "px)";
        l.style.transform = "translateY(" + (oSTAGE.wrapper_height - l.offsetTop) + "px)";
        var a = 1.1;
        TweenLite.to(g, 1, {
            transform: "translateX(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .8),
            delay: a
        });
        a += 1;
        TweenLite.to(m, .75, {
            transform: "translateY(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1,
                .8),
            delay: a
        });
        a += .25;
        TweenLite.to(l, .75, {
            transform: "translateY(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .8),
            delay: a
        })
    };
    this.doDestroy = function () {
        clearInterval(a.cheaterInterval);
        __utils.doDestroyAllChildren(e);
        n.forget = !0
    };
    a.doResizeUpdate();
    a.doReveal();
    var n = {
        doResizeUpdate: a.doResizeUpdate
    };
    update_queue.push(n)
};

function InstructionsScreen() {
    var a = this,
        c = document.getElementById("div_screens");
    __utils.doDestroyAllChildren(c);
    c.style.backgroundColor = "rgba(0,38,65,.5)";
    var e = c.appendChild(document.createElement("div"));
    e.className = "instructions_header";
    __utils.doHTMLText(e, oLANG.instructions);
    var g = c.appendChild(document.createElement("div"));
    g.className = "instructions_image";
    g.style.backgroundImage = platform.isMobile ? "url('media/instructions.gif')" : "url('media/instructions_PC.gif')";
    var f = c.appendChild(document.createElement("div"));
    f.className = "b_play";
    __utils.doHTMLText(f, oLANG.play);

    var instructionNav = {};
    __input.enter = false; //Prevents key firing before BlitInput key up event clears the state
    instructionNav.doUpdate = function(){
        if (__input.enter){
            this.forget = true;
            sCode.trackGame("cruiseshiprun", "start");
            a.doDestroy();
            doFinishLoading(function () {
                SCREEN = new PickerScreen
            });
            __snds.playSound("snd_click", "interface")
        }
        else if (__input.back){
            try {
                nz.nzappapi.AppShutdown();
            }
            catch (err) {
                console.log("Error calling AppShutdown.");
            }
        }
    }

    actives.push(instructionNav);

    f.onmouseup = function (c) {
        sCode.trackGame("cruiseshiprun", "start");
        a.doDestroy();
        doFinishLoading(function () {
            SCREEN = new PickerScreen
        });
        __snds.playSound("snd_click", "interface")
    };
    f.onmouseover = function (a) {
        TweenLite.to(a.target, .1, {
            transform: "scale(1.1, 1.1)",
            overwrite: !0
        })
    };
    f.onmouseout = function (a) {
        TweenLite.to(a.target, .5, {
            transform: "scale(1.0, 1.0)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .5)
        })
    };
    this.doResizeUpdate = function () {
        f.style.left = .5 *
            oSTAGE.wrapper_width - .5 * f.clientWidth + "px";
        f.style.bottom = oSTAGE.is_landscape ? "58px" : "80px";
        var a = e.offsetTop + e.clientHeight + 10,
            d = f.offsetTop - 10;
        g.style.top = a + "px";
        g.style.height = d - a + "px";
        g.style.width = Math.min(768, oSTAGE.wrapper_width - 20) + "px";
        g.style.left = .5 * (c.clientWidth - g.clientWidth) + "px"
    };
    this.doReveal = function () {
        f.style.transform = "translateY(" + (oSTAGE.wrapper_height - f.offsetTop) + "px)";
        TweenLite.to(f, .75, {
            transform: "translateY(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .8),
            delay: .5
        })
    };
    this.doDestroy = function () {
        c.style.backgroundColor = "";
        __utils.doDestroyAllChildren(c);
        d.forget = !0
    };
    a.doResizeUpdate();
    a.doReveal();
    var d = {
        doResizeUpdate: a.doResizeUpdate
    };
    update_queue.push(d)
};
var curTouch = {
    x: -1E3,
    y: -1E3
};

function PickerScreen() {
    var a = this;
    a.characterNum = -1;
    var c = 0,
        e = document.getElementById("div_screens");
    __utils.doDestroyAllChildren(e);
    e.style.backgroundColor = "";
    var g = {
        PickerBackground: {
            type: "group",
            src: "media/picker/PickerBackground.jpg"
        },
        MurrayStats: {
            type: "group",
            align: "center"
        },
        MurrayBody: {
            type: "image",
            src: "media/picker/MurrayBody.png"
        },
        MurrayStatsImageBackground: {
            type: "image",
            src: "media/picker/DefaultStatsImage.png",
            button: "Pick",
            id: 4
        },
        MurrayStatsImage: {
            type: "image",
            src: "media/picker/MurrayStatsImage.png"
        },
        MurrayAbility: {
            type: "text"
        },
        MurrayJump: {
            type: "text"
        },
        MurraySpeed: {
            type: "text"
        },
        MurrayName: {
            type: "text"
        },
        FrankStats: {
            type: "group",
            align: "center"
        },
        FrankBody: {
            type: "image",
            src: "media/picker/FrankBody.png"
        },
        FrankStatsImageBackground: {
            type: "image",
            src: "media/picker/DefaultStatsImage.png",
            button: "Pick",
            id: 3
        },
        FrankStatsImage: {
            type: "image",
            src: "media/picker/FrankStatsImage.png"
        },
        FrankAbility: {
            type: "text"
        },
        FrankJump: {
            type: "text"
        },
        FrankSpeed: {
            type: "text"
        },
        FrankName: {
            type: "text"
        },
        MavisStats: {
            type: "group",
            align: "center"
        },
        MavisBody: {
            type: "image",
            src: "media/picker/MavisBody.png"
        },
        MavisStatsImageBackground: {
            type: "image",
            src: "media/picker/DefaultStatsImage.png",
            button: "Pick",
            id: 2
        },
        MavisStatsImage: {
            type: "image",
            src: "media/picker/MavisStatsImage.png"
        },
        MavisAbility: {
            type: "text"
        },
        MavisJump: {
            type: "text"
        },
        MavisSpeed: {
            type: "text"
        },
        MavisName: {
            type: "text"
        },
        DracStats: {
            type: "group",
            align: "center"
        },
        DracBody: {
            type: "image",
            src: "media/picker/DracBody.png"
        },
        DracStatsImageBackground: {
            type: "image",
            src: "media/picker/DefaultStatsImage.png",
            button: "Pick",
            id: 1
        },
        DracStatsImage: {
            type: "image",
            src: "media/picker/DracStatsImage.png"
        },
        DracAbility: {
            type: "text"
        },
        DracJump: {
            type: "text"
        },
        DracSpeed: {
            type: "text"
        },
        DracName: {
            type: "text"
        },
        FrankLockLayer: {
            type: "group",
            hide: "Frank",
            align: "center"
        },
        FrankLockImage: {
            type: "image",
            src: "media/picker/small_lock.png"
        },
        FrankLockText: {
            type: "text"
        },
        MurrayLockLayer: {
            type: "group",
            hide: "Murray",
            align: "center"
        },
        small_lock: {
            type: "image",
            src: "media/picker/small_lock.png"
        },
        MurrayLockText: {
            type: "text"
        },
        PickerBackButtontype: {
            type: "group"
        },
        PickerBackButton: {
            type: "image",
            src: "media/picker/PickerBackButton.png",
            button: "Back"
        },
        PickerBack: {
            type: "text"
        },
        PlayButton: {
            type: "group"
        },
        PickerPlayButton: {
            type: "image",
            src: "media/picker/PickerPlayButton.png",
            button: "Play"
        },
        PickerPlay: {
            type: "text"
        }
    };
    void 0 === oUSER.char1 && (oUSER.char1 = -1);
    void 0 === oUSER.char2 && (oUSER.char2 = -1);
    void 0 === oUSER.char3 && (oUSER.char3 = -1);
    void 0 === oUSER.char4 && (oUSER.char4 = -1);
    var f = 0 < oUSER.char1 && (0 < oUSER.char2 || 0 < oUSER.char4) || 0 < oUSER.char2 && (0 < oUSER.char1 || 0 < oUSER.char4),
        d = 500 < Math.max(oUSER.char1, oUSER.char2, oUSER.char3, oUSER.char4),
        k = [!0, !0, !0, d, f],
        h = e;
    // f = Murray Available
    // d = 
    var pickerNav = {};
    pickerNav.murrayAvailable = f;
    pickerNav.franklinAvailable = d;
    pickerNav.drac = null;
    pickerNav.mavis = null;
    pickerNav.franklin = null;
    pickerNav.murray = null;
    pickerNav.playButton = null;
    pickerNav.playLocked = true;
    pickerNav.backButton = null;
    pickerNav.hasFocus = null;

    Object.keys(g).forEach(function (c) {
        var f = g[c];
        if ("group" === f.type) h = e.appendChild(document.createElement("div")), h.id = h.className = c, h.style.pointerEvents = "none", f.element = h;
        else {
            var d = h.appendChild(document.createElement("div"));
            f.element = d;
            d.id = d.className = c;
            d.style.display = "block";
            "text" === f.type ? (__utils.doHTMLText(d, oLANG[c]), "PickerPlay" === c && (d.style.opacity = .5)) : (d.style.backgroundSize = "contain", d.style.backgroundImage =
                "url(" + (images[c].currentSrc || images[c].src) + ")");
            if (void 0 !== f.button) switch (d.style.cursor = "pointer", d.style.pointerEvents = "auto", f.button) {
                case "Back":
                    pickerNav.backButton = d;
                    d.onmouseup = function (c) {
                        sCode.trackGame("cruiseshiprun", "back");
                        a.doDestroy();
                        doFinishLoading(function () {
                            SCREEN = new TitleScreen
                        });
                        __snds.playSound("snd_click", "interface")
                    };
                    d.onmouseover = function (a) {
                        TweenLite.to(a.target, .1, {
                            transform: "scale(1.1, 1.1)",
                            overwrite: !0
                        })
                    };
                    d.onmouseout = function (a) {
                        TweenLite.to(a.target, .5, {
                            transform: "scale(1.0, 1.0)",
                            overwrite: !0,
                            ease: Elastic.easeOut.config(1, .5)
                        })
                    };
                    break;
                case "Play":
                    pickerNav.playButton = d;
                    d.style.opacity = .5;
                    d.onmouseup = function (c) {
                        -1 < a.characterNum && (sCode.trackGame("cruiseshiprun", "play:" + ["Drac", "Mavis", "Frank", "Murray"][a.characterNum - 1]), a.doDestroy(), doFinishSecondLoading(a.characterNum, function () {
                            SCREEN = new GameScreen;
                            GAME = new Game(a.characterNum)
                        }), __snds.playSound("snd_click", "interface"))
                    };
                    d.onmouseover = function (c) {
                        -1 < a.characterNum && TweenLite.to(c.target, .1, {
                            transform: "scale(1.1, 1.1)",
                            overwrite: !0
                        })
                    };
                    d.onmouseout =
                        function (c) {
                            -1 < a.characterNum && TweenLite.to(c.target, .5, {
                                transform: "scale(1.0, 1.0)",
                                overwrite: !0,
                                ease: Elastic.easeOut.config(1, .5)
                            })
                        };
                    break;
                case "Pick":
                    k[f.id] ? (d.characterId = f.id, d.master = a, d.onmouseup = function (a) {
                        this.master.selectCharacter(this);
                        __snds.playSound("snd_click", "interface")
                    }, d.onmouseover = function (a) {
                        TweenLite.to(a.target, .1, {
                            transform: "scale(1.1, 1.1)",
                            overwrite: !0
                        })
                    }, d.onmouseout = function (a) {
                        TweenLite.to(a.target, .5, {
                            transform: "scale(1.0, 1.0)",
                            overwrite: !0,
                            ease: Elastic.easeOut.config(1,
                                .5)
                        })
                    }) : d.style.opacity = .75
                    if (f.id == 1){
                        pickerNav.drac = d;
                    }
                    else if (f.id == 2){
                        pickerNav.mavis = d;
                        PickerNav.hasFocus = pickerNav.mavis;
                    }
                    else if (f.id == 3){
                        pickerNav.franklin = d;
                    }
                    else if (f.id == 4){
                        pickerNav.murray = d; 
                    }
            } else d.style.pointerEvents = "none"
        }
    });

    pickerNav.doUpdate = function(){
        if (__input.right){
            if(pickerNav.hasFocus.characterId == pickerNav.mavis.characterId){

            }
            else if(pickerNav.hasFocus.characterId == pickerNav.drac.characterId){

            }
            else if(pickerNav.hasFocus.characterId == pickerNav.franklin.characterId){

            }
        }
        else if (__input.left){

            if(pickerNav.hasFocus.characterId == pickerNav.drac.characterId){

            }
            else if(pickerNav.hasFocus.characterId == pickerNav.franklin.characterId){

            }
            else if(pickerNav.hasFocus.characterId == pickerNav.murray.characterId){

            }

        }
        else if (__input.down){
            if(pickerNav.hasFocus.className == pickerNav.backButton.className || pickerNav.hasFocus.className == pickerNav.playButton.className){
                //Animation

                //SetFocus
                pickerNav.hasFocus = pickerNav.mavis;

                
            }
            
        }
        else if (__input.up){

            if(pickerNav.hasFocus.className != pickerNav.backButton.className && pickerNav.hasFocus.className != pickerNav.playButton.className){

                if(pickerNav.playLocked){
                    //animation

                    //Set Focus
                    pickerNav.hasFocus = pickerNav.backButton;
                    
                }
                else{
                    pickerNav.hasFocus = pickerNav.playButton;
                }
            }

        }
        else if (__input.enter){
            if(pickerNav.hasFocus.characterId == pickerNav.mavis.characterId){
                this.selectCharacter(pickerNav.mavis);
            }
            else if(pickerNav.hasFocus.characterId == pickerNav.drac.characterId){
                this.selectCharacter(pickerNav.drac);
            }
            else if(pickerNav.hasFocus.characterId == pickerNav.franklin.characterId){
                this.selectCharacter(pickerNav.franklin);
            }
            else if(pickerNav.hasFocus.characterId == pickerNav.franklin.characterId){
                this.selectCharacter(pickerNav.murray);
            }
            else if(pickerNav.hasFocus.className == pickerNav.backButton.className){
                this.forget = true;
                sCode.trackGame("cruiseshiprun", "back");
                a.doDestroy();
                doFinishLoading(function () {
                    SCREEN = new TitleScreen
                });
                __snds.playSound("snd_click", "interface")
            }
            else if(pickerNav.hasFocus.className == pickerNav.playButton.className){
                this.forget = true;
                -1 < a.characterNum && (sCode.trackGame("cruiseshiprun", "play:" + ["Drac", "Mavis", "Frank", "Murray"][a.characterNum - 1]), a.doDestroy(), doFinishSecondLoading(a.characterNum, function () {
                    SCREEN = new GameScreen;
                    GAME = new Game(a.characterNum)
                }), __snds.playSound("snd_click", "interface"))
            }
        }
    }

    f && (g.MurrayLockLayer.element.style.display = "none");
    d && (g.FrankLockLayer.element.style.display = "none");
    var m = void 0;
    this.selectCharacter = function (c) {
        -1 < a.characterNum && (m.style.backgroundImage = "url(" + (images.MavisStatsImageBackground.currentSrc || images.MavisStatsImageBackground.src) + ")");
        m = c;
        c.style.backgroundImage = "url(" + (images.SelectedImageBackground.currentSrc || images.SelectedImageBackground.src) + ")";
        a.characterNum = c.characterId;
        g.PickerPlayButton.element.style.opacity = 1;
        g.PickerPlay.element.style.opacity = 1
    };
    this.doResizeUpdate = function () {
        var a = 1,
            f = 0,
            e;
        1 < c && (c = 0);
        .5625 > oSTAGE.wrapper_ratio ? (hScrollScaled = -(oSTAGE.scale_inv * window.innerHeight - window.innerWidth * oSTAGE.scale_inv * .5625), a = oSTAGE.scale_inv * window.innerWidth / 960) : (1 > oSTAGE.wrapper_ratio && (c = .4), f = -((oSTAGE.scale_inv * window.innerWidth - 960 / 540 * oSTAGE.scale_inv * window.innerHeight) / 2) / 4, hScrollScaled = -(oSTAGE.scale_inv * window.innerHeight - window.innerWidth * oSTAGE.scale_inv *
            .5625) * (c - .25));
        Object.keys(g).forEach(function (c) {
            var d = g[c];
            "group" == d.type && ("PickerBackground" === c ? 1 === a ? (e = 960 / 540 * oSTAGE.scale_inv * window.innerHeight, d.element.style.height = window.innerHeight * oSTAGE.scale_inv + "px", d.element.style.width = e + "px", d.element.style.left = (oSTAGE.scale_inv * window.innerWidth - e) / 2 + "px", d.element.style.top = "0px") : (e = window.innerWidth * oSTAGE.scale_inv * .5625, d.element.style.width = window.innerWidth * oSTAGE.scale_inv + "px", d.element.style.height = e + "px", d.element.style.top = oSTAGE.scale_inv *
                window.innerHeight - e + "px", d.element.style.left = "0px") : "center" === d.align && (d.element.style.bottom = f + "px", d.element.style.left = hScrollScaled + "px"))
        })
    };
    this.doUpdateScroll = function () {
        -1E3 < curTouch.x && (c -= .1 * curTouch.x, c = Math.max(.1, Math.min(1, c)), a.doResizeUpdate())
    };
    this.pickerUpdate = setInterval(a.doUpdateScroll, 25);
    this.doReveal = function () {
        var delay = .75;
        TweenLite.to(pickerNav.mavis, .1, {
            transform: "scale(1.1, 1.1)",
            overwrite: !0,
            delay: delay
        });
    };
    this.doDestroy = function () {
        clearInterval(a.pickerUpdate);
        __utils.doDestroyAllChildren(e);
        l.forget = !0
    };
    a.doResizeUpdate();
    a.doReveal();
    var l = {
        doResizeUpdate: a.doResizeUpdate
    };
    actives.push(pickerNav);
    update_queue.push(l)
}

function doFinishSecondLoading(a, c) {
    __utils.doLoad3dAssets(assets_threejs_game, oMODELS);
    switch (a) {
        case 1:
            var e = assets_threejs_1;
            break;
        case 2:
            e = assets_threejs_2;
            break;
        case 3:
            e = assets_threejs_3;
            break;
        case 4:
            e = assets_threejs_4
    }
    __utils.doLoad3dAssets(e, oMODELS);
    LOADER = new Loader(!0);
    LOADER.doUpdate = function () {
        this.doUpdateBar(.5 * (e.progress + assets_threejs_game.progress));
        e.loaded && assets_threejs_game.loaded && (this.purge = !0, c && c(), LOADER.doFadeAndDestroy())
    };
    actives.push(LOADER)
};

function GameScreen() {
    var a = this,
        c, e = document.getElementById("div_screens");
    var g = document.getElementById("div_legal");
    __utils.doDestroyAllChildren(e);
    e.style.backgroundColor = "";
    var f = e.appendChild(document.createElement("div"));
    f.className = "hud_messages";
    f.style.display = "none";
    var d = e.appendChild(document.createElement("div"));
    d.className = "film_logo_block";
    var k = d.appendChild(document.createElement("img"));
    k.className = "film_logo_img";
    k.style.height = "100px";
    k.src = oLANG_IMAGES.logo;
    k.onload = function () {
        a.doResizeUpdate()
    };
    k = d.appendChild(document.createElement("div"));
    k.className = "film_logo_date";
    __utils.doHTMLText(k, date_msg);
    this.doUpdateScore = function (a) {
        hud_score_amt.innerHTML = a
    };
    this.doShowMessage = function (d, g) {
        __utils.doHTMLText(f, d);
        f.style.opacity = 1;
        f.style.display = "block";
        f.style.left = .5 * (e.clientWidth - f.clientWidth) + "px";
        f.style.top = .5 * (e.clientHeight - f.clientHeight) + "px";
        clearTimeout(c);
        g && (c = setTimeout(a.doHideMessage, 1E3 * g))
    };
    this.doHideMessage = function () {
        TweenLite.to(f, .5, {
            opacity: 0,
            overwrite: !0,
            onComplete: function () {
                f.style.display =
                    "none"
            }
        })
    };
    this.doResizeUpdate = function () {
        f.style.left = .5 * (e.clientWidth - f.clientWidth) + "px";
        f.style.top = .5 * (e.clientHeight - f.clientHeight) + "px";
        d.style.left = e.clientWidth - d.clientWidth - 10 + "px";
        d.style.top = window.innerHeight * oSTAGE.scale_inv - d.clientHeight + 25 - g.clientHeight + "px"
    };
    this.doReveal = function () {};
    this.doHide = function () {};
    this.doDestroy = function () {
        __utils.doDestroyAllChildren(e);
        h.forget = !0
    };
    a.doResizeUpdate();
    a.doReveal();
    var h = {
        doResizeUpdate: a.doResizeUpdate
    };
    update_queue.push(h)
};

function RecapScreen(a) {
    var c = this;
    c.id = "screen";
    "music_title_loop" != __snds.getNowPlaying("music") && __snds.playSound("music_title_loop", "music", -1, .25);
    var e = document.getElementById("div_screens");
    __utils.doDestroyAllChildren(e);
    var g = e.appendChild(document.createElement("div"));
    g.className = "character_recap";
    var f = e.appendChild(document.createElement("div"));
    f.className = "film_logo_block";
    var d = f.appendChild(document.createElement("img"));
    d.className = "film_logo_img";
    d.src = oLANG_IMAGES.logo;
    d = f.appendChild(document.createElement("div"));
    d.className = "film_logo_date";
    __utils.doHTMLText(d, date_msg);
    var k = e.appendChild(document.createElement("table"));
    k.className = "recap_table";
    k.style.margin = "0px";
    k.setAttribute("border", "0");
    d = " <span style='font-size:50%'>" + oLANG.MeterShort.value + "</span>";
    var h = k.appendChild(document.createElement("tr")),
        m = h.appendChild(document.createElement("td"));
    m.className = "recap_tablecell";
    m.style.textAlign = "right";
    m.style.fontSize = "65px";
    m.setAttribute("valign", "middle");
    __utils.doHTMLText(m, oLANG.score);
    h =
        h.appendChild(document.createElement("td"));
    h.className = "recap_tablecell";
    h.style.textAlign = "left";
    h.style.fontSize = "115px";
    h.style.color = "white";
    h.setAttribute("valign", "middle");
    __utils.doHTMLText(h, GAME.score + d);
    h = k.appendChild(document.createElement("tr"));
    m = h.appendChild(document.createElement("td"));
    m.className = "recap_tablecell";
    m.style.textAlign = "right";
    m.style.fontSize = "50px";
    m.setAttribute("valign", "middle");
    __utils.doHTMLText(m, oLANG.best_score);
    h = h.appendChild(document.createElement("td"));
    h.className = "recap_tablecell";
    h.style.textAlign = "left";
    h.style.fontSize = "75px";
    h.style.color = "white";
    h.setAttribute("valign", "middle");
    __utils.doHTMLText(h, oUSER.best_score + d);
    h = k.appendChild(document.createElement("tr"));
    m = h.appendChild(document.createElement("td"));
    m = h.appendChild(document.createElement("td"));
    var l = e.appendChild(document.createElement("div"));
    l.className = "b_play";
    __utils.doHTMLText(l, oLANG.play_again);
    l.onmouseup = function (a) {
        sCode.trackGame("cruiseshiprun", "playagain");
        __snds.playSound("snd_click",
            "interface");
        c.doDestroy();
        doFinishLoading(function () {
            SCREEN = new PickerScreen
        })
    };
    l.onmouseover = function (a) {
        TweenLite.to(a.target, .1, {
            transform: "scale(1.1, 1.1)",
            overwrite: !0
        })
    };
    l.onmouseout = function (a) {
        TweenLite.to(a.target, .5, {
            transform: "scale(1.0, 1.0)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .5)
        })
    };
    var n = e.appendChild(document.createElement("div"));
    n.className = "b_main";
    __utils.doHTMLText(n, oLANG.main_site);
    n.onmouseup = function (a) {
        window.open(main_site_url, "_blank")
    };
    var t = e.appendChild(document.createElement("div"));
    if (0 < a) switch (t.appendChild(document.createElement("div")).className = "recap_unlock", d = t.appendChild(document.createElement("div")), a) {
        case 1:
            d.className = "recap_unlock_text";
            __utils.doHTMLText(d, oLANG.RecapUnlockFrank);
            a = t.appendChild(document.createElement("div"));
            a.className = "recap_unlock_frank";
            break;
        case 2:
            d.className = "recap_unlock_text";
            __utils.doHTMLText(d, oLANG.RecapUnlockMurray);
            a = t.appendChild(document.createElement("div"));
            a.className = "recap_unlock_murray";
            break;
        case 3:
            d.className = "recap_unlock_text_both",
                __utils.doHTMLText(d, oLANG.RecapUnlockBoth), a = t.appendChild(document.createElement("div")), a.className = "recap_unlock_frank", a = t.appendChild(document.createElement("div")), a.className = "recap_unlock_murray", a.style.left = "120px"
    }
    this.doResizeUpdate = function () {
        var a = oSTAGE.is_landscape ? Math.max(n.clientWidth + 70 + .5 * f.clientWidth, .43 * oSTAGE.wrapper_width) : .5 * oSTAGE.wrapper_width;
        f.style.left = a - .5 * f.clientWidth + "px";
        l.style.left = a - .5 * l.clientWidth + "px";
        k.style.left = a - .5 * k.clientWidth + "px";
        l.style.bottom =
            oSTAGE.is_landscape ? "78px" : "80px"
    };
    this.doReveal = function () {
        g.style.transform = "translateX(" + (oSTAGE.wrapper_width - g.offsetLeft) + "px)";
        l.style.transform = "translateY(" + (oSTAGE.wrapper_height - l.offsetTop) + "px)";
        t.style.transform = "translateX(" + -t.clientWidth + "px)";
        var a = 1;
        TweenLite.to(g, 1, {
            transform: "translateX(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .8),
            delay: a
        });
        a += 1;
        TweenLite.to(l, .75, {
            transform: "translateY(0px)",
            overwrite: !0,
            ease: Elastic.easeOut.config(1, .8),
            delay: a
        });
        a += 1;
        TweenLite.to(t,
            .75, {
                transform: "translateX(0px)",
                overwrite: !0,
                ease: Elastic.easeOut.config(1, .8),
                delay: a
            })
    };
    this.doDestroy = function () {
        __utils.doDestroyAllChildren(e);
        y.forget = !0
    };
    c.doResizeUpdate();
    c.doReveal();
    var y = {
        doResizeUpdate: c.doResizeUpdate
    };
    update_queue.push(y)
};
var halfPi = Math.PI / 2;

function Atlas() {
    var a = this;
    a.numLoadTries = 0;
    var c = void 0,
        e = !1;
    this.loadJSON = function (c, f) {
        if (void 0 !== oMODELS[c]) a.initJSONAtlas(oMODELS[c]);
        else {
            var d = new XMLHttpRequest;
            d.onreadystatechange = function () {
                if (4 == this.readyState && 200 == this.status) {
                    var d = this.responseText.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "");
                    d = JSON.parse(d);
                    oMODELS[c] = d;
                    a.initJSONAtlas(d)
                } else 4 === this.readyState && 0 < this.status && (trace("Loading Error:" + f + " " + this.status), 6 > a.numLoadTries++ && a.loadJSON(c, f))
            };
            d.open("GET",
                f, !0);
            d.send();
            return !1
        }
    };
    this.initJSONAtlas = function (g) {
        e = !0;
        a.animated = !0;
        var f = {},
            d = 1,
            k = g.frames,
            h = Object.keys(k);
        g = g.meta.size;
        for (var m = 0; m < h.length; m++) {
            var l = k[h[m]],
                n = l.frame;
            n.nx = n.x / g.w;
            l.rotated ? (n.ny = 1 - (n.y + n.w) / g.h, n.nw = n.h / g.w, n.nh = n.w / g.h, n.sw = 1 * n.h / l.sourceSize.h, n.sh = 1 * n.w / l.sourceSize.w) : (n.ny = 1 - (n.y + n.h) / g.h, n.nw = n.w / g.w, n.nh = n.h / g.h, n.sw = 1 * n.w / l.sourceSize.w, n.sh = 1 * n.h / l.sourceSize.h);
            n.center = new THREE.Vector2((l.spriteSourceSize.x + l.spriteSourceSize.w / 2 - l.sourceSize.w / 2) / l.sourceSize.w, -(l.spriteSourceSize.y + l.spriteSourceSize.h / 2 - l.sourceSize.h / 2) / l.sourceSize.h);
            n.rotated = l.rotated;
            f[d] = n;
            d++
        }
        c = f;
        a.maxAtlas = d - 1;
        a.setCell(a.curDef[0])
    };
    this.Init = function (c, f, d, e, h) {
        var g = a.texture = oMODELS[c];
        a.baseScale = 2 * f;
        g.generateMipmaps = !1;
        g.magFilter = THREE.NearestFilter;
        g.minFilter = THREE.NearestFilter;
        a.animDef = d;
        a.animating = !1;
        a.looping = !1;
        f = 1;
        void 0 === d ? (a.animated = !1, a.animating = !0, a.animNames = ["default"], a.curDef = [1], a.offsets = [
            [0, 1]
        ], f = 1 * g.image.width / g.image.height) : (g = g.clone(), a.animated = !0, a.animNames = Object.keys(d), a.curDef = d[a.animNames[0]].cells, g.matrixAutoUpdate = !0, g.needsUpdate = !0, a.offsets = []);
        a.material = new THREE.MeshBasicMaterial({
            name: c + "_mat",
            transparent: !0,
            map: g,
            side: THREE.FrontSide,
            depthWrite: !1
        });
        oMODELS[c + "_mat"] = a.material;
        d = new THREE.PlaneGeometry(f, 1, 8, 8);
        a.sprite = new THREE.Mesh(d, a.material);
        a.sprite.name = c + "_plane";
        void 0 !== e && a.loadJSON(e, h);
        a.setCell(a.curDef[0]);
        return a.sprite
    };
    this.startAnim = function (c, e, d) {
        void 0 === a.testCellNum && void 0 !== c && (-1 === a.animNames.indexOf(c) ?
            trace("Missing Anim" + c) : (a.animated && (a.curDef = a.animDef[c].cells, a.loop = a.animDef[c].loop), a.numFrames = a.curDef.length, a.currentAnim = c, a.frameNum = 0, a.updateTime = 0, a.cellNum = a.curDef[0], a.animating = a.animated, a.animCallback = e, a.animCallbackParam = d, a.animChain = void 0 !== a.animDef[c].chain ? a.animDef[c].chain : "", a.updateTime = Date.now() + 42, a.setCell(a.cellNum)))
    };
    this.setCell = function (g) {
        if (e) {
            var f = c[g];
            void 0 === f ? (console.log("Missing frame:" + g), a.sprite.position.y = -100) : (a.displayCell !== g && (a.displayCell =
                g, a.material.map.offset.set(f.nx, f.ny), a.material.map.repeat.set(f.nw, f.nh), a.sprite.scale.set(a.baseScale * f.sw, a.baseScale * f.sh, 1), a.sprite.rotation.z = f.rotated ? halfPi : 0), a.sprite.position.x += f.center.x * a.baseScale, a.sprite.position.y += f.center.y * a.baseScale)
        } else a.sprite.position.y = -100
    };
    this.stepAnimation = function () {
        a.animating && (Date.now() > a.updateTime && (a.updateTime = Date.now() + 42, a.frameNum++, a.frameNum >= a.numFrames && (a.loop ? a.frameNum = 0 : "" !== a.animChain ? a.startAnim(a.animChain) : (a.frameNum =
            a.numFrames - 1, a.animating = !1, void 0 !== a.animCallback && (a.animCallback(), a.animCallback = void 0)))), a.setCell(a.curDef[a.frameNum]))
    }
}

function RadialMask(a, c, e) {
    void 0 === e && (e = 0);
    return new THREE.ShaderMaterial({
        transparent: !0,
        uniforms: {
            tDiffuse: {
                type: "t",
                value: a
            },
            tLevel: {
                type: "f",
                value: c
            },
            tAngle: {
                type: "f",
                value: e
            }
        },
        vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
        fragmentShader: "uniform sampler2D tDiffuse;\nuniform float tLevel;\n\nuniform float tAngle;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D(tDiffuse, vUv);\nfloat angle = tAngle+0.5+atan(0.5-vUv.y,vUv.x-0.5)/6.283;\nif (angle>1.0) angle=angle-1.0;\nfloat alpha = 0.0;\nif (angle<tLevel ) alpha=1.0;\ngl_FragColor = texel * alpha;\n}"
    })
}

function padZero(a, c, e) {
    a += "";
    return a.length >= c ? a : Array(c - a.length + 1).join(e || "0") + a
}

function rndInt(a) {
    return Math.floor(Math.random() * a)
};
enableGameTouches();

function enableGameTouches() {
    document.addEventListener("touchstart", F_event_Touch_onDocument_handle, !1);
    document.addEventListener("touchend", F_event_Touch_onDocument_handle, !1);
    window.addEventListener("touchmove", F_event_Touch_onDocument_handle, !1);
    document.addEventListener("mousedown", F_event_Touch_onDocument_handle, !1);
    document.addEventListener("mouseup", F_event_Touch_onDocument_handle, !1);
    window.addEventListener("mousemove", F_event_Touch_onDocument_handle, !1)
}

function disableGameTouches() {
    document.removeEventListener("touchstart", F_event_Touch_onDocument_handle, !1);
    document.removeEventListener("touchend", F_event_Touch_onDocument_handle, !1);
    window.removeEventListener("touchmove", F_event_Touch_onDocument_handle, !1);
    document.removeEventListener("mousedown", F_event_Touch_onDocument_handle, !1);
    document.removeEventListener("mouseup", F_event_Touch_onDocument_handle, !1);
    window.removeEventListener("mousemove", F_event_Touch_onDocument_handle, !1)
}
var thisTouch = {
    x: -1E3,
    y: -1E3
};
curTouch = {
    x: -1E3,
    y: -1E3
};
var halfPie = 1.25 * Math.PI,
    lastActionTime = -1,
    __lastSwipe = -1;

function F_event_Touch_onDocument_handle(a) {
    if (!(-1 < a.type.indexOf("touch") && 1 < a.touches.length)) {
        var c = null,
            e = null;
        switch (a.type) {
            case "touchstart":
                e = a.changedTouches[0];
                c = "onclick";
                break;
            case "touchmove":
                e = a.changedTouches[0];
                c = "mousemove";
                break;
            case "touchend":
                e = a.changedTouches[0];
                c = "mouseup";
                break;
            case "mousedown":
                c = "onclick";
                e = a;
                break;
            case "mousemove":
                c = "mousemove";
                e = a;
                break;
            case "mouseup":
                e = a, c = "mouseup"
        }
        "mouseup" === c && -1 < thisTouch.x && (thisTouch.x = -1E3, curTouch.x = -1E3, __lastSwipe = -1);
        "onclick" ===
        c && (thisTouch.x = e.clientX / window.innerWidth * 2 - 1, thisTouch.y = 2 * -(e.clientY / window.innerHeight) + 1);
        "mousemove" === c && (-1 < thisTouch.x && (curTouch = {}, curTouch.x = e.clientX / window.innerWidth * 2 - 1 - thisTouch.x, curTouch.y = 2 * -(e.clientY / window.innerHeight) + 1 - thisTouch.y, .05 < Math.abs(curTouch.x) + Math.abs(curTouch.y) && (c = Math.floor(2 * (halfPie - Math.atan2(curTouch.y, curTouch.x)) / Math.PI), 1 > c && (c = 4), __lastSwipe = c)), a.preventDefault());
        return !1
    }
};
var animations, document_blurred = !1,
    Game = function (a) {
        window.focus();
        var c = this;
        c.pieceWidth = 20;
        c.shipPieces = [];
        c.moveRate = -.25;
        c.shipPos = 0;
        c.nextPiece = -c.pieceWidth;
        c.characterNum = 0;
        var e = 2 * -c.pieceWidth,
            g, f, d;
        c.score = 0;
        c.level = 1;
        c.difficulty = 0;
        c.is_paused = !1;
        c.effectiveMoveRate = 0;
        var k = !1,
            h = [],
            m, l = {},
            n = {
                1: {
                    id: 1,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5
                },
                2: {
                    id: 2,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5
                },
                3: {
                    id: 3,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5
                },
                4: {
                    id: 4,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5
                },
                5: {
                    id: 5,
                    active: !1,
                    type: "deck",
                    next: [3, 11, 6, 8, 5, 13, 14, 15, 16],
                    mirror: 5
                },
                6: {
                    id: 6,
                    active: !1,
                    type: "pool",
                    next: [7],
                    mirror: 7
                },
                7: {
                    id: 7,
                    active: !1,
                    type: "pool",
                    next: [3, 11, 5, 13, 14, 15, 16],
                    mirror: 6
                },
                8: {
                    id: 8,
                    active: !1,
                    type: "pool",
                    next: [3, 11, 5, 13, 14, 15, 16],
                    mirror: 8
                },
                9: {
                    id: 9,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5
                },
                10: {
                    id: 10,
                    active: !1,
                    type: "wall",
                    next: [5, 13, 14, 15, 16, 6, 8],
                    mirror: 5
                },
                11: {
                    id: 11,
                    active: !1,
                    type: "wall",
                    next: [1, 2, 4, 9, 10, 12],
                    mirror: 5,
                    x: 10
                },
                12: {
                    id: 12,
                    active: !1,
                    type: "wall",
                    next: [5, 13, 14, 15, 16, 6, 8],
                    mirror: 5,
                    x: -10
                },
                13: {
                    id: 13,
                    active: !1,
                    type: "deck",
                    next: [3, 11, 6, 8, 5, 13, 14, 15, 16],
                    mirror: 13
                },
                14: {
                    id: 14,
                    active: !1,
                    type: "deck",
                    next: [3, 11, 6, 8, 5, 13, 14, 15, 16],
                    mirror: 14
                },
                15: {
                    id: 15,
                    active: !1,
                    type: "deck",
                    next: [3, 11, 6, 8, 5, 13, 14, 15, 16],
                    mirror: 15
                },
                16: {
                    id: 16,
                    active: !1,
                    type: "deck",
                    next: [3, 11, 6, 8, 5, 13, 14, 15, 16],
                    mirror: 16
                }
            },
            t, y;
        h = [];
        LEGAL.doHide();
        __snds.stopSound("music");
        music_playing = null;
        var z = document.getElementById("canvas_game"),
            A, p, q, B, r, G, C, D, E, w, x;
        c.left_down = !1;
        c.right_down = !1;
        this.doInit = function () {
            A = z.renderer || new THREE.WebGLRenderer({
                canvas: z,
                antialias: !0,
                alpha: !1,
                shadows: !1
            });
            p = new THREE.Scene;
            q = new THREE.PerspectiveCamera(40, oSTAGE.screen_width / oSTAGE.screen_height, .1, 500);
            p.add(q);
            g = new THREE.Group;
            g.position.set(0, 0, -1);
            q.add(g);
            c.doCreateScoreDigits();
            f = new THREE.Group;
            f.position.set(0, 0, -1);
            q.add(f);
            c.doCreatePowerUpMeter(a);
            d = new THREE.Group;
            d.position.set(0, 0, -1);
            q.add(d);
            c.doCreateHealthMeter(a);
            var b = new THREE.AmbientLight(new THREE.Color(.9, .9, .9));
            p.add(b);
            B = b;
            p.background = oMODELS.sky;
            oMODELS.sky.repeat = new THREE.Vector2(oSTAGE.screen_width / oSTAGE.screen_height * .25, 1);
            oMODELS.sky.wrapS = THREE.RepeatWrapping;
            r = new THREE.Group;
            p.add(r);
            c.shipPieces = [];
            for (b = 1; 13 > b; b++) {
                oMODELS["Ship_" + padZero(b, 2)].material.color = new THREE.Color("white");
                var e = oMODELS["Ship_" + padZero(b, 2)].clone();
                e.rotateY(Math.PI / 2);
                e.material.map.minFilter = THREE.LinearMipMapLinearFilter;
                e.castShadow = !1;
                e.receiveShadow = !0;
                n[b].obj = e
            }
            var h = -c.pieceWidth;
            for (b = 13; 17 > b; b++) e = oMODELS.Ship_05.clone(),
                e.rotateY(Math.PI / 2), e.material.map.minFilter = THREE.LinearMipMapLinearFilter, e.castShadow = !1, e.receiveShadow = !0, n[b].obj = e, n[b].active = !0, c.shipPieces.push(n[b]), r.add(e), e.translateZ(h), h += c.pieceWidth;
            G = c.doCreatePlayer(a);
            r.add(G);
            C = new SPE.Group({
                texture: {
                    value: oMODELS.particle_water
                },
                blending: THREE.AdditiveBlending,
                transparent: !0,
                maxParticleCount: 60
            });
            w = new SPE.Emitter({
                particleCount: 60,
                duration: .5,
                maxAge: {
                    value: 1
                },
                activeMultiplier: 2,
                position: {
                    value: new THREE.Vector3(0, 0, 0),
                    spread: new THREE.Vector3(1,
                        1, 1)
                },
                velocity: {
                    value: new THREE.Vector3(0, 12, 0),
                    spread: new THREE.Vector3(16, 24, 1)
                },
                acceleration: {
                    value: new THREE.Vector3(0, -64, 0)
                },
                size: {
                    value: [2 * oSTAGE.scale, 1 * oSTAGE.scale],
                    spread: [2 * oSTAGE.scale]
                },
                angle: {
                    value: [__utils.radFromDeg(0), __utils.radFromDeg(0)]
                }
            });
            C.addEmitter(w);
            p.add(C.mesh);
            D = new SPE.Group({
                texture: {
                    value: oMODELS.particle_cloud
                },
                blending: THREE.AdditiveBlending,
                transparent: !0,
                maxParticleCount: 20
            });
            SPE.valueOverLifetimeLength = 3;
            x = new SPE.Emitter({
                particleCount: 20,
                duration: .5,
                maxAge: {
                    value: 1
                },
                activeMultiplier: 2,
                position: {
                    value: new THREE.Vector3(0, 0, 0),
                    spread: new THREE.Vector3(3, 3, 3)
                },
                drag: {
                    value: 1
                },
                velocity: {
                    value: new THREE.Vector3(0, 0, 0),
                    spread: new THREE.Vector3(10, 10, 1)
                },
                size: {
                    value: [2 * oSTAGE.scale, 16 * oSTAGE.scale],
                    spread: [4 * oSTAGE.scale]
                },
                opacity: {
                    value: [1, 0]
                }
            });
            D.addEmitter(x);
            p.add(D.mesh);
            m = c.doCreateObstacles();
            w.disable();
            x.disable();
            c.doUpdateShip(0);
            q.position.set(0, 6, 30);
            q.lookAt(new THREE.Vector3(0, 3.5, 0));
            A.render(p, q);
            c.doResizeUpdate();
            t = {
                doResizeUpdate: c.doResizeUpdate
            };
            update_queue.push(t);
            y = {
                doUpdate: c.doFrameUpdate
            };
            actives.push(y);
            z.style.opacity = 1;
            z.style.display = "block";
            SCREEN.doShowMessage(oLANG.msg_ready, null);
            setTimeout(c.doGo, 2E3)
        };
        this.doCreateScoreDigits = function () {
            E = [];
            for (var a, b = 0; 6 >= b; b++) a = new THREE.SpriteMaterial({
                map: oMODELS.score_digits.clone(),
                fog: !1,
                flatShading: !0,
                transparent: !0
            }), a = new THREE.Sprite(a), a.material.map.repeat = new THREE.Vector2(.1, 1), a.material.map.offset = new THREE.Vector2(.1 * b, 0), a.material.map.needsUpdate = !0, a.center = new THREE.Vector2(0,
                1), a.position.set(.0575 * b, 0, 1E-4 * b), a.scale.set(.0764928, .096, 1), a.renderDepth = 1, g.add(a), E.push(a);
            c.doUpdateGameScore()
        };
        this.doUpdateGameScore = function () {
            var a, b = String(c.score).split(""),
                e = 0;
            for (a = 0; a < b.length; a++) {
                var d = E[e];
                d.position.x = .0575 * (a - b.length / 2);
                d.material.map.offset.x = .1 * parseInt(b[a]);
                d.visible = !0;
                e++
            }
            for (a = Math.max(2, e + 1); 7 >= a; a++) d = E[a - 1], d.visible = !1
        };
        this.doCreatePowerUpMeter = function (a) {
            f.centerX = 108;
            f.centerY = 558;
            f.radius = 77;
            var c = {
                    PowerIcon: {
                        image: "PowerIcon1",
                        left: 54,
                        top: 509,
                        width: 105,
                        height: 92
                    },
                    PowerEdgeGlow: {
                        image: "PowerEdgeGlow",
                        left: 166,
                        top: 552,
                        width: 39,
                        height: 19,
                        glow: !0
                    },
                    PowerButton: {
                        image: "PowerButton",
                        left: 22,
                        top: 483,
                        width: 171,
                        height: 167
                    },
                    PowerMeter: {
                        image: "PowerMeter",
                        left: 1,
                        top: 462,
                        width: 212,
                        height: 188,
                        radialMeter: !0
                    },
                    PowerMeterBase: {
                        image: "PowerMeterBase",
                        left: 10,
                        top: 471,
                        width: 195,
                        height: 179
                    }
                },
                e = 0;
            Object.keys(c).forEach(function (a) {
                a = c[a];
                oMODELS[a.image].wrapS = oMODELS[a.image].wrapT = THREE.ClampToEdgeWrapping;
                a.sprite_map = !0 === a.radialMeter ? f.meterShader = RadialMask(oMODELS[a.image],
                    0) : new THREE.MeshBasicMaterial({
                    name: a.image + "_mat",
                    transparent: !0,
                    map: oMODELS[a.image],
                    side: THREE.FrontSide
                });
                var b = new THREE.PlaneGeometry(1, 1, 1, 1);
                a.sprite = new THREE.Mesh(b, a.sprite_map);
                a.sprite.position.set(4.5E-4 * (a.left - f.centerX + a.width / 2), 4.5E-4 * (f.centerY - a.top - a.height / 2), .001 * -e);
                !0 === a.radialMeter && (f.spriteCenter = new THREE.Vector3(4.5E-4 * (a.left - f.centerX + a.width / 2), 4.5E-4 * (f.centerY - a.top - a.height / 2), .001 * -e));
                !0 === a.glow && (f.meterGlow = a.sprite);
                a.sprite.renderOrder = 10 - e;
                a.sprite.scale.set(4.5E-4 *
                    a.width, 4.5E-4 * a.height, 1);
                e++;
                f.add(a.sprite)
            });
            f.cssBaseCoords = c;
            f.chargeUpTiming = 0;
            f.doUpdate = function () {
                if (Date.now() > f.chargeUpTiming) {
                    f.chargeUpTiming = Date.now() + 84;
                    b.powerupTriggered ? (b.chargeLevel -= b.dischargeRate, 0 > b.chargeLevel && (b.chargeLevel = 0, b.powerupTriggered = !1)) : (b.chargeLevel += b.refillRate, 1 < b.chargeLevel && (b.chargeLevel = 1));
                    f.meterShader.uniforms.tLevel.value = b.chargeLevel / 2;
                    f.meterShader.needsUpdate = !0;
                    var a = Math.PI * b.chargeLevel;
                    f.meterGlow.rotation.z = -a;
                    f.meterGlow.position.set(f.spriteCenter.x +
                        -Math.cos(a) * f.radius * 4.5E-4, f.spriteCenter.y + Math.sin(a) * f.radius * 4.5E-4, f.meterGlow.position.z)
                }
            }
        };
        this.doCreateHealthMeter = function (a) {
            var e = [0, 0, 1 / 12, 1 / 12, 1 / 12][a];
            switch (a) {
                case 1:
                    var f = {
                        PowerMeterBase: {
                            image: "Health_4",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188,
                            radialMeter: !0
                        },
                        PowerMeter: {
                            image: "Drac_Health",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188
                        }
                    };
                    c.max_health = 4;
                    break;
                case 2:
                    f = {
                        PowerMeterBase: {
                            image: "Health_3",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188,
                            radialMeter: !0
                        },
                        PowerMeter: {
                            image: "Mavis_Health",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188
                        }
                    };
                    c.max_health = 3;
                    break;
                case 3:
                    f = {
                        PowerMeterBase: {
                            image: "Health_6",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188,
                            radialMeter: !0
                        },
                        PowerMeter: {
                            image: "Frank_Health",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188
                        }
                    };
                    c.max_health = 6;
                    break;
                case 4:
                    f = {
                        PowerMeterBase: {
                            image: "Health_3",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188,
                            radialMeter: !0
                        },
                        PowerMeter: {
                            image: "Murray_Health",
                            left: 1,
                            top: 1,
                            width: 188,
                            height: 188
                        }
                    }, c.max_health = 3
            }
            var g = 0;
            Object.keys(f).forEach(function (a) {
                a = f[a];
                oMODELS[a.image].wrapS = oMODELS[a.image].wrapT =
                    THREE.ClampToEdgeWrapping;
                a.sprite_map = !0 === a.radialMeter ? d.meterShader = RadialMask(oMODELS[a.image], 1, e) : new THREE.MeshBasicMaterial({
                    name: a.image + "_mat",
                    transparent: !0,
                    map: oMODELS[a.image],
                    side: THREE.FrontSide
                });
                var b = new THREE.PlaneGeometry(1, 1, 1, 1);
                a.sprite = new THREE.Mesh(b, a.sprite_map);
                a.sprite.position.set(5E-4 * (a.left - 94 + a.width / 2), 5E-4 * (94 - a.top - a.height / 2), .001 * -g);
                a.sprite.renderOrder = 13 - g;
                a.sprite.scale.set(5E-4 * a.width, 5E-4 * a.height, 1);
                g++;
                d.add(a.sprite)
            });
            d.cssBaseCoords = f;
            d.updateHealth =
                function () {
                    d.meterShader.uniforms.tLevel.value = 1 * b.health / c.max_health;
                    d.meterShader.needsUpdate = !0
                }
        };
        this.doDestroy = function () {
            h = [];
            C.dispose();
            t.forget = !0;
            y.forget = !0;
            if (p)
                for (; 0 < p.children.length;) p.remove(p.children[0]);
            p = null;
            TweenLite.to(z, .5, {
                opacity: 0,
                overwrite: !0,
                onComplete: function () {
                    z.style.display = "none"
                }
            });
            is_active = !1;
            GAME = null
        };
        this.doResizeUpdate = function () {
            p.background = new THREE.Color("#06355f");
            q.aspect = oSTAGE.screen_width / oSTAGE.screen_height;
            q.updateProjectionMatrix();
            oMODELS.sky.repeat =
                new THREE.Vector2(oSTAGE.screen_width / oSTAGE.screen_height * .5, 1);
            A.setSize(oSTAGE.screen_width, oSTAGE.screen_height);
            var a = oSTAGE.is_landscape ? oCONFIG.landscale_target_width : oCONFIG.portrait_target_width;
            q.position.x = -3;
            var b = A.getSize(),
                c = b.width / b.height;
            q.fov = 180 / Math.PI * Math.atan(a / c / 48) * 2;
            q.updateProjectionMatrix();
            a = 2 * Math.tan(q.fov * Math.PI / 180 / 2);
            c *= a;
            var e = c / b.width;
            b = a / b.height;
            oSTAGE.pixelRatio = e;
            g.position.set(10 * e * oSTAGE.scale, .5 * a - 10 * e * oSTAGE.scale, -1);
            f.position.set(.5 * -c + 80 * e * oSTAGE.scale,
                .5 * -a + 120 * b * oSTAGE.scale, -1);
            d.position.set(.5 * -c + 80 * e * oSTAGE.scale, .5 * a - 80 * b * oSTAGE.scale, -1);
            b = 1 * window.innerWidth / window.innerHeight;
            b = Math.min(2, Math.max(.25, b));
            b = (b - .25) / 1.75 * -1.2 + 2.5;
            f.scale.set(b, b, b);
            d.scale.set(b, b, b);
            q.position.y = Math.max(0, -(15 - 24 * Math.tan(q.fov * Math.PI / 180 * .5))) + 3.5;
            q.lookAt.y = q.position.y - 3.5;
            A.render(p, q)
        };
        this.doPause = function () {
            c.is_paused = !0;
            new PopupPause([{
                snd: "snd_click",
                msg: oLANG.quit,
                callback: c.doQuit
            }, {
                snd: "snd_click",
                msg: oLANG.resume,
                callback: c.doUnPause
            }])
        };
        this.doUnPause = function () {
            c.is_paused = !1
        };
        this.doQuit = function () {
            __snds.stopSound("music");
            CONTROLS.doHidePause();
            SCREEN = new TitleScreen;
            LEGAL.doShow();
            c.doDestroy()
        };
        this.doPause = function () {
            c.is_paused = !0;
            new PopupPause([{
                snd: "snd_click",
                msg: oLANG.quit,
                callback: c.doQuit
            }, {
                snd: "snd_click",
                msg: oLANG.resume,
                callback: c.doUnPause
            }])
        };
        this.doUnPause = function () {
            c.is_paused = !1
        };
        this.doQuit = function () {
            __snds.stopSound("music");
            CONTROLS.doHidePause();
            SCREEN = new TitleScreen;
            LEGAL.doShow();
            c.doDestroy()
        };
        this.doGo =
            function () {
                trace("GO!");
                SCREEN.doShowMessage(oLANG.msg_go, 1);
                clock.start();
                k = !0;
                __snds.playSound("music_game_loop", "music", -1, .25);
                CONTROLS.doShowPause();
                c.doNextTilt()
            };
        var H = 0;
        this.doGameOver = function () {
            if (!(0 < u)) {
                trace("GAME OVER!");
                __snds.stopSound("running");
                clock.stop();
                SCREEN.doShowMessage(oLANG.msg_gameover, null);
                b.splash || b.setAnim("Stand");
                u = 1;
                k = !1;
                b.jumping = !1;
                b.isFalling = !1;
                b.ducking = !1;
                b.incy = 0;
                b.curY = b.baseY;
                b.playerSprite.position.set(b.curX, b.curY, b.baseZ);
                var e = 0 < oUSER.char1 && (0 <
                        oUSER.char2 || 0 < oUSER.char4) || 0 < oUSER.char2 && (0 < oUSER.char1 || 0 < oUSER.char4),
                    d = 500 < Math.max(oUSER.char1, oUSER.char2, oUSER.char3, oUSER.char4);
                oUSER.best_score = Math.max(oUSER.best_score, c.score);
                oUSER["char" + a] = Math.max(oUSER["char" + a], c.score);
                __localsaver.doSaveData("user", oUSER);
                var f = 0 < oUSER.char1 && (0 < oUSER.char2 || 0 < oUSER.char4) || 0 < oUSER.char2 && (0 < oUSER.char1 || 0 < oUSER.char4),
                    g = 500 < Math.max(oUSER.char1, oUSER.char2, oUSER.char3, oUSER.char4);
                H = !d && g ? 1 : 0;
                H += !e && f ? 2 : 0;
                __snds.playSound("music_game_end",
                    "music", 1, .25);
                CONTROLS.doHidePause();
                setTimeout(c.doGotoRecap, 3E3)
            }
        };
        this.doGotoRecap = function () {
            SCREEN = new RecapScreen(H);
            LEGAL.doShow();
            c.doDestroy()
        };
        this.doUpdateShip = function (a) {
            c.shipPos += a;
            a = Math.floor(Math.abs(c.shipPos / 3));
            c.score !== a && 0 === u && (c.score = a, c.doUpdateGameScore());
            r.position.x = c.shipPos;
            0 === u && (G.position.x = -c.shipPos - 7);
            a = b.ground;
            b.ground = 0;
            6 === this.shipPieces[1].id && (b.ground = -1);
            if (7 === this.shipPieces[1].id || 8 === this.shipPieces[1].id) b.ground = -13 > this.shipPieces[1].obj.position.x +
                c.shipPos ? 0 : -1;
            a !== b.ground && (trace("ground switch:" + b.ground), 0 > b.ground && !b.jumping ? (b.jumping = !0, b.incy = 0) : b.curY = Math.max(b.baseY, b.curY));
            if (this.shipPieces[0].obj.position.x + c.shipPos < e) {
                r.remove(this.shipPieces[0].obj);
                this.shipPieces[0].active = !1;
                this.shipPieces.splice(0, 1);
                var d = this.shipPieces[this.shipPieces.length - 1],
                    f = d.next.concat([]),
                    g = rndInt(Math.max(1, f.length - 1));
                a = f[g];
                for (var v = 100;
                    (150 > c.score && 6 === a || -1 < this.shipPieces.indexOf(n[a])) && 0 < v--;) f.splice(g, 1), f.push(a), g = rndInt(Math.max(1,
                    f.length - 1)), a = f[g];
                n[a].active = !0;
                this.shipPieces.push(n[a]);
                f = n[a].obj;
                r.add(f);
                f.position.x = d.obj.position.x + this.pieceWidth;
                f.position.z = d.obj.position.z;
                d = l[n[a].type];
                if (void 0 !== d && 0 < d.length) {
                    g = 0;
                    d = 1 == a ? d.concat(l.door) : d.concat([]);
                    v = .4 + .02 * c.score > Math.random() ? 1 : 0;
                    var h = Math.min(.02 * c.score, 8),
                        k = 0;
                    h = Math.random() * h - h / 2;
                    6 === a && (g = -4.5, v = 2, k = 10);
                    7 === a && (g = -4.5, v = 2, k = 10);
                    8 === a && (g = 0, v = 1, k = 10);
                    1 == v && 100 < c.score && (v = .001 * c.score > Math.random() ? 2 : 1, 1 < v && (h -= 2, k = 4));
                    for (var F = f.position.clone(),
                            q; 0 < v--;) {
                        void 0 !== n[a].x && (F.x += n[a].x);
                        for (var p = d[rndInt(d.length)]; p.active && 1 < d.length;) d.splice(d.indexOf(p), 1), p = d[rndInt(d.length)];
                        q = p.mode;
                        p.active || ("door" === p.type ? m.init(p, new THREE.Vector3(f.position.x, 4.88, f.position.z + 2.26), 9.5, F) : (m.init(p, new THREE.Vector3(h + f.position.x + g, p.y + .5 + p.s / 2, b.baseZ + .2), 1.3 * p.s, F), g += k));
                        if (p.is3D) break;
                        else
                            for (p = d.length - 1; 0 <= p; p--)(d[p].is3D || d[p].mode !== q) && d.splice(p, 1)
                    }
                }
            }
        };
        var b;
        this.doCreatePlayer = function (a) {
            b = new THREE.Group;
            b.incy = 0;
            b.curX = b.targetX =
                0;
            b.jumping = !1;
            b.ducking = !1;
            b.splash = !1;
            b.powerupTriggered = !1;
            b.chargeLevel = 0;
            b.resetting = !1;
            b.ground = 0;
            b.animation = new Atlas;
            b.lives = b.baseLives = playerParams[a].lives;
            b.refillRate = playerParams[a].refillRate;
            b.dischargeRate = playerParams[a].dischargeRate;
            b.gravity = playerParams[a].gravity;
            b.jumpImpulse = playerParams[a].jumpImpulse;
            b.health = playerParams[a].health;
            c.moveRate = c.baseMoveRate = playerParams[a].moveRate;
            b.jumpMoveRate = playerParams[a].jumpMoveRate;
            b.brakeMoveRate = playerParams[a].brakeMoveRate;
            b.baseY = b.curY = playerParams[a].baseY;
            b.baseZ = playerParams[a].baseZ;
            b.runSound = playerParams[a].runSound;
            b.duckSound = playerParams[a].duckSound;
            b.specialSound = playerParams[a].specialSound;
            b.playerSprite = b.animation.Init(playerParams[a].id + "_", b.baseY, animations[playerParams[a].id], playerParams[a].id + "_Atlas", "media/models/" + playerParams[a].id + "_.json");
            b.animation.startAnim("Run");
            b.add(b.playerSprite);
            b.playerSprite.position.set(b.curX, b.baseY, b.baseZ);
            b.playerSprite.scale.set(2 * b.baseY, 2 * b.baseY, 1);
            b.playerSprite.doubleSided = !0;
            b.playerSprite.renderOrder = 1;
            b.isFalling = !1;
            b.immuneTime = 0;
            b.doUpdate = function () {
                if (!(0 < u))
                    if (b.splash) c.moveRate *= .95;
                    else if (b.curX = .975 * b.curX + .025 * b.targetX, b.jumping) {
                    c.moveRate = b.jumpMoveRate;
                    b.curY += b.incy;
                    b.incy += b.gravity;
                    switch (b.jumpPhase) {
                        case 0:
                            b.jumpPhase = 1;
                            break;
                        case 1:
                            .1 > b.incy && (b.jumpPhase = 2);
                            break;
                        case 2:
                            -.1 > b.incy && (b.jumpPhase = 3)
                    }
                    b.curY < b.baseY + b.ground && 0 > b.incy && (b.curY = b.baseY + b.ground, b.setAnim("Land"), b.jumping = !1, b.restarting = !1, c.moveRate =
                        c.baseMoveRate);
                    b.playerSprite.position.set(b.curX, b.curY, b.baseZ)
                } else b.playerSprite.position.set(b.curX, b.curY, b.baseZ), 0 > b.ground && !b.onFloatie && !b.restarting && (b.splash = !0, b.jumping = !1, b.setAnim("Splash"), b.hit(), w.position.value = new THREE.Vector3(-7, 0, 0), w.enable());
                b.animation.stepAnimation()
            };
            b.setAnim = function (a) {
                0 === u && b.animation.currentAnim !== a && b.animation.startAnim(a)
            };
            b.jump = function () {
                b.ducking = !1;
                b.jumping = !0;
                b.jumpPhase = 0;
                b.curY = b.baseY;
                b.incy = b.jumpImpulse
            };
            b.hit = function () {
                Date.now() >
                    b.immuneTime && (b.immuneTime = Date.now() + 1E3, b.ducking = !1, b.powerupTriggered = !1, b.targetX = 0, b.health--, 0 >= b.health && c.doGameOver(), d.updateHealth())
            };
            b.restartPlayer = function (a) {
                b.restarting || (b.restarting = !0, b.curX -= 6, b.curY = b.baseY, b.jumping = !0, powerupTriggered = b.ducking = !1, b.incy = b.jumpImpulse, b.splash = !1, b.setAnim("JumpStart"), w.position.value = new THREE.Vector3(-10, 0, 0), w.enable())
            };
            h.push(b);
            return b
        };
        this.doCreateObstacles = function () {
            this.objs = [];
            var d = this;
            this.curObject = 0;
            l = {};
            var f = animations.Obstacles,
                g = Object.keys(f);
            this.numObjs = g.length;
            g.forEach(function (a) {
                var b = f[a];
                void 0 === b.chain && (b.chain = "");
                b.is3D = void 0 !== b.model;
                b.hittable = b.is3D || "" !== b.chain || void 0 !== b.atlasId;
                if (b.is3D) b.obj = oMODELS[b.model].clone(), b.obj.rotateY(Math.PI / 2), b.obj.material.map.minFilter = THREE.LinearMipMapLinearFilter, b.obj.material.color = new THREE.Color("white"), b.obj.castShadow = !1, b.obj.receiveShadow = !1, b.isAnimated = !1;
                else {
                    b.atlas = new Atlas;
                    var c = b.gridSize || 1;
                    void 0 !== b.atlasId ? (b.sprite = b.atlas.Init(b.name,
                        b.s, b.animDef, b.atlasId, b.atlasUrl), b.atlas.startAnim("default"), b.isAnimated = !0) : (b.sprite = b.atlas.Init(b.name, c), b.isAnimated = !1);
                    b.sprite.center = new THREE.Vector2(.5, 0);
                    b.sprite.renderOrder = "door" === b.type || "doorhit" === b.type ? 0 : 4
                }
                b.id = a;
                void 0 === l[b.type] ? l[b.type] = [f[a]] : l[b.type].push(f[a]);
                b.active = !1;
                d.objs.push(b)
            });
            this.init = function (a, b, c, d) {
                a.hitPos = b;
                a.active = !0;
                a.animationTime = 0;
                a.is3D ? (a.obj.position.set(d.x, d.y + a.y - 3, d.z), r.add(a.obj)) : (a.atlas.startAnim(), a.sprite.position.set(b.x,
                    b.y, b.z), a.sprite.scale.set(c, c, c), r.add(a.sprite))
            };
            this.doUpdate = function () {
                b.onFloatie = !1;
                for (var g = 0; g < c.numObjs; g++) {
                    var h = d.objs[g];
                    if (h.active) {
                        var k = Math.abs(h.hitPos.x + c.shipPos + 7 - b.curX);
                        "hi3d" === h.mode && trace(h.name + "  " + k);
                        h.isAnimated && (h.sprite.position.set(h.hitPos.x, h.hitPos.y, h.hitPos.z), h.atlas.stepAnimation());
                        if ("fl" === h.mode) k < h.w && (b.onFloatie = !0, 1 > b.curY && b.jump());
                        else if (h.hittable) {
                            "Bat_" === h.name && Date.now() > h.animationTime && (h.animationTime = Date.now() + 42, h.hitPos.x -= .001 *
                                c.score);
                            var l = !1;
                            if (k < h.w || 1 === a && b.powerupTriggered && 10 > k && 0 === u) {
                                switch (h.mode) {
                                    case "ta":
                                        b.jumping && b.curY > h.sprite.position.y + 3 || (l = !0);
                                        break;
                                    case "lo":
                                        b.jumping || (l = !0);
                                        break;
                                    case "hi":
                                        b.ducking || b.jumping && b.curY > h.sprite.position.y + 2 || (l = !0);
                                        break;
                                    case "hi3d":
                                        b.ducking || (l = !0)
                                }
                                l && (b.powerupTriggered || (b.hit(), b.isFalling = !0, b.setAnim("FallAndUp")), x.position.value = new THREE.Vector3(-7, 3, 0), x.enable(), h.is3D ? h.obj.position.y += .5 : ("" !== h.chain && (k = "Cruise_Hit", void 0 !== h.sound && (k = "Cruise_ZombieHit"),
                                    __snds.playSound(k, "sfx", 1, .25), "door" == h.type ? d.init(f[h.chain], h.sprite.position, 9.5) : d.init(f[h.chain], h.sprite.position, h.sprite.scale.x)), r.remove(h.sprite)), h.active = !1)
                            }
                        }
                        h.is3D ? h.obj.position.x + c.shipPos < e && (h.active = !1, r.remove(h.obj)) : h.sprite.position.x + c.shipPos < e && (h.active = !1, r.remove(h.sprite))
                    }
                }
            };
            h.push(d);
            return this
        };
        var u = 0,
            K = new __utils.NewPulse(5, {
                seed: 180
            }),
            L = new __utils.NewPulse(8),
            J = new __utils.NewPulse(2),
            I = -1;
        this.doNextTilt = function () {
            k && (I++, I > game_sequence.length - 1 && (I =
                0))
        };
        this.doFrameUpdate = function () {
            clock.getDelta();
            if (p && !c.is_paused) {
                J.update();
                L.update();
                K.update();
                1 < B.intensity && (2 < B.intensity && 3 == rndInt(10) && (B.intensity = 10), B.intensity = Math.max(1, .8 * B.intensity));
                r.position.z = -2;
                document_blurred || (r.position.y = -2 + 1 * J.value);
                switch (u) {
                    case 0:
                        if (document_blurred) break;
                        void 0 !== c.doUpdateShip && (c.effectiveMoveRate = .9 * c.effectiveMoveRate + .1 * c.moveRate, c.doUpdateShip(c.effectiveMoveRate));
                        var d = !1; - 100 < thisTouch.x && -.6 > thisTouch.x && -.6 > thisTouch.y && (d = !0); -
                        1 !== __input.keys_down.indexOf(65) && (u = 3);
                        if (b.isFalling)
                            if (b.animation.frameNum >= b.animation.numFrames - 1) b.isFalling = !1, c.moveRate = c.baseMoveRate, b.jumping = !1, b.powerupTriggered = !1, b.ducking = !1;
                            else {
                                b.powerupTriggered = !1;
                                b.curY = .9 * b.curY + .1 * b.baseY;
                                c.moveRate *= .95;
                                break
                            }
                        if (b.splash) {
                            3 < b.animation.frameNum && ("Cruise_Splash" != __snds.getNowPlaying("running") && __snds.playSound("Cruise_Splash", "running", 0, .5), c.moveRate = b.jumpMoveRate, 0 <= b.ground && (b.restartPlayer(!0), c.moveRate = c.baseMoveRate, c.effectiveMoveRate =
                                .01));
                            break
                        }
                        __input.space || d ? .25 < b.chargeLevel && !b.powerupTriggered && (__snds.playSound(b.specialSound, "running", -1, .5), 2 === a && (x.position.value = new THREE.Vector3(-7, 3, 0), x.enable()), b.powerupTriggered = !0, b.setAnim("SpecialStart")) : b.powerupTriggered = !1;
                        f.doUpdate();
                        d = b.jumping || b.powerupTriggered;
                        !__input.up && 1 !== __lastSwipe || b.jumping || b.powerupTriggered || (b.setAnim("JumpStart"), __snds.playSound("Cruise_Jump", "running", 0, .5), __input.up = !1, b.jump(), d = !0, __lastSwipe = -1);
                        !__input.dn && 3 !== __lastSwipe ||
                            b.powerupTriggered || (b.jumping ? b.incy -= .05 : b.ducking || (__snds.playSound(b.duckSound, "running", 0, .5), b.powerupTriggered || b.setAnim("Duck"), b.ducking = !0), d = !0);
                        if (__input.left || 4 === __lastSwipe) "Brake" === b.animation.currentAnim || b.jumping || b.ducking || b.powerupTriggered || b.setAnim("Brake"), b.targetX = -2, c.moveRate = b.brakeMoveRate, d = !0;
                        if (__input.right || 2 === __lastSwipe) "Run" === b.animation.currentAnim || b.jumping || b.ducking || b.powerupTriggered || b.setAnim("Run"), b.targetX = 2, 1.95 < b.curX ? b.targetX = 0 : d = !0;
                        d ||
                            (__snds.getNowPlaying("running") != b.runSound && __snds.playSound(b.runSound, "running", -1, .5), b.targetX = 0, b.ducking = !1, b.setAnim("Run"));
                        break;
                    case 1:
                        c.doUpdateShip(-.15);
                        b.curY = b.baseY;
                        c.moveRate *= .95;
                        b.playerSprite.position.set(b.curX, b.curY, b.baseZ);
                        b.animation.stepAnimation();
                        break;
                    case 3:
                        if (c.moveRate = 0, -1 !== __input.keys_down.indexOf(81) && (u = 0), __input.space && (b.animation.testCellNum = 1), __input.left || __input.right || 2 == __lastSwipe || 4 == __lastSwipe) b.animation.animating ? (b.animation.animating = !1, b.animation.testCellNum =
                            1, b.animation.testCellNextUpdate = Date.now() + 500, b.playerSprite.position.set(b.curX, b.curY, b.baseZ), b.animation.setCell(1)) : Date.now() > b.animation.testCellNextUpdate && (b.animation.testCellNextUpdate = Date.now() + 500, (__input.right || 2 == __lastSwipe) && b.animation.testCellNum++, (__input.left || 4 == __lastSwipe) && b.animation.testCellNum--, 1 > b.animation.testCellNum && (b.animation.testCellNum = b.animation.maxAtlas - 1), b.animation.testCellNum >= b.animation.maxAtlas && (b.animation.testCellNum = 1), b.playerSprite.position.set(b.curX,
                            b.curY, b.baseZ), b.animation.setCell(b.animation.testCellNum), __lastSwipe = -1), c.score = b.animation.testCellNum, c.doUpdateGameScore()
                }
                if (!1 === document_blurred) {
                    for (d = 0; d < h.length; d++) h[d].doUpdate();
                    oMODELS.sky.offset.x += .005;
                    C.tick(void 0);
                    D.tick(void 0)
                }
                A.render(p, q);
                p.background = oMODELS.sky
            }
        };
        c.doInit()
    };
var __snds, __utils, __localscaver, __input, oSTAGE, oLANG, oLANG_IMAGES, oVARS, oCONFIG, oUSER, oMODELS, LOADER, THREELOADER, SCREEN, CONTROLS, LEGAL, GAME, images, update_queue = [],
    actives = [],
    window_in_background = !1,
    game_is_active = !1,
    date_msg, stats, loader, clock = new THREE.Clock(!0);

function doFrameLoop() {
    stats && stats.begin();
    for (var a = 0; a < actives.length; a++) actives[a].purge || actives[a].forget ? actives.splice(a, 1) : actives[a].doUpdate ? actives[a].doUpdate() : actives.splice(a, 1);
    stats && stats.end();
    requestAnimationFrame(doFrameLoop)
}

function doInit() {
    oCONFIG.debug_stats && (stats = new Stats, stats.showPanel(0), document.body.appendChild(stats.dom));
    __utils = new BlitTools;
    __snds = new myNameSpace.BlitSounds;
    __localsaver = new BlitSaver;
    __input = new BlitInputs;
    loader = new createjs.LoadQueue(!1);
    loader.installPlugin(createjs.Sound);
    doFrameLoop();
    oVARS = __utils.getQueryString();
    oSTAGE = {};
    var a = document.getElementById("canvas_game");
    a.renderer = new THREE.WebGLRenderer({
        canvas: a,
        antialias: !0,
        alpha: !1,
        shadows: !1
    });
    a.renderer.autoClear = !1;
    a.renderer.shadowMap.enabled = !0;
    oUSER = __localsaver.doGetData("user");
    oUSER || (oUSER = {
        is_mute: !1,
        best_score: 0
    }, __localsaver.doSaveData("user", oUSER));
    doInitResizer();
    doWindowResize();
    a = new Date(date_day_before);
    var c = new Date(date_week_before),
        e = new Date;
    date_msg = e >= new Date(date_playing) ? oLANG.date_msg_4 : e >= a ? oLANG.date_msg_3 : e >= c ? oLANG.date_msg_2 : oLANG.date_msg_1;
    __utils.doInitFocusManager(doLoseFocus, doGetFocus);
    doPreloadAssets()
}

function doLoseFocus() {
    __snds.forceMute();
    window_in_background = !0;
    GAME && GAME.doPause()
}

function doGetFocus() {
    window_in_background = !1;
    GAME ? GAME.is_paused || __snds.unforceMute() : __snds.unforceMute()
}

function doPreloadAssets() {
    for (var a = 0; a < legal_images.length; a++) {
        var c = legal_images[a].src;
        photo_name = c.substr(c.lastIndexOf("/") + 1);
        assets_preload.manifest.push({
            src: c,
            id: photo_name
        })
    }
    var e = my_performance.now();
    __utils.doLoadAssets(assets_preload);
    LOADER = new Loader(!0);
    LOADER.doUpdate = function () {
        this.doUpdateBar(assets_preload.progress);
        if (assets_preload.loaded) {
            this.forget = !0;
            var a = my_performance.now() - e;
            window.setTimeout(function () {
                doStart();
                LOADER.doFadeAndDestroy()
            }, Math.max(0, 1E3 * oCONFIG.splash_hold -
                a))
        }
    };
    actives.push(LOADER)
}

function doStart() {
    LEGAL = new LegalPanel;
    CONTROLS = new ControlsPanel;
    SCREEN = new TitleScreen;
    __utils.doLoadAssets(assets_additional);
    oMODELS = {};
    __utils.doLoad3dAssets(assets_threejs, oMODELS)
}

function doFinishLoading(a) {
    LOADER = new Loader(!0);
    LOADER.doUpdate = function () {
        this.doUpdateBar(.5 * (assets_additional.progress + assets_threejs.progress));
        assets_additional.loaded && assets_threejs.loaded && (this.purge = !0, a && a(), LOADER.doFadeAndDestroy())
    };
    actives.push(LOADER)
}

function doInitResizer() {
    var a = document.createElement("div");
    a.id = "resizer";
    a.w = null;
    a.h = null;
    a.keep = !0;
    a.doUpdate = function () {
        if (this.w != window.innerWidth || this.h != window.innerHeight) this.w = window.innerWidth, this.h = window.innerHeight, doWindowResize(), window.scrollTo(0, 1)
    };
    actives.push(a);
    window.addEventListener("orientationchange", function () {
        a.w = 0;
        a.h = 0
    });
    window.addEventListener("blur", function (a) {
        __snds.forceMute();
        document_blurred = !0
    });
    window.addEventListener("focus", function (c) {
        __snds.unforceMute();
        document_blurred = !1;
        a.w = 0;
        a.h = 0
    })
}

function doWindowResize() {
    window.innerWidth > window.innerHeight ? (oSTAGE.is_landscape = !0, oSTAGE.scale = Math.min(Infinity, Math.min(window.innerHeight / 550, window.innerWidth / 900))) : (oSTAGE.is_landscape = !1, oSTAGE.scale = Math.min(Infinity, Math.min(window.innerHeight / 800, window.innerWidth / 600)));
    oSTAGE.scale_inv = 1 / oSTAGE.scale;
    oSTAGE.screen_width = Math.ceil(window.innerWidth);
    oSTAGE.screen_height = Math.ceil(window.innerHeight);
    oSTAGE.window_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
    oSTAGE.window_height =
        Math.ceil(window.innerHeight * oSTAGE.scale_inv);
    oSTAGE.wrapper_height = Math.ceil(window.innerHeight * oSTAGE.scale_inv);
    oSTAGE.wrapper_width = Math.ceil(window.innerWidth * oSTAGE.scale_inv);
    oSTAGE.wrapper_ratio = oSTAGE.wrapper_height / oSTAGE.wrapper_width;
    oSTAGE.physical_ppi = __utils.getPPI();
    oSTAGE.ppi_scale = oSTAGE.physical_ppi / 96;
    var a = document.getElementById("div_screens");
    a.style.transform = a.style.webkitTransform = "scale(" + oSTAGE.scale + "," + oSTAGE.scale + ")";
    a.style.width = Math.ceil(oSTAGE.wrapper_width) + "px";
    a.style.height = Math.ceil(oSTAGE.wrapper_height) + "px";
    for (a = update_queue.length - 1; 0 <= a; a--) update_queue[a].forget ? update_queue.splice(a, 1) : update_queue[a].doResizeUpdate ? update_queue[a].doResizeUpdate() : update_queue.splice(a, 1)
};