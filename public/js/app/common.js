var loader = {
    show: function () {
        $.blockUI({
            css: {
                border: 'none',
                backgroundColor: '',
            },
            message: '<h1 style="color: white;">Data Verifying...</h1>'
        });

    },
    hide: function () {
        $.unblockUI();
    }
};