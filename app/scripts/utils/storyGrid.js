import map from 'lodash/collection/map'
import reqwest from 'reqwest'

const FEED_URL = 'http://rsstojson.texastribune.org/elections'

function htmlify (data) {
  let content = `<a href="${data.url}" class="list__item story-grid__link">${data.title}</a>`

  return content
}

function loadStories (destEl) {
  reqwest({
    url: FEED_URL,
    method: 'get',
    type: 'json',
    contentType: 'application/json',
    crossOrigin: true,
    success: (res) => {
      let output = map(res.data.slice(0, 4), (entry) => {
        return htmlify(entry)
      })

      destEl.innerHTML = output.join('')
    }
  })
}

let el = document.querySelector('#js-story-box')
if (el) loadStories(el)
