// 定義 LINE Channel Access Token，需替換為自己的 Token
const LINE_TOKEN = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";

// 定義管理者的 LINE ID 列表
var managers =
[
  "MANAGER_ID_1",
  "MANAGER_ID_2",
  "MANAGER_ID_3",
];

// 自訂的雜湊函數，將字串轉換為十六進位字串
function hashCode(str)
{
  let hash = 0;
  for (let i = 0; i < str.length; i++)
  {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char; // 位元運算
    hash |= 0; // 轉換為 32 位整數
  }
  hash = hash > 0 ? hash : -hash;
  return hash.toString(16).slice(-3); // 回傳最後三位十六進位字串
}

// 產生訂單雜湊字串，格式為 MMDD-最後三碼-雜湊值
function generateHashDateString(dateString, secondString, thirdString)
{
  // 1. 從日期字串中提取 MMDD
  const dateParts = dateString.split(" ");
  const date = dateParts[0].split("/");  // 拆分日期部分，例如 "2025/1/24"
  const month = date[1].padStart(2, "0"); // 確保月份為兩位數
  const day = date[2].padStart(2, "0");   // 確保日期為兩位數
  const mmdd = month + day;

  // 2. 提取第二個字串的最後三碼
  const lastThreeDigits = secondString.slice(-3);

  // 3. 雜湊第三個字串
  const hashValue = hashCode(thirdString);

  // 4. 組合成目標格式 MMDD-lastThreeDigits-hashValue
  return `${mmdd}-${lastThreeDigits}-${hashValue}`;
}

function test()
{
  // 測試範例
  const date = "2025/1/24 下午 8:50:31";
  const secondString = "ExampleSecondString123";
  const thirdString = "HashMeForHexadecimal";

  const result = generateHashDateString(date, secondString, thirdString);
  console.log(result);
}

function getOrderNumber(date, phoneNumber, orderDetail)
{
  return generateHashDateString(date, phoneNumber, orderDetail);
}

function formatDateString(dateString)
{
  // 步驟 1: 解析日期字串
  var parts = dateString.split(/[\s/:]/); // 依空白、斜線與冒號拆分
  var year = parseInt(parts[0]);
  var month = parseInt(parts[1]) - 1; // 月份從 0 開始
  var day = parseInt(parts[2]);
  var hour = parseInt(parts[4]);
  var minute = parseInt(parts[5]);
  var period = parts[3]; // "上午" 或 "下午"

  // 如果是下午且小於 12 時，轉換為 24 小時制
  if (period === "下午" && hour < 12)
  {
    hour += 12;
  }
  else if (period === "上午" && hour === 12)
  {
    hour = 0;
  }

  var date = new Date(year, month, day, hour, minute);

  // 步驟 2: 格式化日期為目標格式
  var daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
  var formattedDate = Utilities.formatString(
    "%04d/%02d/%02d %s %02d:%02d",
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    "星期" + daysOfWeek[date.getDay()],
    date.getHours(),
    date.getMinutes()
  );

  Logger.log(formattedDate);
  return formattedDate;
}

function onFormSubmit(e)
{
  try
  {
    try
    {
      Logger.log(JSON.stringify(e)); // 紀錄物件內容
    }
    catch (error)
    {
      Logger.log('記錄物件時發生錯誤：' + error.message);
    }

    // 使用 namedValues 取得表單回應
    const responses = e.namedValues;

    // 提取表單對應的值
    const userID = responses["LINE認證碼"][0];
    Logger.log(userID);
    const userLocation = responses["請問您的地址"][0];
    Logger.log(userLocation);
    const userPhone = responses["連絡電話"][0];
    Logger.log(userPhone);
    const userDeliverTime = formatDateString(responses["送貨時間"][0]);
    Logger.log(userDeliverTime);

    var userPS;
    if (responses["額外備註"][0])
    {
      userPS = responses["額外備註"][0];
    }
    else
    {
      userPS = "無";
    }
    Logger.log(userPS);

    // 組裝訂單內容
    var keywords =
    [
      "瓦斯公斤數與支數 [50公斤]",
      "瓦斯公斤數與支數 [20公斤]",
      "瓦斯公斤數與支數 [16公斤]",
      "瓦斯公斤數與支數 [10公斤]",
      "瓦斯公斤數與支數 [4公斤]"
    ];
    var userOrder = "";
    var isVaildOrder = false;
    for (var i = 0; i < keywords.length; i++)
    {
      Logger.log(responses[keywords[i]][0]);
      if (responses[keywords[i]][0] != "不需要")
      {
        isVaildOrder = true;
        userOrder += keywords[i] + '：' + responses[keywords[i]][0] + '\n';
      }
    }
    Logger.log(userOrder);

    var orderDetail = "";
    orderDetail += "\n地址：\n" + `${userLocation}` + "\n";
    orderDetail += "\n電話：\n" + `${userPhone}` + "\n";
    orderDetail += "\n希望送達時間：\n" + `${userDeliverTime}` + "\n";
    orderDetail += "\n訂購內容：\n" + `${userOrder}`;
    orderDetail += "\n額外備註：\n" + `${userPS}`;

    // 確認訂單內容
    var message;
    if (isVaildOrder)
    {
      message = "已收到訂單，我們會盡快送達！\n";
      message += "--------\n";
      message += "訂單編號：\n" + getOrderNumber(userDeliverTime, userPhone, orderDetail) + "\n";
      message += orderDetail;
    }
    else
    {
      message = "訂單錯誤（請至少選擇一支）！訂單未成立，請重新填寫訂單。\n";
      message += "--------\n";
      message += "訂單編號：\n" + getOrderNumber(userDeliverTime, userPhone, orderDetail) + "\n";
      message += orderDetail;
    }
    sendLineMessage(message, userID);

    // 發送訊息給管理者
    for (var manage = 0; manage < managers.length; manage++)
    {
      sendLineMessage(message, managers[manage]);
    }

    Logger.log(message);
  }
  catch (err)
  {
    console.error("處理表單回應時出錯：", err);
  }
}

function sendLineMessage(message, userID)
{
  const url = "https://api.line.me/v2/bot/message/push";
  const recipientID = userID;

  const payload =
  {
    to: recipientID,
    messages:
    [
      {
        type: "text",
        text: message
      }
    ]
  };

  const options =
  {
    method: "post",
    headers:
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_TOKEN}`
    },
    payload: JSON.stringify(payload)
  };

  try
  {
    const response = UrlFetchApp.fetch(url, options);
    console.log("訊息發送成功：", response.getContentText());
  }
  catch (err)
  {
    console.error("發送 LINE 訊息時出錯：", err);
  }
}