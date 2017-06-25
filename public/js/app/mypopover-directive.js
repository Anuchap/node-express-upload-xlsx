angular.module('myApp').directive('mypopover', function () {
    return {
        restrict: 'E',
        scope: {
            detail: '='
        },
        link: function (scope, element, attrs) {
            var type = parseInt(attrs.type);
            var d = scope.detail;

            if (type === 0)
                return;

            $(element).css('cursor', 'pointer');

            var table = '';
            switch (type) {
            case 1:
                table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Direct(%)</td>\
                                    <td class="text-center">Ad Network(%)</td>\
                                    <td class="text-center">Programetic(%)</td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">' + (d[0] * 100) + '%</td>\
                                    <td class="text-center">' + (d[1] * 100) + '%</td>\
                                    <td class="text-center">' + (d[2] * 100) + '%</td>\
                                </tr>\
                            </table>';
                break;
            case 2:
                table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Display Desktop(%)</td>\
                                    <td class="text-center">Display Mobile(%)</td>\
                                    <td class="text-center">Video Desktop(%)</td>\
                                    <td class="text-center">Video Mobile(%)</td>\
                                </tr>\
                                <tr>\
                                    <td>' + (d[0] * 100) + '%</td>\
                                    <td>' + (d[1] * 100) + '%</td>\
                                    <td>' + (d[2] * 100) + '%</td>\
                                    <td>' + (d[3] * 100) + '%</td>\
                                </tr>\
                            </table>';
                break;
            case 3:
                table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Display(%)</td>\
                                    <td class="text-center">Video(%)</td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">' + (d[0] * 100) + '%</td>\
                                    <td class="text-center">' + (d[1] * 100) + '%</td>\
                                </tr>\
                            </table>';
                break;
            case 4:
                table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Online Video<br/>Production(%)</td>\
                                    <td class="text-center">Web Banner & App<br/>Production(%)</td>\
                                    <td class="text-center">Social Media Platform<br/>Management(%)</td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center">' + (d[0] * 100) + '%</td>\
                                    <td class="text-center">' + (d[1] * 100) + '%</td>\
                                    <td class="text-center">' + (d[2] * 100) + '%</td>\
                                </tr>\
                            </table>';
                break;
            }

            var settings = {
                trigger: 'hover',
                content: table,
                width: 'auto',
                //padding:true,
                backdrop: false,
                placement: 'right'
            };
            $(element).webuiPopover('destroy').webuiPopover(settings);
        }
    };
});