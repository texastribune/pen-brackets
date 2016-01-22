import classie from 'desandro-classie'
import scrollMonitor from 'scrollmonitor'

const contentEl = document.querySelector('#content')
const jumpToTopEl = document.querySelector('#jump-to-top')
const top = document.querySelector('#top')

let contentWatcher = scrollMonitor.create(contentEl, {
  top: 40
})

contentWatcher.partiallyExitViewport(function () {
  classie.remove(jumpToTopEl, 'show')
})

contentWatcher.enterViewport(function () {
  if (contentWatcher.isAboveViewport) {
    classie.remove(jumpToTopEl, 'show')
  }
})

contentWatcher.fullyEnterViewport(function () {
  classie.add(jumpToTopEl, 'show')
})

jumpToTopEl.addEventListener('click', e => {
  e.preventDefault()

  window.scrollTo(0, top.getBoundingClientRect().top + window.pageYOffset - 10)
})
