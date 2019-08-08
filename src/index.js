import { COLOR } from './lib/sample'
import $ from 'jquery'

window.addEventListener('DOMContentLoaded', () => {
  let e = document.createElement('div')
  e.style.cssText = `background-color:${COLOR};`
  $('.wrapper').append(e);
})

$(document).ready(() => {
  let e = document.createElement('div')
  e.style.cssText = `background-color:purple;`
  $('.wrapper').append(e);
})

import { friction } from './lib/friction'

$(document).ready(() => {
  friction()
})
