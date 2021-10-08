var themehouse = themehouse || {};

themehouse.giphy = {
    options: {
        style: null,
        requestUrl: null,
        insertMethod: 'media'
    },

    insertGiphy: function (id) {
        console.log(themehouse.giphy.options);
        var contents = '';
        if (themehouse.giphy.options.insertMethod === 'image') {
            contents = "<img src='https://media.giphy.com/media/" + id + "/giphy.gif'/>";
        } else {
            contents = "[media=giphy]" + id + "[/media]";
        }
        themehouse.giphy.editor.selection.restore();
        themehouse.giphy.editor.html.insert(contents);

        if (themehouse.giphy.options.style === 'below_editor') {
            themehouse.giphy.editor.$oel.data('th_giphyBox').slideUp();
        }
        else {
            themehouse.giphy.overlay.hide();
        }
    },

    fetchSearchResults: function (limit, insertSlides, ed, cb, noError) {
        themehouse.giphy.editor = ed;
        var query = $("#th_giphySearchInput").val();
        var queryUrl = themehouse.giphy.options.requestUrl.replace('%25query%25', query) + '&limit=' + limit + '&offset=' + th_giphyCounter;

        XF.ajax('GET',
            queryUrl,
            {},
            function (data) {
                if (data.data.length) {
                    for (var i = 0; i < data.data.length; i++) {
                        var th_giphyURL = data.data[i].images['preview_gif'].url;
                        var th_giphyID = data.data[i].id;
                        var th_giphyNewImg = $('<img class="th_gif" style="margin:0 5px;"/>');
                        th_giphyNewImg.attr('src', th_giphyURL);
                        th_giphyNewImg.data('id', th_giphyID);
                        th_giphyNewImg.attr('onclick', 'themehouse.giphy.insertGiphy(\'' + th_giphyID + '\')');

                        th_giphyCounter++;
                        if (insertSlides) {
                            $('.th_giphySlider').slick('slickAdd', $('<div />').html(th_giphyNewImg));
                        } else {
                            $('.th_giphySearchResults').append(th_giphyNewImg);
                        }
                    }
                }
                else {
                    if (!noError) {
                        var noResultMessage = $('<span />', {'text': XF.phrase('thgiphy_no_search_results')});
                        $('.th_giphySearchResults').append(noResultMessage);
                    }
                }

                if (typeof (cb) === 'function') {
                    cb(data);
                }
            }
        );
    },

    toggleGiphyBox: function (ed, active, insertHtml) {
        if (insertHtml) {
            if (themehouse.giphy.options.style === 'below_editor') {
                ed.$wp.after(insertHtml);
            } else {
                ed.selection.save();
                var $overlay = XF.getOverlayHtml({
                    title: XF.phrase('th_insert_giphy_giphy'),
                    dismissible: true,
                    html: insertHtml
                });
                themehouse.giphy.overlay = new XF.Overlay($overlay, {
                    backdropClose: true,
                    escapeClose: true,
                    keyboard: false,
                });
            }
        }

        $giphyBox = ed.$oel.data('th_giphyBox');

        if ($giphyBox) {
            ed.$wp.toggleClassTransitioned('giphyBox-active', active);
            if (active) {
                if (themehouse.giphy.options.style === 'below_editor') {
                    $giphyBox.slideDown().addClass('is-active');
                } else {
                    themehouse.giphy.overlay.show();
                    $giphyBox.addClass('is-active');
                }
                window.setTimeout(function () {
                    $('#th_giphySearchInput').focus();
                }, 17);
            } else {
                if (themehouse.giphy.options.style === 'below_editor') {
                    $giphyBox.slideUp();
                }
                window.setTimeout(function () {
                    $giphyBox.removeClass('is-active');
                }, 417);
            }

            window.setTimeout(function () {
                ed.$tb.find('.fr-command[data-cmd=Giphy]').toggleClass('fr-active is-active', active);
            }, 17);
        }
    }
};

XF.editorStart.custom.push('thGiphy');

