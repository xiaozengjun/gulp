var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 154,
    height: 154
});
var phone = ''
var phone_code = ''
var order_sn = ''
var decide = 60;
var oid = ''
var setTime = ''
var color = {
    "10": '#2374d3',
    "70": '#fb6664',
    "20": '#fb6664',
    "41": '#30ad2d',
    "80": '#30ad2d',
    "81": '#30ad2d',
    "90": '#145fbc',
    "45": '#2374d3',
    "60": '#2374d3',
    "50": '#fd6c2e',
    "51": '#fd6c2e',
    "52": '#fd6c2e',
}
$('.cx').click(function() {
    $('.Boxmain3 tbody.table').html('')
    const regex = /^1[3456789]\d{9}$/;//使用此正则即可
    if(regex.test($('.phoneInput').val())) {
        phone = $('.phoneInput').val()
        phone_code = $('.VerificationCode_s').val()
        query_list()
    }else {
        cocoMessage.error('请输入正确的手机号', 2000);
        return
    }
})
function query_list(isTips) {
    $('.stateless').hide()
    $('.loading').show()
    var form_data = getFormData({
        phone: phone,
        phone_code: phone_code
    })
    $.ajax({
        type : 'post',
        url : url+"/api/client/order/query_list",
        processData : false,
        contentType : false,
        xhrFields: {
            withCredentials: true
        },
        data : form_data,
        success : function(result) {
            if(result.code == 200) {
                $('.loading').hide()
                $('.Boxmain3 tbody.table').html(tableHtml(result.data))
                
            }else {
                $('.stateless').show()
                $('.loading').hide()
                if(!isTips) {
                    cocoMessage.error(result.codeMsg, 2000);
                }
            }
        }
    }); 
}
query_list(true)
function tableHtml(params) {
    var html = ''
    for (var i = 0; i < params.length; i++) {
        var text = "";
        text += "<tr class=\"td\" style=\"text-align: center; color: #666;\">";
        text += "	<td class=\"caption\">"
        text += "	 	<p style=\"white-space: nowrap;text-overflow: ellipsis;overflow: hidden; padding-left: 10px;\">" + params[i].order_sn + "</p>";
        text += "</td>";
        text += "	<td style=\"text-align:center;\">" + params[i].project_type + "</td>";
        text += "	<td style=\"text-align:center;\">" + (params[i].place_order_data && params[i].place_order_data.f_type? params[i].place_order_data.f_type : '未知') + "</td>";
        text += "	<td style=\"text-align:center;\">"+params[i].created+"</td>";
        text += "	<td style=\"text-align:center;\" class=\"caption button_s\">"
        text += "	 	<span style="+ ('color:'+ color[params[i].order_status] ) +">" + params[i].order_status_human + "</span>";
        text += "</td>";
        text += "	<td style=\"text-align:center;\" class=\"caption buttons1\">"
        if([10,20,25,41].includes(params[i].order_status)) {
            text += "<span data=" + params[i].order_sn + " class=\"button_span cancel blue\" >取消</span>";
        }
        if([45].includes(params[i].order_status)) {
            text += "<span data=" + params[i].order_sn + " class=\"button_span complete blue\" >确认</span>";
        }
        if([45].includes(params[i].order_status)) {
            text += "<span data=" + params[i].end_product + " class=\"button_span download blue\" >下载</span>";
        }
        if([70,80].includes(params[i].order_status)) {
            text += "<span class=\"button_span again red\" >重新下单</span>";
        }
        if([41].includes(params[i].order_status)) {
            text += "<span data=" + params[i].order_sn + " class=\"button_span pay green\" >支付</span>";
        }
        if([81,90,45,60,30,52].includes(params[i].order_status)) {
            text += "<span data=" + params[i].order_sn + " class=\"button_span refund red\" >申请退款</span>";
        }
        text += "</td>";
        text += "</tr>";
        html = html + text
    }
    return html
}
$('.Boxmain3 tbody.table').on('click', '.again', function() {
    window.location.href = jumpUrl + '/index.html'
})
$('.Boxmain3 tbody.table').on('click', '.cancel', function() {
    $('#myModal_s').modal('show')
    $('.modal-body').text('您确定要取消订单吗?')
    $('.determine').attr('data' , 'cancelOrder')
    order_sn =  $(this).attr('data')
})
$('.Boxmain3 tbody.table').on('click','.complete',function() {
    $('#myModal_s').modal('show')
    $('.modal-body').text('您确定订单已完成吗?')
    $('.determine').attr('data' , 'complete')
    order_sn =  $(this).attr('data')
})

