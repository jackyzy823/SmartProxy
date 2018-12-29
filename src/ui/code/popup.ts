import { browser } from "../../lib/environment";
import { jQuery } from "../../lib/External";

export class popup {
    private static popupData = null;

    public static initialize() {

        this.onDocumentReady(this.bindEvents);

        browser.runtime.sendMessage("getDataForPopup")
            .then(function (dataForPopup) {

                if (dataForPopup != null) {
                    popup.popupData = dataForPopup;
                    popup.populateDataForPopup(dataForPopup);
                }
            },
                function (error) {
                    browser.runtime.sendMessage("getDataForPopup failed! > " + error);
                });
    }

    private static onDocumentReady(callback:Function){
        jQuery(document).ready(callback);
    }

    private static bindEvents() {
        jQuery("#openSettings").click(function () {
            browser.runtime.openOptionsPage();
            window.close();
        });
        jQuery("#openProxiable").click(function () {
            console.log("openProxiable");
            if (!popup.popupData)
                return;

            var sourceTabId = popup.popupData.currentTabId;
            browser.tabs.create(
                {
                    active: true,
                    //openerTabId: null,
                    url: browser.extension.getURL(`ui/proxyable.html?id=${sourceTabId}`)
                }
            );
            window.close();
        });
    }

    private static populateDataForPopup(dataForPopup) {
        if (dataForPopup.restartRequired) {
            jQuery("#divRestartRequired").show();
        }

        // this.populateProxyMode(dataForPopup.proxyMode, dataForPopup);
        // this.populateActiveProxy(dataForPopup);
        // this.populateProxiableDomainList(dataForPopup.proxiableDomains);
    }
}

popup.initialize();