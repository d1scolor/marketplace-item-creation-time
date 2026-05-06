(() => {
  function scan(text, source = "") {
    if (!text || !text.includes("marketplace_product_details_page")) return;

    const title =
      text.match(/"marketplace_listing_title"\s*:\s*"([^"]+)"/)?.[1] ||
      text.match(/"base_marketplace_listing_title"\s*:\s*"([^"]+)"/)?.[1];

    const id = text.match(/"id"\s*:\s*"(\d+)"/)?.[1];
    const match = text.match(/"creation_time"\s*:\s*(\d+)/);

    if (match) {
      const ts = Number(match[1]);
      console.log("✅ Marketplace creation_time found");
      console.log("Source:", source);
      console.log("Title:", title || "(not found)");
      console.log("ID:", id || "(not found)");
      console.log("Unix:", ts);
      console.log("Local:", new Date(ts * 1000).toLocaleString());
      console.log("UTC:", new Date(ts * 1000).toISOString());
    }
  }

  // Patch fetch
  const oldFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await oldFetch.apply(this, args);
    const url = String(args[0]?.url || args[0] || "");
    if (url.includes("/api/graphql/")) {
      res.clone().text().then(t => scan(t, url)).catch(() => {});
    }
    return res;
  };

  // Patch XHR
  const oldOpen = XMLHttpRequest.prototype.open;
  const oldSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__url = String(url || "");
    return oldOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", function () {
      if (this.__url?.includes("/api/graphql/")) {
        scan(this.responseText, this.__url);
      }
    });
    return oldSend.apply(this, args);
  };

  console.log("✅ Marketplace watcher installed. Now click/open a listing in this same tab.");
})();
