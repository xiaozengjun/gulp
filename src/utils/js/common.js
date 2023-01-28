// var url = 'http://project_libraries.report'
var url = 'https://huadianmeng.com'
var jumpUrl = '/ProjectLibrary/client-side/src'
function getFormData (object) { // 转FromData 对象
    const formData = new FormData()
    Object.keys(object).forEach(key => {
        const value = object[key]
        if (Array.isArray(value)) {
            value.forEach((subValue, i) =>
                formData.append(key + `[${i}]`, subValue)
            )
        } else {
            formData.append(key, object[key])
        }
    })
    return formData
}
var time = 60
var permit = true // 是否允许请求
$('.VerificationCode').click(function() {
    if(!permit) return
    const regex = /^1[3456789]\d{9}$/;
    var phone = $('.phoneInput').val()
    var formData ={}
    if(regex.test(phone)) {
        formData =  getFormData({
            phone: phone,
            scenes_id: $(this).attr('data'),
            _session_type: 'user'
        })
        $('.VerificationCode').addClass('forbid')
        $('.VerificationCode').html('剩余<span></span>')
        time = 60
        counDown()
        $.ajax({
            type : 'post',
            url : url+"/api/verify_code/get_phone_validate",
            processData : false,
            contentType : false,
            xhrFields: {
                        withCredentials: true
                    },
            data : formData,
            success : function(result) {
                if(result.code == 200) {
                    cocoMessage.success('已发送到指定手机号,请注意查收',2000);
                }else if(result.code == -1) {
                    cocoMessage.error(result.codeMsg, 2000);
                }else {
                    cocoMessage.error('获取失败', 2000);
                }
            },
        });
    }else {
        cocoMessage.error('请输入正确的手机号', 2000);
        return
    }
})

function counDown() {
    permit = false
    if (time === 0) {
        time = 60;
        $('.VerificationCode').html('发送验证码')
        $('.VerificationCode').removeClass('forbid')
        permit = true
        clearTimeout(setTime)
        return;
    } else {
        time--;
        $('.VerificationCode>span').text(time+'S');
    }
    timeout = setTimeout(function() {
        counDown();
    },1000);
}

$('#fav').click(function(siteUrl, siteName) {
    if(!siteUrl){
        siteUrl=window.location.href;
    }
    if(!siteName){
        siteName=document.title;
    }
    // console.log(siteUrl);
    // console.log(siteName);
    try{
        if (window.sidebar) { // For Mozilla Firefox Bookmark
            window.sidebar.addPanel(siteName, siteUrl,"");
        } else if( window.external || document.all) { // For IE Favorite
            window.external.addFavorite(siteUrl, siteName);
        } else { // for other browsers which does not support
            alert('请按 Ctrl+D 手动收藏!');
            return false;
        }
    }catch(e){
        alert('浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
})