var closeMsg = ''
$('.PayType').click(function() {
    $(this).siblings().removeClass('selected')
    $(this).addClass('selected')
    $('.loding , .mask').show()
    payOrder()
})
$('.Boxmain3 tbody.table').on('click','.pay',function() { // 支付
    $('.loding , .mask').show()
    closeMsg = cocoMessage.loading('正在获取支付信息, 请稍等!!')
    order_sn =  $(this).attr('data') 
    payOrder()
})
$('.overtime').click(function() {
    $('.loding , .mask').show()
    closeMsg = cocoMessage.loading('正在获取支付信息, 请稍等!!')
    payOrder()
})
$('.Boxmain3 tbody.table').on('click','.download',function() {
    console.log($(this).attr('data'))
    window.open($(this).attr('data'))
})
function payOrder() { // 获取支付信息
    $('.oid').text('获取中')
    $('.overtime').hide()
    var form_data = getFormData({
        order_sn: order_sn,
        pay_type: $('.selected').attr('data')
    })
    $.ajax({
        type : 'post',
        url : url+"/api/client/pay/payOrder",
        processData : false,
        contentType : false,
        xhrFields: {
            withCredentials: true
        },
        data : form_data,
        success : function(result) {
            if(result.code == 200) {
                closeMsg();
                $('#payment').modal('show')
                qrcode.makeCode(result.data.qrlink);
                $('.prcie').text(result.data.payment_money)
                $('.oid').text(result.data.pay_id)
                $('.loding , .mask').hide()
                decide = 60;
                oid = result.data.pay_id
                verifyOrder()
            }else {
                cocoMessage.error(result.codeMsg, 2000);
                closeMsg();
            }
        }
    });
}

// 轮询
function verifyOrder() {
    clearTimeout(setTime)
    if(!decide){
        $('.overtime').show()
        $('.mask').show()
        return 
    } 
    decide--
    setTime = setTimeout(function() {
        $.ajax({
            type: 'get',
            url: url+'/apirs/order/is_pay?pay_id=' + oid,
            success: function (data) {
                if(data.data) {
                    $('#payment').modal('hide')
                    cocoMessage.success('订单已支付',2000);
                    query_list()
                }else {
                    verifyOrder()
                }   
            },
            error: function() {
                verifyOrder()
            }
        });
    }, 2000);
}
$('.done').click(function() { // 已完成下一步
    var form_data = getFormData({
        pay_id: oid
    })
    $.ajax({
        type : 'post',
        url : url+"/api/client/pay/verifyOrder",
        processData : false,
        contentType : false,
        xhrFields: {
            withCredentials: true
        },
        data : form_data,
        success : function(result) {
            if(result.code == 3001) {
                $('#payment').modal('hide')
                cocoMessage.success('订单已支付',2000);
                query_list()
            }else {
                cocoMessage.error(result.codeMsg, 2000);
            }
        }
    });
})

function cancel_order() { // 取消订单
    var form_data = getFormData({
            order_sn: order_sn
        })
    $.ajax({
        type : 'post',
        url : url+"/api/client/order/cancel_order",
        processData : false,
        contentType : false,
        xhrFields: {
            withCredentials: true
        },
        data : form_data,
        success : function(result) {
            if(result.code == 200) {
                cocoMessage.success('已取消订单',2000);
                query_list()
                $('#myModal_s').modal('hide')
            }else {
                cocoMessage.error(result.codeMsg, 2000);
            }
        }
    });
}
function confirm_complete() { // 确认完成
    var form_data = getFormData({
            order_sn: order_sn
        })
    $.ajax({
        type : 'post',
        url : url+"/api/client/order/confirm_complete",
        processData : false,
        contentType : false,
        xhrFields: {
            withCredentials: true
        },
        data : form_data,
        success : function(result) {
            if(result.code == 200) {
                cocoMessage.success('已确认订单完成!',2000);
                query_list()
                $('#myModal_s').modal('hide')
            }else {
                cocoMessage.error(result.codeMsg, 2000);
            }
        }
    });
}

$('.determine').click(function() { // 弹窗确定按钮
    if($('.determine').attr('data') == 'cancelOrder') {
        cancel_order()
    }else if($('.determine').attr('data') == 'complete') {
        confirm_complete()
    }
})

$(".p6").on('click',function () { // 复制
    var oidxxx = document.querySelector(".oid").innerText;
    if(oidxxx == '获取中'){
        cocoMessage.error('请等待订单编号获取到后再复制', 2000);
        return
    }
    $("#hide").val(oidxxx); //这里可以获取动态数据赋值给$("#hide").val()
    $("#hide").select();
    try {
        var state = document.execCommand("copy");
    } catch (err) {
        var state = false;
    }
    if (state) {
        cocoMessage.success('复制成功!',2000);
    } else {
        cocoMessage.success('复制失败!',2000);
    }
})

$('#payment').on('hidden.bs.modal', function (e) { // 关闭弹窗退出轮询
    clearTimeout(setTime)
})