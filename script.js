import {SlideNav} from './scripts/slide.js'

const slide = new SlideNav('.slide', '.container_slide')

slide.initFunctions()
slide.slidesIndexNav(0)
slide.addArrow('.left', '.right')