
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
//                 responseText: `const payload = args.payload.jsonPayload;
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
const ajax_tools_space = {
    ajaxToolsSwitchOn: true,
    ajaxToolsSwitchOnNot200: true,
    ajaxDataList: [],
    originalXHR: window.XMLHttpRequest,
    // "/^t.*$/" or "^t.*$" => new RegExp
    strToRegExp: (regStr) => {
        let regexp = new RegExp('');
        try {
            const regParts = regStr.match(new RegExp('^/(.*?)/([gims]*)$'));
            if (regParts) {
                regexp = new RegExp(regParts[1], regParts[2]);
            } else {
                regexp = new RegExp(regStr);
            }
        } catch (error) {
            console.error(error);
        }
        return regexp;
    },
    getOverrideText: (responseText, args, toJson = false, mode = "text") => {
        let overrideText = responseText;
        if(mode === 'function') {
                try {
                    const returnText = (new Function('args',responseText))(args);
                    if (returnText) {
                        overrideText = typeof returnText === 'object' ? JSON.stringify(returnText) : returnText;
                    }
                } catch (e) {
                    console.error('【Executing your function reports an error】\n', e);
                }
            
        }

        if (toJson) {
            try {
                overrideText = JSON.parse(overrideText);
            } catch (e) {
                overrideText = {};
            }
        }

        return overrideText;
    },
    executeStringFunction: (stringFunction, args) => {
        try {
            stringFunction = (new Function(stringFunction))(args);
        } catch (e) { }
        return stringFunction;
    },
    getRequestParams: (requestUrl) => {
        if (!requestUrl) {
            return null;
        }
        const paramStr = requestUrl.split('?').pop();
        const keyValueArr = paramStr.split('&');
        let keyValueObj = {};
        keyValueArr.forEach((item) => {
            // 保证中间不会把=给忽略掉
            const itemArr = item.replace('=', '〓').split('〓');
            const itemObj = { [itemArr[0]]: itemArr[1] };
            keyValueObj = Object.assign(keyValueObj, itemObj);
        });
        return keyValueObj;
    },
    getMatchedInterface: ({ thisRequestUrl = '', thisMethod = '' }) => {
        const interfaceList = [];
        ajax_tools_space.ajaxDataList.forEach((item) => {
            interfaceList.push(...(item.interfaceList || []));
        });
        // const interfaceList = ajax_tools_space.ajaxDataList.flatMap(item => item.interfaceList || []);
        return interfaceList.find(({ open = true, matchType = 'normal', matchMethod, request }) => {
            const matchedMethod = !matchMethod || matchMethod === thisMethod.toUpperCase();
            const matchedRequest = request && (matchType === 'normal' ? thisRequestUrl.includes(request) : thisRequestUrl.match(ajax_tools_space.strToRegExp(request)));
            return open && matchedMethod && matchedRequest;
        });
    },
    myXHR: function () {
        const modifyResponse = () => {
            const [method, requestUrl] = this._openArgs;
            const queryStringParameters = ajax_tools_space.getRequestParams(requestUrl);
            const [requestPayload] = this._sendArgs;
            const matchedInterface = this._matchedInterface;
            if (matchedInterface && matchedInterface.responseText) {
                const funcArgs = {
                    method,
                    payload: {
                        queryStringParameters,
                        requestPayload,
                        jsonPayload: JSON.parse(requestPayload)
                    },
                    originalResponse: this.responseText,
                    mode: matchedInterface.mode
                };
                const overrideText = ajax_tools_space.getOverrideText(matchedInterface.responseText, funcArgs, false, matchedInterface.mode);
                this.responseText = overrideText;
                this.response = overrideText;
                if (ajax_tools_space.ajaxToolsSwitchOnNot200 && this.status !== 200) {
                    this.status = 200;
                }
                if (matchedInterface.replacementStatusCode) {
                    this.status = matchedInterface.replacementStatusCode;
                }
                // console.info('ⓢ ►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►► ⓢ');
                console.groupCollapsed(`%cMatched XHR Response modified：${matchedInterface.request}`, 'background-color: #108ee9; color: white; padding: 4px');
                console.info(`%cOriginal Request Url：`, 'background-color: #ff8040; color: white;', this.responseURL);
                console.info('%cModified Response Payload：', 'background-color: #ff5500; color: white;', JSON.parse(overrideText));
                console.groupEnd();
                // console.info('ⓔ ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣ ⓔ')
            }
        }

        const xhr = new ajax_tools_space.originalXHR;
        for (const attr in xhr) {
            if (attr === 'onreadystatechange') {
                xhr.onreadystatechange = (...args) => {
                    // 下载成功
                    if (this.readyState === this.DONE) {
                        // 开启拦截
                        modifyResponse();
                    }
                    this.onreadystatechange && this.onreadystatechange.apply(this, args);
                }
                this.onreadystatechange = null;
                continue;
            } else if (attr === 'onload') {
                // xhr.onload = (...args) => {
                //   // 开启拦截
                //   modifyResponse();
                //   this.onload && this.onload.apply(this, args);
                // }
                // this.onload = null;
                // continue;
            } else if (attr === 'open') {
                this.open = (...args) => {
                    this._openArgs = args;
                    const [method, requestUrl] = args;
                    this._matchedInterface = ajax_tools_space.getMatchedInterface({ thisRequestUrl: requestUrl, thisMethod: method });
                    const matchedInterface = this._matchedInterface;
                    // modify request
                    if (matchedInterface) {
                        const { replacementUrl, replacementMethod, headers, requestPayloadText } = matchedInterface;
                        if (replacementUrl || replacementMethod || headers || requestPayloadText) {
                            console.groupCollapsed(`%cMatched XHR Request modified：${matchedInterface.request}`, 'background-color: #fa8c16; color: white; padding: 4px');
                            console.info(`%cOriginal Request Url：`, 'background-color: #ff8040; color: white;', requestUrl);
                        }
                        if (matchedInterface.replacementUrl && args[1]) {
                            args[1] = matchedInterface.replacementUrl;
                            console.info(`%cModified Url：`, 'background-color: #ff8040; color: white;', matchedInterface.replacementUrl);
                        }
                        if (matchedInterface.replacementMethod && args[0]) {
                            args[0] = matchedInterface.replacementMethod;
                            console.info(`%cModified Method：`, 'background-color: #ff8040; color: white;', matchedInterface.replacementMethod);
                        }
                        if (matchedInterface.requestPayloadText && args[0] && args[1] && args[0].toUpperCase() === 'GET') {
                            const queryStringParameters = ajax_tools_space.getRequestParams(args[1]);
                            const data = {
                                requestUrl: args[1],
                                queryStringParameters
                            }
                            args[1] = ajax_tools_space.executeStringFunction(matchedInterface.requestPayloadText, data);
                            console.info(`%cModified Request Payload, GET：`, 'background-color: #ff8040; color: white;', args[1]);
                        }
                    }
                    xhr.open && xhr.open.apply(xhr, args);
                }
                continue;
            } else if (attr === 'setRequestHeader') {
                this.setRequestHeader = (...args) => {
                    this._headerArgs = this._headerArgs ? Object.assign(this._headerArgs, { [args[0]]: args[1] }) : { [args[0]]: args[1] };
                    const matchedInterface = this._matchedInterface;
                    if (!(matchedInterface && matchedInterface.headers)) { // 没有要拦截修改或添加的header
                        xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, args);
                    }
                }
                continue;
            } else if (attr === 'send') {
                this.send = (...args) => {
                    const matchedInterface = this._matchedInterface;
                    if (matchedInterface) {
                        if (matchedInterface.headers) {
                            const overrideHeaders = ajax_tools_space.getOverrideText(matchedInterface.headers, this._openArgs, true, matchedInterface.mode);
                            const headers = this._headerArgs ? Object.assign(this._headerArgs, overrideHeaders) : overrideHeaders;
                            Object.keys(headers).forEach((key) => {
                                xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, [key, headers[key]]);
                            })
                            console.info(`%cModified Headers：`, 'background-color: #ff8040; color: white;', overrideHeaders);
                        }
                        const [method] = this._openArgs;
                        if (matchedInterface.requestPayloadText && method !== 'GET') { // Not GET
                            args[0] = ajax_tools_space.executeStringFunction(matchedInterface.requestPayloadText, args[0]);
                            console.info(`%cModified Request Payload, ${method}：`, 'background-color: #ff8040; color: white;', args[0]);
                        }
                        console.groupEnd();
                    }
                    this._sendArgs = args;
                    xhr.send && xhr.send.apply(xhr, args);
                }
                continue;
            }
            if (typeof xhr[attr] === 'function') {
                this[attr] = xhr[attr].bind(xhr);
            } else {
                // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
                if (['responseText', 'response', 'status'].includes(attr)) {
                    Object.defineProperty(this, attr, {
                        get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                        set: (val) => this[`_${attr}`] = val,
                        enumerable: true
                    });
                } else {
                    Object.defineProperty(this, attr, {
                        get: () => xhr[attr],
                        set: (val) => xhr[attr] = val,
                        enumerable: true
                    });
                }
            }
        }
    },
    originalFetch: window.fetch.bind(window),
    myFetch: function (...args) {
        const getOriginalResponse = async (stream) => {
            let text = '';
            const decoder = new TextDecoder('utf-8');
            const reader = stream.getReader();
            const processData = (result) => {
                if (result.done) {
                    return text;
                }
                const value = result.value; // Uint8Array
                text += decoder.decode(value, { stream: true });
                // 读取下一个文件片段，重复处理步骤
                return reader.read().then(processData);
            };
            return await reader.read().then(processData);
        }
        const [requestUrl, data] = args;
        const matchedInterface = ajax_tools_space.getMatchedInterface({ thisRequestUrl: requestUrl, thisMethod: data && data.method });
        if (matchedInterface && args) {
            const { replacementUrl, replacementMethod, headers, requestPayloadText } = matchedInterface;
            if (replacementUrl || replacementMethod || headers || requestPayloadText) {
                console.groupCollapsed(`%cMatched Fetch Request modified：${matchedInterface.request}`, 'background-color: #fa8c16; color: white; padding: 4px');
                console.info(`%cOriginal Request Url：`, 'background-color: #ff8040; color: white;', requestUrl);
            }
            if (matchedInterface.replacementUrl && args[0]) {
                args[0] = matchedInterface.replacementUrl;
                console.info(`%cModified Url：`, 'background-color: #ff8040; color: white;', matchedInterface.replacementUrl);
            }
            if (matchedInterface.replacementMethod && args[1]) {
                args[1].method = matchedInterface.replacementMethod;
                console.info(`%cModified Method：`, 'background-color: #ff8040; color: white;', matchedInterface.replacementMethod);
            }
            if (matchedInterface.headers && args[1]) {
                const overrideHeaders = ajax_tools_space.getOverrideText(matchedInterface.headers, data, true, matchedInterface.mode);
                args[1].headers = Object.assign(args[1].headers, overrideHeaders);
                console.info(`%cModified Headers：`, 'background-color: #ff8040; color: white;', overrideHeaders);
            }
            if (matchedInterface.requestPayloadText && args[0] && args[1]) {
                const { method } = args[1];
                if (['GET', 'HEAD'].includes(method.toUpperCase())) {
                    const queryStringParameters = ajax_tools_space.getRequestParams(args[0]);
                    const data = {
                        requestUrl: args[0],
                        queryStringParameters
                    }
                    args[0] = ajax_tools_space.executeStringFunction(matchedInterface.requestPayloadText, data);
                    console.info(`%cModified Request Payload, GET：`, 'background-color: #ff8040; color: white;', args[0]);
                } else {
                    data.body = ajax_tools_space.executeStringFunction(matchedInterface.requestPayloadText, data.body);
                    console.info(`%cModified Request Payload, ${method}：`, 'background-color: #ff8040; color: white;', data.body);
                }
            }
            console.groupEnd();
        }
        return ajax_tools_space.originalFetch(...args).then(async (response) => {
            let overrideText = undefined;
            if (matchedInterface && matchedInterface.responseText) {
                const queryStringParameters = ajax_tools_space.getRequestParams(requestUrl);
                const originalResponse = await getOriginalResponse(response.body);
                const funcArgs = {
                    method: data.method,
                    payload: {
                        queryStringParameters,
                        requestPayload: data.body,
                        jsonPayload: JSON.parse(data.body)
                    },
                    originalResponse
                };
                overrideText = ajax_tools_space.getOverrideText(matchedInterface.responseText, funcArgs, false, matchedInterface.mode);
                // console.info('ⓢ ►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►► ⓢ');
                console.groupCollapsed(`%cMatched Fetch Response modified：${matchedInterface.request}`, 'background-color: #108ee9; color: white; padding: 4px');
                console.info(`%cOriginal Request Url：`, 'background-color: #ff8040; color: white;', response.url);
                console.info('%cModified Response Payload：', 'background-color: #ff5500; color: white;', JSON.parse(overrideText));
                console.groupEnd();
                // console.info('ⓔ ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣ ⓔ')
            }
            if (overrideText !== undefined) {
                const stream = new ReadableStream({
                    start(controller) {
                        controller.enqueue(new TextEncoder().encode(overrideText));
                        controller.close();
                    }
                });
                const newResponse = new Response(stream, {
                    headers: response.headers,
                    status: matchedInterface && matchedInterface.replacementStatusCode || response.status,
                    statusText: response.statusText,
                });
                const responseProxy = new Proxy(newResponse, {
                    get: function (target, name) {
                        switch (name) {
                            case 'body':
                            case 'bodyUsed':
                            case 'ok':
                            case 'redirected':
                            case 'type':
                            case 'url':
                                return response[name];
                        }
                        return target[name];
                    }
                });
                for (let key in responseProxy) {
                    if (typeof responseProxy[key] === 'function') {
                        responseProxy[key] = responseProxy[key].bind(newResponse);
                    }
                }
                return responseProxy;
            }
            return response;
        })
    }
}

