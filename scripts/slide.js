export default class Slide{
    constructor(slide, container){
        this.slide = document.querySelector(slide)
        this.container = document.querySelector(container)
        this.distance = {
            finalPosition: 0, 
            startX: 0, 
            movement: 0
        }
    }

    moveSlide(distX){
        this.distance.movePosition = distX
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    updatePsition(positionX){
        this.distance.movement = (this.distance.startX - positionX) * 1.5
        return this.distance.finalPosition - this.distance.movement
    }

    start(event){
        event.preventDefault()
        this.distance.startX = event.clientX
        this.container.addEventListener('mousemove', this.onMove)
    }

    onMove(event){
        const finalPosition = this.updatePsition(event.clientX)
        this.moveSlide(finalPosition)
    }

    end(){
        this.container.removeEventListener('mousemove', this.onMove)
        this.distance.finalPosition = this.distance.movePosition
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
