// ===== 12306 Clean Pro (Surge) =====
// 作者：重写版（?配 Surge）
// 功能：去广告 + ?面?化 + 防???常

if (!$response.body) {
  $done({});
}

let url = $request.url;
let body = $response.body;

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

let obj = safeParse(body);

if (!obj) {
  $done({ body });
}

// ? ===== ?屏广告?理 =====
if (url.includes("getAdList")) {
  obj.materialsList = [];
  obj.advertParam = {};
}

// ? ===== ?面?化（核心）=====
if (url.includes("mgw.htm")) {
  try {
    if (obj.data) {
      
      // ? 精准字段清理（?定）
      delete obj.data.advertInfo;
      delete obj.data.banner;
      delete obj.data.popup;
      delete obj.data.activityEntrance;
      delete obj.data.recommendList;
      delete obj.data.marketing;
      delete obj.data.operation;

      // ? 常?广告容器
      [
        "adList",
        "advertList",
        "bannerList",
        "promotionList",
        "popupList"
      ].forEach(k => delete obj.data[k]);

      // ? 数?清空（防 UI 占位）
      for (let key in obj.data) {
        if (
          Array.isArray(obj.data[key]) &&
          (
            key.toLowerCase().includes("ad") ||
            key.toLowerCase().includes("banner") ||
            key.toLowerCase().includes("promo")
          )
        ) {
          obj.data[key] = [];
        }
      }
    }

    // ? 全局兜底清理
    function deepClean(o) {
      if (!o || typeof o !== "object") return;

      Object.keys(o).forEach(k => {
        if (k.toLowerCase().includes("ad")) {
          delete o[k];
        } else {
          deepClean(o[k]);
        }
      });
    }

    deepClean(obj);

  } catch (e) {
    console.log("12306 clean error: " + e);
  }
}

body = JSON.stringify(obj);

$done({ body });