// function getInitRulesGroup(rulesGroup) {
//     chrome.storage.local.get('rulesGroup', function (result) {
//         console.log('current rulesGroup value is ' + result?.rulesGroup);
//         rulesGroup.ajaxDataList = result?.rulesGroup?.filter(item => item.open) || defaultGroups;
//     });
// }

// function init(isOn) {
//     if(isOn) {
//         for (const k in ajax_tools_space.originalXHR) {
//             ajax_tools_space.myXHR[k] = ajax_tools_space.originalXHR[k]
//         }
//         ajax_tools_space.ajaxDataList = defaultGroups
//         // getInitRulesGroup(ajax_tools_space);
//         window.ajax_tools_space = ajax_tools_space;
//         window.XMLHttpRequest = ajax_tools_space.myXHR;
//         // document.XMLHttpRequest.ajax_tools_space = ajax_tools_space;
//         window.fetch = ajax_tools_space.myFetch;
//         // window.cc = 1;
//     }
// }




// chrome.storage.local.get('switch', function (result) {
//     console.log('current switch value is ' + result.switch);
// });
// init(true);


window.addEventListener("message", function (event) {
    const data = event.data;
    if (data.type === 'ajaxTools' && data.to === 'pageScript') {
        // console.log('【pageScripts/index.js】', data);
        ajax_tools_space[data.key] = data.value;
    }
    if (ajax_tools_space.ajaxToolsSwitchOn) {
        // https://github.com/PengChen96/ajax-tools/pull/14
        for (const k in ajax_tools_space.originalXHR) {
            ajax_tools_space.myXHR[k] = ajax_tools_space.originalXHR[k]
        }
        window.XMLHttpRequest = ajax_tools_space.myXHR;
        window.fetch = ajax_tools_space.myFetch;
    } else {
        window.XMLHttpRequest = ajax_tools_space.originalXHR;
        window.fetch = ajax_tools_space.originalFetch;
    }

}, false);

