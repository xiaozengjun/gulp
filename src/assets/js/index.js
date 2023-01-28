$(document).ready(function () {
    $("#formSubmit").bootstrapValidator({
        excluded:[":disabled",":hidden"], // 关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
        feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon',
            validating: 'glyphicon'
        },
        fields: {
            name: {
                container: "#name_err",
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    }
                }
            },
            phone: {
                container: "#phone_err",
                validators: {
                    notEmpty: {
                        message: '手机号不能为空'
                    },
                    regexp: {
                        regexp: /^1[3-9]\d{9}$/,
                        message: '请输入正确手机号'
                    }
                }
            },
            type: {
                container: "#type_err",
                validators: {
                    notEmpty: {
                        message: '请选择业务类型'
                    }
                }
            },
            field: {
                container: "#field_err",
                validators: {
                    notEmpty: {
                        message: '请选择研究领域'
                    }
                }
            },
            phone_code: {
                container: "#phone_code_err",
                validators: {
                    notEmpty: {
                        message: '请输入验证码'
                    }
                }
            }
        }
    });
    function get_types() {
        $.ajax({
            type : 'post',
            url : url+"/api/tool/get_types?scenes_id=project_types",
            success : function(result) {
                if(result.code == 200) {
                    var type = ''
                    for(var i=0; i<result.data.length; i++) {
                        type+= '<option value="'+ result.data[i].id +'">'+ result.data[i].name +'</option>'
                    }
                    $('#type').html("")
                    $('#type').append(type)
                    $('#type').selectpicker('refresh')
                }else {
                    setTimeout(get_types(), 5000);
                }
            }
        });
    }
    get_types()
});
$('.tj').click(
    function formSubmit(){
        var bootstrapValidator = $("#formSubmit").data("bootstrapValidator").validate();
        if (bootstrapValidator.isValid()){
            if($('.remark').val().length > 200) {
                cocoMessage.error('润色备注最多允许200字, 当前'+$('.remark').val().length+'字' , 2000); 
                setTimeout(function() {
                    $('.tj').attr('disabled' , false);
                }, 1000)
                return 
            } 
            var form_data =  getFormData({
                name: $('.name_s').val(),
                phone: $('.phoneInput').val(),
                phone_code: $('.VerificationCode_s').val(),
                spread_token: SPREAD_TOKEN,
                remark: $('.remark').val(),
                type: $('#type').val(),
                "data[f_type]": $('.field_s button.btn-default').attr('title')
            })
            
            $.ajax({
                    type : 'post',
                    url : url+"/api/client/order/unified/create",
                    processData : false,
                    contentType : false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data : form_data,
                    success : function(result) {
                        if(result.code == 200) {
                            $('#myModal_s').modal('show')
                            setTimeout(function (){              
                                window.location.href = JUMP_ORDER_PATH
                            }, 3000);
                        }else {
                            cocoMessage.error(result.codeMsg, 2000);
                        }
                        // cocoMessage.success(data.codeMsg,2000);
                    },
                    complete: function() {
                        $('.tj').attr('disabled' , false)
                    }
            });
        }
    }
)
