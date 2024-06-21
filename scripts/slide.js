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
        let moveType
        if (event.type === 'mousedown'){
            event.preventDefault()
            this.distance.startX = event.clientX
            moveType = 'mousemove'
        } else{
            this.distance.startX = event.changedTouches[0].clientX
            moveType = 'touchmove'
        }
        this.container.addEventListener(moveType, this.onMove)
    }

    onMove(event){
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
        const finalPosition = this.updatePsition(pointerPosition)
        this.moveSlide(finalPosition)
    }

    end(event){
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
        this.container.removeEventListener(moveType, this.onMove)
        this.distance.finalPosition = this.distance.movePosition
    }

    addSlideEvents(){
        this.container.addEventListener('mousedown', this.start)
        this.container.addEventListener('touchstart', this.start)
        this.container.addEventListener('mouseup', this.end)
        this.container.addEventListener('touchend', this.end)
    }

    bindEvents(){
        this.start = this.start.bind(this)
        this.end = this.end.bind(this)
        this.onMove = this.onMove.bind(this)
    }

    // Configuração Array Slides

    slidesPosition(i){
        const margin = (this.container.offsetWidth - i.offsetWidth) / 2
        return -(i.offsetLeft - margin)
    }

    slidesArray(){
        this.slideArray = [...this.slide.children].map((element) =>{
            const position = this.slidesPosition(element)
            return { position, element }
        })
    }
    
    slidesIndexNav(index){
        const last = this.slideArray.length - 1
        this.index = {
            previous: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1
        }
    }

    chooseSlide(index){
        const activeSlide = this.slideArray[index]
        this.moveSlide(activeSlide.position)
        this.slidesIndexNav(index)
        this.distance.finalPosition = activeSlide.position
    }

    initFunctions(){
        this.bindEvents()
        this.addSlideEvents()
        this.slidesArray()
        return this
    }
}
