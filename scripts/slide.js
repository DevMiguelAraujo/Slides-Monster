export default class Slide{
    constructor(slide, container){
        this.slide = document.querySelector(slide)
        this.container = document.querySelector(container)
    }

    start(event){
        event.preventDefault()
        this.container.addEventListener('mousemove', this.onMove)
    }

    onMove(){

    }

    end(){
        this.container.removeEventListener('mousemove', this.onMove)
    }

    addSlideEvents(){
        this.container.addEventListener('mousedown', this.start)
        this.container.addEventListener('mouseup', this.end)
    }

    bindEvents(){
        this.start = this.start.bind(this)
        this.end = this.end.bind(this)
        this.onMove = this.onMove.bind(this)
    }

    initFunctions(){
        this.bindEvents()
        this.addSlideEvents()
        return this
    }
}
