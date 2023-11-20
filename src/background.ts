let isDoomScrollingEnabled: boolean = false;
let totalScrolls: number = 0;
let previousScrollCount: number = 0;
let realScrollsCount: number = 0;
let tabOpenedAt: Date = new Date();
let intervalId: any;
let lastScrollTop = 0;
let isDevMode = false;
let scrollTreshold: number = 10;

chrome.storage.sync.get('doomScrollingNotification', (result) => {
  if (result['doomScrollingNotification'] == true) {
    isDoomScrollingEnabled = true;
    intervalId = setInterval(checkChanges, 2500);
  }
});

chrome.storage.local.get('isDevMode', (result) => {
  isDevMode = result['isDevMode'] || false;
  console.log('isDevMode: ', isDevMode);
});

// Watching for scroll down event
window.addEventListener(
  'scroll',
  function (e) {
    let st = window.scrollY;
    if (st > lastScrollTop && isDoomScrollingEnabled) {
      totalScrolls++;
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false,
);

window.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowDown' && isDoomScrollingEnabled) {
    totalScrolls++;
  }
});

function checkChanges() {
  if (previousScrollCount < totalScrolls) {
    realScrollsCount++;
    isDevMode
      ? console.log('user scrolled: ' + realScrollsCount + ' times')
      : null;
  }
  previousScrollCount = totalScrolls;

  if (!isDevMode && tabOpenedAt > new Date(Date.now() - 1000 * 60 * 10)) {
    isDevMode ? console.log('Wait 10 min before checking') : null;
    return;
  }

  if ((isDevMode && realScrollsCount > 5) || realScrollsCount > 100) {
    console.log('user is doom scrolling');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearInterval(intervalId);
    window.removeEventListener('scroll', function (e) {});
    rediretToBlockPage();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }
}

function rediretToBlockPage() {}

// function getVideoTimer() {
//   var timeCurrent = document.querySelector('.ytp-time-current')?.innerHTML;
//   var timeDuration = document.querySelector('.ytp-time-duration')?.innerHTML;

//   console.log(timeCurrent + ' / ' + timeDuration);
// }
