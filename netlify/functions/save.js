// netlify/functions/save.js
// Node 18 runtime (Netlify) มี global fetch
exports.handler = async (event) => {
  try {
    // อ่าน payload ที่มาจากหน้าเว็บ (เราจะส่ง JSON)
    const body = event.body ? JSON.parse(event.body) : {};
    // Google Apps Script URL (doPost) — แนะนำเก็บใน environment variable GAS_URL
    const GAS_URL = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbytgXBGvLNHGsmTT9RBnuxblCkkNCmLq70LC8WlBEWN0codracce5iGxNlJmgHJGir3/exec';

    // ส่งต่อเป็น form-data (GAS จะอ่านจาก e.parameter.payload)
    const params = new URLSearchParams();
    params.append('payload', JSON.stringify(body));

    const resp = await fetch(GAS_URL, {
      method: 'POST',
      body: params
      // server2server ไม่ต้อง set CORS headers
    });

    const text = await resp.text();

    // ส่งกลับให้ browser
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', raw: text })
    };
  } catch (err) {
    console.error('save.js error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
};