// const funcArgs = {
//     method: data.method,
//     payload: {
//         queryStringParameters,
//         requestPayload: data.body
//     },
//     originalResponse
// };

function test(funargs) {
    const payload = JSON.parse(arguments[0].payload.requestPayload);
    if(payload.shareId === "9ea05433-57ea-4b01-9c6a-4af36020a351") {
        return {"ResponseStatus":{"Timestamp":"/Date(1711448543245+0800)/","Ack":"Success","Errors":[],"Extension":[{"Id":"CLOGGING_TRACE_ID","Value":"9115616579327965761"},{"Id":"RootMessageId","Value":"100025527-0a8199f1-475402-1228053"}]},"shareResponses":[{"getTripGenChatResultResponse":{"hasResult":true,"deeplink":"ctripglobal://hotel/hotellist?city=734&filters=%5B%7B%22data%22%3A%7B%22title%22%3A%22Mountain%20view%22%2C%22filterID%22%3A%223%7C243%22%7D%7D%5D","buttonTextRefresh":"重新載入酒店","buttonText":"查看酒店","text":"根據您的搜索參數，我正在尋找提供絕佳景觀的京都酒店。","failText":"我搵唔到符合您要求嘅酒店，但係我有其他推介。","resultCode":3,"intentionType":2,"pageAlias":"HOTEL_LIST","status":"COMPLETE","needLenovoQuestion":true,"rag":0},"quiz":"京都哪些酒店附近的景觀最優美？","chatId":"33b59916-93fd-43cd-ae02-41fcf0585040"},{"getTripGenChatResultResponse":{"hasResult":true,"deeplink":"ctripglobal://FlightListAB?dct=SHA&act=SIN&tp=i&dn=%E4%B8%8A%E6%B5%B7%7C%E6%96%B0%E5%8A%A0%E5%9D%A1&ft=s&st=0&fc=ys&source=tripgen&tid=F0015_10320607445","h5Url":"/m/flights/flightfirst/?dcitycode=SHA&acitycode=SIN&triptype=0&sorttype=1","buttonTextRefresh":"重新載入航班","buttonText":"查看航班","text":"經過全面搜尋，我發現咗由上海去新加坡嘅機票，相信呢個選擇對你嚟講係一個好好嘅選擇。","failText":"我搵唔到符合您要求嘅航班，但係我有其他推介。","resultCode":3,"intentionType":3,"pageAlias":"FLIGHT_LIST","status":"COMPLETE","needLenovoQuestion":true,"rag":0},"quiz":"预定上海到新加坡的机票","chatId":"47a75fd5-f4c1-45df-ad50-d0200a7cfe25"}],"downloadDeeplink":"ctripglobal://mytrip/tripgen2?type=full_from_share&pagealias=tg_share_h5&frompageid=10650136832&shareId=e9cfd0bd-ddf6-4682-a3f5-635a309d7687&fallbackUrl=https%3A%2F%2Fhk.trip.com%2Ftripgenie%2Fshare%3FshareId%3De9cfd0bd-ddf6-4682-a3f5-635a309d7687%26locale%3Dzh_HK%26type%3Dfull_from_share%26pagealias%3Dtg_share_h5%26frompageid%3D10650136832%26wkp%3D1","quizs":"京都哪些酒店附近的景觀最優美？,预定上海到新加坡的机票"}
    }
}
