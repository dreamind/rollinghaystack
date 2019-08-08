export const COLOR = 'grey'
import { each } from 'lodash' // must use namedExports 
// Alternatively, use:
// import each from 'lodash/each'
import $ from 'jquery'

$(document).ready(() => {
  each([1, 2], function (i){
    $('.block-' + i).fadeIn(2000)
  })  
})

