/**
 * 通知、提醒和推送
 */
class MsgNotifs{
    constructor(){

    }

    liveOnlineNotif(){
        window.setInterval(function(){
            chrome.storage.local.get(['liveFloowNotif'],function(Ifswitch){
            if(Ifswitch.liveFloowNotif){
                chrome.storage.local.get(['liveFloowings'],function(items){
                chrome.storage.local.get(['broadcastingUIDlist'],function(broadcastingUIDlist){
                    // let broadcastingUIDlist={674544:true}
                    console.log(broadcastingUIDlist);
                    let y={}
                    for(let i in items.liveFloowings){
                        //i就是UID
                        console.log(i);
                        let ApiUrl='https://www.acfun.cn/rest/pc-direct/user/userInfo?userId='
                        fetch(ApiUrl+i).then((res)=>{return res.text()})
                        .then((res)=>{
                            let x=JSON.parse(res);
                            if(x.profile.liveId != undefined){
                                var state=true;
                            }else{
                                var state=false;
                            }
                            y[i]=state;
                            if(state==broadcastingUIDlist.broadcastingUIDlist[i]){
                                // console.log('same!');
                            }else{
                                let lastState=broadcastingUIDlist.broadcastingUIDlist[i]
                                if(lastState==false){
                                chrome.notifications.create(null, {
                                    type: 'basic',
                                    iconUrl: 'images/notice.png',
                                    title: 'AcFun助手',
                                    message: `${x.profile.name}  正在直播了！`
                                });
                            }else{
                                // console.log(`${x.profile.name}  下播了！`);
                                // chrome.notifications.create(null, {
                                //     type: 'basic',
                                //     iconUrl: 'images/notice.png',
                                //     title: 'AcFun助手',
                                //     message: `${x.profile.name}  下播了！`
                                // chrome.notifications.onClicked.addListener(function (){mdui.alert('2333')})
                                // });
                            }}
                            chrome.storage.local.set({'broadcastingUIDlist':y});
                        });
                    }
                });
                });
            }
            });
        },20000);
    }

    async timer4Unread(){
        // console.log("timer start!");
        window.setInterval(function(){
            // console.log("start timer4Unread_thread");
            fetch('https://member.acfun.cn/common/api/getUnreadMess',{method:"POST",headers: {
                    'Content-Type': 'application/x-www-form-urlencoded','Accept':"accept: application/json, text/plain, */*"},body:""})
                .then((res=>{return res.text()}))
                // .then(response => console.log(response))
                // fetch('https://www.acfun.cn/member/unRead.aspx')
                //     .then((res)=>{return res.text();})
                .then((res)=>{
                    let b=JSON.parse(res);
                    // console.log(b.unReadCount);
                    let a0=b.unReadCount.new_comment;//评论
                    let a1=b.unReadCount.new_comment_like;//赞
                    let a2=b.unReadFollowFeedCount;//动态
                    let a3=b.unReadCount.new_content_notify;//系统通知
                    let a4=b.unReadCount.new_system_notify;//站内公告
                    // let a2=b.mention;
                    var pushNum=a0+a1+a2+a3+a4;
                    console.log(pushNum);
                    if(pushNum>0){
                        chrome.browserAction.setBadgeText({ text: pushNum.toString() });
                    }else{
                        chrome.browserAction.setBadgeText({ text: "" });
                    }
                })
        },60000)
    }

    fetchPushList(){
        window.setInterval(function(){
            fetch('https://www.acfun.cn/rest/pc-direct/feed/followFeed?isGroup=0&gid=-1&count=30&pcursor=1')
                .then((res)=>{return res.text();})
                .then((res)=>{
                    let rawdata=JSON.parse(res);
                    let out_data='';
                    // console.log(rawdata.feedList[0].username);
                    for(let i=0;i<=29;i++){
                        // console.log(i);
                        let data=rawdata.feedList[i];
                        let xmlData="<div class=\"inner\" id=\"";
                        xmlData+=data.aid+"\">" + "<div class=\"l\"><a target=\"_blank\" href=\"";
                        xmlData+="https://www.acfun.cn"+data.url+"\"";
                        xmlData+=" class=\"thumb thumb-preview\"><img data-aid=\"";
                        xmlData+=data.aid + "\" src=\""+data.titleImg+"\" class=\"preview\"> <div class=\"cover\"></div> </a> </div> <div class=\"r\"> <a data-aid=\""+data.aid+" \"target=\"_blank\" href=\"" +"https://www.acfun.cn"+data.url+"\" class=\"title\">";
                        xmlData+=data.title+"</a> </p> <div class=\"info\"><a target=\"_blank\" data-uid=\"";
                        xmlData+=data.aid+"\" href=\"https://www.acfun.cn/u/"+data.userId+"\" class=\"name\">";
                        xmlData += data.username + " </a><span class=\"time\">" + getTimeSinceNow(data.releaseDate) + "</span> </div> </div> </div> ";
                        // console.log(xmlData);
                        out_data+=xmlData;
                    }
                    chrome.storage.local.set({'AcpushList1': out_data});
                    // chrome.storage.local.get(['AcpushList'],function(datao){
                    //     console.log(datao);
                    // })
                });
        },60000)
    }
    
}