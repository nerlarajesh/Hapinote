$(document).ready(function() {
    $(".nav-sidebar li").click(function() {
        var _this = $(this);
        $.ajax({
            method: 'POST',
            url: 'input.json',
            dataType: "text json",
            success: function(result) {
                var data = result[_this.children('a').data('role')];
                $('.page-header').children('span').html(_this.children('a').data('role'));
                $('.placeholders marquee').html($.trim(data.desc));
            },
            error: function(err) {
                throw err;
            }
        });
        $(".nav-sidebar li").removeClass('active');
        $(this).hasClass('active') ? '' : $(this).addClass('active');
    });
});