function injectedScript (path) {
    const scriptNode = document.createElement('script');
    scriptNode.src= chrome.runtime.getURL(path);
    document.documentElement.appendChild(scriptNode);
    return scriptNode;
  }


// const defaultGroups = [
//     {
//         groupName: 'default',
//         open: true,
//         interfaceList: [
//             {
//                 open: true,
//                 matchType: 'normal',
//                 matchMethod: 'POST',
//                 request: 'getShareResult',
//                 responseText: `const payload = JSON.parse(arguments[0].payload.requestPayload);
//                 if(payload.shareId === "9ea05433-57ea-4b01-9c6a-4af36020a351") {
//                     return {"ResponseStatus":{"Timestamp":"/Date(1711448543245+0800)/","Ack":"Success","Errors":[],"Extension":[{"Id":"CLOGGING_TRACE_ID","Value":"9115616579327965761"},{"Id":"RootMessageId","Value":"100025527-0a8199f1-475402-1228053"}]},"shareResponses":[{"getTripGenChatResultResponse":{"hasResult":true,"deeplink":"ctripglobal://hotel/hotellist?city=734&filters=%5B%7B%22data%22%3A%7B%22title%22%3A%22Mountain%20view%22%2C%22filterID%22%3A%223%7C243%22%7D%7D%5D","buttonTextRefresh":"重新載入酒店","buttonText":"查看酒店","text":"根據您的搜索參數，我正在尋找提供絕佳景觀的京都酒店。","failText":"我搵唔到符合您要求嘅酒店，但係我有其他推介。","resultCode":3,"intentionType":2,"pageAlias":"HOTEL_LIST","status":"COMPLETE","needLenovoQuestion":true,"rag":0},"quiz":"京都哪些酒店附近的景觀最優美？","chatId":"33b59916-93fd-43cd-ae02-41fcf0585040"},{"getTripGenChatResultResponse":{"hasResult":true,"deeplink":"ctripglobal://FlightListAB?dct=SHA&act=SIN&tp=i&dn=%E4%B8%8A%E6%B5%B7%7C%E6%96%B0%E5%8A%A0%E5%9D%A1&ft=s&st=0&fc=ys&source=tripgen&tid=F0015_10320607445","h5Url":"/m/flights/flightfirst/?dcitycode=SHA&acitycode=SIN&triptype=0&sorttype=1","buttonTextRefresh":"重新載入航班","buttonText":"查看","text":"經過全面搜尋，我發現咗由上海去新加坡嘅機票，相信呢個選擇對你嚟講係一個好好嘅選擇。","failText":"我搵唔到符合您要求嘅航班，但係我有其他推介。","resultCode":3,"intentionType":3,"pageAlias":"FLIGHT_LIST","status":"COMPLETE","needLenovoQuestion":true,"rag":0},"quiz":"预定上海到新加坡的机票","chatId":"47a75fd5-f4c1-45df-ad50-d0200a7cfe25"}],"downloadDeeplink":"ctripglobal://mytrip/tripgen2?type=full_from_share&pagealias=tg_share_h5&frompageid=10650136832&shareId=e9cfd0bd-ddf6-4682-a3f5-635a309d7687&fallbackUrl=https%3A%2F%2Fhk.trip.com%2Ftripgenie%2Fshare%3FshareId%3De9cfd0bd-ddf6-4682-a3f5-635a309d7687%26locale%3Dzh_HK%26type%3Dfull_from_share%26pagealias%3Dtg_share_h5%26frompageid%3D10650136832%26wkp%3D1","quizs":"京都哪些酒店附近的景觀最優美？,预定上海到新加坡的机票"}
//                 }`,
//                 mode: 'function'
//             },
//             {
//                 open: true,
//                 matchType: 'normal',
//                 request: 'https://jsonplaceholder.typicode.com/todos/2',
//                 replacementStatusCode: 200,
//                 responseText: '{"userId": 1,"id": 2,"title": "quis ut nam facilis et officia qui","completed": false}'
//             }
//         ]
//     }
// ]

  injectedScript('scripts/yRequstly.js').addEventListener('load', () => {
    chrome.storage.local.get(['switchStatus',  'rulesGroup'], (result) => {
      console.log('【ajaxTools content.js】【storage】', result);
      const {switchStatus = true, rulesGroup = []} = result;
      if(switchStatus) {
        postMessage({type: 'ajaxTools', to: 'pageScript', key: 'ajaxDataList', value: rulesGroup});
        postMessage({type: 'ajaxTools', to: 'pageScript', key: 'switchStatus', value: switchStatus});
      }
    });
  });