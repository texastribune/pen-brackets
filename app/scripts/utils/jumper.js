import forEach from 'lodash/collection/each'

const jumpers = document.querySelectorAll('.js-jumper')

forEach(jumpers, (jumper) => {
  jumper.addEventListener('click', function (e) {
    let activeEl = e.target
    let attr = activeEl.getAttribute('data-jumper')

    let el = document.querySelector('#' + attr)
    window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - 10)
  })
})