if (th_giphyIcon.type === 'image') {
    $.FE.DefineIcon('thGiphy', {SRC: th_giphyIcon.value, template: 'image'});
} else {
    $.FE.DefineIcon('thGiphy', {NAME: th_giphyIcon.value});
}

$.FE.RegisterCommand('thGiphy', {
    title: 'Giphy',
    focus: false,
    undo: false,

    callback: function () {
        var ed = this,
            $giphyBox = ed.$oel.data('th_giphyBox'),
            endOfResults = false;

        $(document).on('overlay:hidden', function (event) {
            var target = $(event.target);
            if (target.find('.th_giphyBox').length) {
                target.find('.overlay-content > *').removeClass('is-active');
            }
        });

        if ($giphyBox) {
            var isActive = $giphyBox.hasClass('is-active');
            themehouse.giphy.toggleGiphyBox(ed, isActive ? false : true);
        } else {
            $giphyBox = $('<div class="th_giphyBox"><div class="formButtonGroup"><div class="formButtonGroup-primary slickButton"></div><div class="formButtonGroup-extra"><div class="inputGroup"><input type="text" class="input" name="SearchInput" id="th_giphySearchInput" placeholder="'
                + XF.phrase('thgiphy_search_for_gifs')
                + '" aria-label="Search" autocomplete="off"><button id="th_giphySearchButton" class="u-jsOnly button button--primary"><span class="button-text">' + XF.phrase('search') + '</span></button></div></div></div><div class="th_giphySearchResults th_giphySlider"></div></div><div class="block-footer"><a href="https://giphy.com"><img width="100px" src="' + themehouse.giphy.attributionPath + '" /></a></div>');

            ed.$oel.data('th_giphyBox', $giphyBox);

            themehouse.giphy.toggleGiphyBox(ed, true, $giphyBox);
            th_giphyCounter = 0;
            th_giphySlick = null;
            $('#th_giphySearchInput').on('input', function () {
                th_giphyCounter = 0;
            });

            $("#th_giphySearchButton").click(function (e) {
                if (th_giphySlick != null) {
                    th_giphySlick.slick('unslick');
                }

                $(".th_giphySearchResults").html("");
                themehouse.giphy.fetchSearchResults(15, false, ed, function () {
                    th_giphySlick = $('.th_giphySlider').slick({
                        appendArrows: ".slickButton",
                        variableWidth: true,
                        dots: false,
                        infinite: false,
                        speed: 300,
                        slidesToShow: (themehouse.giphy.options.style === 'below_editor') ? 5 : 4,
                        slidesToScroll: (themehouse.giphy.options.style === 'below_editor') ? 5 : 4,
                        prevArrow: '<button type="button" class="u-jsOnly button button--primary slick-prev"><span class="button-text">' + XF.phrase('prev') + '</span></button>',
                        nextArrow: '<button type="button" class="u-jsOnly button button--primary slick-next"><span class="button-text">' + XF.phrase('next') + '</span></button>',
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                    infinite: false,
                                    dots: false
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                    infinite: false,
                                    dots: false
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                    infinite: false,
                                    dots: false
                                }
                            }
                        ]
                    });
                    endOfResults = false;

                    $('.th_giphySlider').on('afterChange', function (event, slick, currentSlide) {
                        var currentSlide = $('.th_giphySlider').slick('slickCurrentSlide');
                        if (currentSlide >= (th_giphyCounter - 15)) {

                            if (!endOfResults) {
                                themehouse.giphy.fetchSearchResults(10, true, ed, function (data) {
                                    if (!data.data.length) {
                                        endOfResults = true;
                                    }
                                }, true);
                            }
                        }
                    });

                });
                e.preventDefault();
            });

            $('#th_giphySearchInput').keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#th_giphySearchButton").click();
                    e.preventDefault();
                }
            });

            $("#th_giphySearchInput").keyup(function () {
                if (!this.value) {
                    $(".th_giphySearchResults").html("");
                }
            });
        }
    }
});
