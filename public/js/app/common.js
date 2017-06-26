var loader = {
    show: function (message) {
        $.blockUI({
            css: {
                border: 'none',
                backgroundColor: '',
            },
            message: '<h1 style="color: white;">' + (message || 'Please wait a moment...') + '</h1>'
        });

    },
    hide: function () {
        $.unblockUI();
    }
};