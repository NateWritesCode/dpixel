// pixel-script/pixel-script.ts
(function (window) {
   var DPixelBase = {
      getTimestamp: () => {
         return new Date().toISOString();
      },
      getFullUrl: () => {
         return window.location.href;
      },
      getFbcCookie: () => {
         const cookies = document.cookie.split(";");
         for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("_fbc=")) {
               return cookie.substring(5);
            }
         }
         return null;
      },
      getBrowserType: () => {
         return navigator.userAgent;
      },
      sendToServer: (data) => {
         const xhr = new XMLHttpRequest();
         const url = "http://localhost:8787/collect";
         xhr.open("POST", url, true);
         xhr.setRequestHeader("Content-Type", "application/json");
         xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
               if (xhr.status === 200) {
                  // console.log("Data sent successfully");
               } else {
                  // console.error("Error sending data:", xhr.status);
               }
            }
         };
         xhr.send(JSON.stringify(data));
      },
      trackEvent: function (action) {
         const eventData = {
            timestamp: this.getTimestamp(),
            url: this.getFullUrl(),
            fbcCookie: this.getFbcCookie(),
            browserType: this.getBrowserType(),
            action: action || null,
         };
         // console.log("Tracked event:", eventData);
         this.sendToServer(eventData);
      },
   };

   // Setup DPixel to work with the loader script
   var DPixel = window.DPixel;

   // Process any queued commands
   DPixel.callMethod = function () {
      var args = Array.prototype.slice.call(arguments);
      var method = args.shift();
      if (DPixelBase[method]) {
         DPixelBase[method].apply(DPixelBase, args);
      }
   };

   // Process the existing queue
   var queue = DPixel.queue || [];
   while (queue.length > 0) {
      DPixel.callMethod.apply(DPixel, queue.shift());
   }

   // Replace queue with direct call to callMethod
   DPixel.push = function () {
      DPixel.callMethod.apply(DPixel, arguments);
   };

   // Expose DPixelBase methods through DPixel
   for (var key in DPixelBase) {
      if (DPixelBase.hasOwnProperty(key)) {
         DPixel[key] = DPixelBase[key];
      }
   }
})(window);
