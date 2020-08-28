/* global odhback, optionsLoad, optionsSave*/

export function openUpdateLog() {
  //window.open("update-log.html","_blank");
  var a = $("<a href='update-log.html' target='_blank'></a>").get(0);
  var e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  a.dispatchEvent(e);
}

export function openIntroduce() {
  //window.open("guide.html","_blank");
  var a = $("<a href='guide.html' target='_blank'></a>").get(0);
  var e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  a.dispatchEvent(e);
}

export function openSetting() {
  //window.open("options.html","_blank");
  var a = $("<a href='options.html' target='_blank'></a>").get(0);
  var e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  a.dispatchEvent(e);
}

export function watchLive() {
  let uid = $("#live-id").val();
  //不输入uid时，跳转到直播首页（以前是404）
  let reg = /^\d{1,}$/;
  let pattern = new RegExp(reg);
  let url = pattern.test(uid)
    ? `http://live.acfun.cn/live/${uid}`
    : `https://live.acfun.cn/`;
  var a = $("<a href='" + url + "' target='_blank'></a>").get(0);
  var e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  a.dispatchEvent(e);
}

export function titleToHome() {
  window.open("https://www.acfun.cn/");
}

export function hideToTopButton() {
  let top = $(".mdui-fab").offset().top;
  if (top < 2000) {
    $(".mdui-fab").css({ opacity: "0" });
  } else {
    $(".mdui-fab").css({ opacity: "1" });
  }
}

export function clickToTop() {
  $("html,body").animate({ scrollTop: "0px" }, 600);
}

export async function onOptionChanged(e) {
    if (!e.originalEvent) return;
    let options = await optionsLoad();
    options.enabled = $("#extends-enbaled").prop("checked");
    let newOptions = await odhback().opt_optionsChanged(options);
    optionsSave(newOptions);
  }

export async function fetchDougaInfo(){
  let acid = $("#dougaInfoAcid").val();
  if(acid==''){return}
  fetch("https://mini.pocketword.cn/api/acfun/info?dougaId=" + acid).then((res)=>{
    if(res.status==503){
      alert("请不要频繁请求。")
    }
  return res.text()})
  .then((res)=>{
    let x = JSON.parse(res);
    if(x.result!=0){alert("无效的视频稿件AcID。");return}
    let raw_data = `
    <div class="mdui-table-fluid">
        <table class="mdui-table">
            <thead>
            <tr>
                <th>#</th>
                <th>Data</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>标题</td>
                <td>${x.title}</td>
            </tr>
            <tr>
                <td>播放量</td>
                <td>${x.viewCount}</td>
            </tr>
            <tr>
                <td>香蕉</td>
                <td>${x.bananaCount}</td>
            </tr>
            <tr>
                <td>发布时间</td>
                <td>${getTimeSinceNow(x.createTimeMillis)}</td>
            </tr>
            <tr>
                <td>弹幕</td>
                <td>${x.danmakuCount}</td>
            </tr>
            <tr>
                <td>简介</td>
                <td>${x.description}</td>
            </tr>
            <tr>
                <td>点赞</td>
                <td>${x.likeCount}</td>
            </tr>
            <tr>
                <td>分享</td>
                <td>${x.shareCount}</td>
            </tr>
            <tr>
                <td>收藏</td>
                <td>${x.stowCount}</td>
            </tr>
            </tbody>
        </table>
        </div>
    `;
  $("#dougaInfoPrint").append(raw_data);

  })
}