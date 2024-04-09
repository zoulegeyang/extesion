function updateHostPermissions(on) {
    chrome.storage.local.set({switchStatus: on});
}

// 关闭或打开插件
const switchButton = document.getElementById('switch');
switchButton.addEventListener('click', (e) => {
    updateHostPermissions(e.target.checked);
});

// confirm 回调
const confirmButton = document.getElementById('confirm');
confirmButton.addEventListener('click', () => {
    console.log('click')
    const request = document.querySelector('#match-url').value;
    const replaceValue = Array.from(document.querySelectorAll('.rule-kind')).find(input => input.checked).value;
    const mode = Array.from(document.querySelectorAll('.replace-mode')).find(input => input.checked).value;
    const matchType = 'normal';
    const matchMethod = 'POST';
    const ruleName = document.querySelector('.rule-name').value;
    const ruleOpen = document.querySelector('.rule-checked').checked;
    const groupName = document.querySelector('.group-name').value;
    const groupOpen = document.querySelector('.group-checked').checked;
    const replaceText = document.querySelector('#textarea').value;
    const obj = {
        groupName,
        open: groupOpen,
        interfaceList: [
            {
                open: ruleOpen,
                matchType,
                request,
                ruleName,
                matchMethod,
                [`${replaceValue}`]: replaceText,
                mode
            }
        ]
    }
    chrome.storage.local.set({rulesGroup: [obj]});
});
// 获取插件状态
chrome.storage.local.get('switchStatus', (data) => {
    switchButton.checked = data.switchStatus;
});

// // 获取存储的规则组
// chrome.storage.local.get('rulesGroup', (data) => {
//     const rules = data.rulesGroup || [];
//     const ruleList = document.getElementById('rule-list');
//     rules.forEach(rule => {
//         const li = document.createElement('li');
//         li.textContent = rule;
//         ruleList.appendChild(li);
//     });
// });