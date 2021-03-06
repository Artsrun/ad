function apsa_can_run_ads() {

    jQuery('body').append('<div class="afs_ads ad-top ad-banner google-sponsored google-ad apsa-can-run-ads" style="position:fixed !important; top:-9999px !important;left:-9999px !important;visibility:hidden !important;width:1px !important;height:1px !important;"></div>');
    var canRunAds = !(jQuery('.apsa-can-run-ads').css('display') == 'none');
    jQuery('.apsa-can-run-ads').remove();
    return canRunAds;
}

/*
 * when add-blocker active show warning message 
 */

function apsa_show_warning(warText, warEnabled) {
    if (apsa_can_run_ads() == false && warEnabled == 'true' && apsa_get_cookie('apsa_adblock_warning') != 'no') {
        jQuery('.apsa-warning-message').remove();
        if (warText == '') {
            warText = apsa_warning_default;
        }
        var warningDiv = '<div class="apsa-warning-message"><div class="apsa-warning-content">' + warText + '</div><div class="apsa-war-close"><span class="apsa-warning-close"></span></div></div>';
        jQuery('body').append(warningDiv);
    }
    //close warning message
    jQuery('.apsa-warning-close').on('click', function () {
        jQuery('.apsa-warning-message').remove();
        apsa_set_cookie('apsa_adblock_warning', 'no');
        jQuery(window).trigger('resize');
    });
}

/** Document ready actions */
jQuery(document).ready(function ($) {

    if (typeof apsa_extra_options === 'object' && apsa_extra_options.apsa_cache_enabled == 'true') { //===========Custom===============
        /*
         * ajax for get extra options
         */
        $.ajax({
            type: "POST",
            url: apsa_ajax_url,
            dataType: "json",
            data: {
                action: "apsa_ajax_get_options",
                type: "view",
            },
            success: function (res) {
                if (res) {
                    // add warning message
                    apsa_show_warning(res.apsa_warning_text, res.apsa_warning_text_enabled);
                }
            },
        });
    } else {
        if (typeof apsa_options === 'object' && apsa_options.apsa_warning_text) {//===========Custom===============
            apsa_show_warning(apsa_options.apsa_warning_text, apsa_options.apsa_warning_text_enabled);
        }
    }

    /** element links redirect */
    $(document).on('click', ".apsa-element-link", function (e) {

        if (e.target == this || $(e.target).closest('.apsa-element-link').length) {

            var link_to = $(this).attr("data-apsa-link");
            var link_type = $(this).attr("data-apsa-link-target");

            if (link_type === '_window') {
                link_type = '_blank';
                var location = 'scrollbars=yes';
            }
            if (link_to !== "") {
                window.open(link_to, link_type, location);
            } else {
                return;
            }

            /** Request for save visit into Db */
            var element_id = $(this).closest("[data-apsa-element-id]").attr("data-apsa-element-id");

            apsa_add_event(element_id, 'visit');
        }

        e.stopPropagation();
    });



});

/**
 * *======= Hook before element show ======
 * @param {obj} that
 * @param {obj} options
 * @returns {obj}
 */
function apsa_before_element_show(that, options) {
    if (options.camp_type === "embed" && jQuery(that).attr('data-apsa-animation-name') === "animation-none") {

        setTimeout(function () {
            /**
             * caling resize functions
             */
            var slug = that.find('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap').attr('data-slug')
            var element = that.find('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap');

            if (typeof window["apsa_" + slug + "_resize"] == 'function') {
                window["apsa_" + slug + "_resize"](element, true);
            }

        }, 300)
    }
    return options;
}
// actions when element show
function apsa_element_show(that, options) {
    //===========Custom===============

    setTimeout(function () {
        /**
         * caling resize functions
         */
        var slug = that.find('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap').attr('data-slug')
        var element = that.find('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap');

        if (typeof window["apsa_" + slug + "_resize"] == 'function') {
            window["apsa_" + slug + "_resize"](element, true);
        }

    }, 300)

//===========Custom===============
    // for background campaigns element
    if (options["camp_type"] == 'background') {
        if (typeof options["bg_link_to"] == "string" && options["bg_link_to"] !== "") {
            that.addClass("apsa-element-link");
            that.attr("data-apsa-link", options["bg_link_to"]);
            that.attr("data-apsa-link-target", options["bg_link_type"]);
        }
    }
}


//===========Custom===============

/**
 *======= Calling template hook on window resize =====
 * 
 */
(function () {
    var apsa_clear_setTimeout;
    jQuery(window).on('resize', function () {
        clearTimeout(apsa_clear_setTimeout);
        apsa_clear_setTimeout = setTimeout(function () {
            if (jQuery('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap').length) {
                jQuery('.apsa-custom-popup-wrap,.apsa-custom-embed-wrap,.apsa-custom-sticky-wrap').each(function () {

                    var slug = jQuery(this).attr('data-slug');
                    if (typeof window["apsa_" + slug + "_resize"] == 'function') {
                        window["apsa_" + slug + "_resize"](this);

                    }
                })
            }
        }, 200)

    });
})()
