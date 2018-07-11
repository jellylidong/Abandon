import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  getTab() {
    // chrome.tabs.getCurrent(tab => {
    //   console.log(tab);
    // })
    console.log("clicked");
    // chrome.runtime.sendMessage({ popupMounted: true });
    let manifest = chrome.runtime.getManifest();
    console.log(manifest);
  }
}
