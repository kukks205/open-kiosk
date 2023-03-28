const axios = require('axios');
var moment = require('moment'); // require
const {BrowserWindow} = require('@electron/remote')
moment.locale('th');

let pttype;
let claimCode = null;
let hospcode='04559'

$(function () {

    document.getElementById("back").onclick = () => {


        location.href='../pages/index.html';

    }

    document.getElementById("confirmed").onclick = () => {

        var pid = document.getElementById("pid").value;
        var phone = document.getElementById("mobile").value;
        var mobile = phone.replace(/[^0-9]/g, '');
        var correlationId = document.getElementById("correlationId").value;

        var numMobile = mobile.length;

        if (numMobile!=10) {

        }else{
            

            const postdata = {
                "pid": pid,
                "claimType": "PG0060001",
                "mobile": mobile,
                "correlationId": correlationId,
                "hn": null,
                "hcode": localStorage.getItem("hospitalcode")
            };
    
    
    
            var config = {
                method: 'post',
                url: 'http://localhost:8189/api/nhso-service/confirm-save',
                timeout:30000,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: postdata
            };
            axios(config)
            .then(async function (response) {
    
                let data = await response.data;
                let claimCode = await data.claimCode;
    
            })
            .catch(function (error) {
    
            })
    

        }



    }



        bootbox.dialog({
            className: "custom-small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i>  กรุณารอสักครู่<br> ระบบกำลังอ่านข้อมูลบัตร</div>',
            closeButton: false,
            centerVertical: true,
        });


        var config = {
            method: 'get',
            url: 'http://localhost:8189/api/smartcard/read?readImageFlag=true',
        };


        axios(config)
            .then(async function (response) {
                if (response.status == 200) {
                    let res = response.data;
                    console.log(res)
                    let _mainInscl = res.mainInscl
                    let mainInscl = _mainInscl.substring(1, 4);
                    let _subInsc = res.subInscl
                    let subInsc = _subInsc.substring(1, 3);

                    pttype = "สิทธิ์หลัก : " + res.mainInscl + "<br>" + "ประเภทสิทธิย่อย : " + res.subInscl;
                    let ptdetail = "เลขบัตรประจำตัวประชาชน : " + res.pid + "<br>" + "คุณ" + res.fname + "  " + res.lname + "  อายุ : " + res.age;
                    document.getElementById("ptdetail").innerHTML = ptdetail;
                    document.getElementById("pid").value = res.pid;
                    document.getElementById("pttype").innerHTML = pttype;
                    document.getElementById("img").src = "data:image/jpeg;base64," + res.image;

                    document.getElementById("correlationId").value = res.correlationId;
                    document.getElementById("mobile").focus();

                    

                    const contentType = 'image/jpeg';
                    const b64Data = "data:image/jpeg;base64," + res.image;
                    let filename = res.pid + '.jpg';
                    bootbox.hideAll();
                } else {
                    bootbox.hideAll();
                }
            })
            .catch(function (error) {

                bootbox.alert({
                    title: "ไม่สามารถทำรายการได้",
                    message: "ตรวจสอบว่าท่านเสียบบัตรประชาชนดีแล้วหรือยัง",
                    centerVertical: true,
                    callback: function () {
                        bootbox.hideAll();
                    }
                });

                console.log(error)
            });





});