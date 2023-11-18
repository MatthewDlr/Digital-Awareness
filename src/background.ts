let isDoomScrollingEnabled: boolean = false;
let totalScrolls: number = 0;
let previousScrollCount: number = 0;
let realScrollsCount: number = 0;
let tabOpenedAt: Date = new Date();
let intervalId: any;
let lastScrollTop = 0;

chrome.storage.sync.get('doomScrollingNotification', (result) => {
  if (result['doomScrollingNotification'] == true) {
    isDoomScrollingEnabled = true;
    intervalId = setInterval(checkChanges, 2500);
  }
});

window.addEventListener("scroll", function(e) {
  let st = window.scrollY;
  if (st > lastScrollTop && isDoomScrollingEnabled){
     totalScrolls++;
  }
  lastScrollTop = st <= 0 ? 0 : st; 
}, false);

function checkChanges() {
  if (previousScrollCount < totalScrolls) {
    realScrollsCount++;
    console.log('user scrolled: ' + realScrollsCount + ' times');
  }
  previousScrollCount = totalScrolls;

  if (realScrollsCount > 10) {
    console.log('user is doom scrolling');
    window.scrollTo({top: 0, behavior: 'smooth'});
    clearInterval(intervalId);
    window.removeEventListener("scroll", function(e) {});
    rediretToBlockPage();
  }
}

function rediretToBlockPage() {}

// function getVideoTimer() {
//   var timeCurrent = document.querySelector('.ytp-time-current')?.innerHTML;
//   var timeDuration = document.querySelector('.ytp-time-duration')?.innerHTML;

//   console.log(timeCurrent + ' / ' + timeDuration);
// }
