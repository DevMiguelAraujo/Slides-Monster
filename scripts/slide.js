export class Slide{
    constructor(slide, container){
        this.slide = document.querySelector(slide)
        this.container = document.querySelector(container)
        this.distance = {
            finalPosition: 0, 
            startX: 0, 
            movement: 0
        }
        this.activeClass = 'active'
    }

    transition(active){ // Ativa o estilo CSS de transform, para que o movimento seja suavizado.
        this.slide.style.transition = active ? 'transform .9s' : ''
    }

    moveSlide(distX){ // Método que altera o valor de transform translate3d dos slides, fazendo com que se movam.
        this.distance.movePosition = distX 
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    updatePosition(positionX){ // Retorna o quanto de movimentação o usuario realizou na tela.
        this.distance.movement = (this.distance.startX - positionX) * 1.65 
        return this.distance.finalPosition - this.distance.movement
    }

    start(event){ // Método verifica se o evento disparado foi pelo mouse ou pelo touch e determina onde que o movimento se iniciou. 
        let moveType
        if (event.type === 'mousedown'){
            event.preventDefault()
            this.distance.startX = event.clientX
            moveType = 'mousemove'
        } else{
            this.distance.startX = event.changedTouches[0].clientX
            moveType = 'touchmove'
        }
        this.container.addEventListener(moveType, this.onMove) // O Método tambêm adiciona um evento que é disparado conforme a movimentação do user na tela.
        this.transition(false)
    }

    onMove(event){ // Método verifica a posição atual do mouse ou do touch.
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
        const finalPosition = this.updatePosition(pointerPosition)
        this.moveSlide(finalPosition)
    }

    end(event){ // Método retira o evento adicionado no método 'start' e atualiza no objeto 'distance' a posição final.
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
        this.container.removeEventListener(moveType, this.onMove)
        this.distance.finalPosition = this.distance.movePosition
        this.transition(true)
        this.changeSlideOnEnd()
    }

    changeSlideOnEnd(){ // Método que escolhe qual vai ser o próximo slide com base no valor de movimento.
        if(this.distance.movement > 350 && this.index.next !== undefined){
            this.activeNextSlide()
            if(this.distance.movement > 1150) this.activeNextSlide()
        } else if(this.distance.movement < -350 && this.index.previous !== undefined){
            this.activePreviousSlide()
            if(this.distance.movement < -1150) this.activePreviousSlide()
        } else{
            this.chooseSlide(this.index.active)
        }
    }

    addSlideEvents(){ // Método que adiciona os eventos que vão disparar as funções dos slides.
        this.container.addEventListener('mousedown', this.start)
        this.container.addEventListener('touchstart', this.start)
        this.container.addEventListener('mouseup', this.end)
        this.container.addEventListener('touchend', this.end)
    }

    // Configuração Array Slides

    slidesPosition(i){ //Pega o parâmetro selecionado e retorna a largura da tela - a do parâmetro e então a divide por 2, resultando no espaço que deve ficar de cada lado. 
        const margin = (this.container.offsetWidth - i.offsetWidth) / 2
        return -(i.offsetLeft - margin)
    }

    slidesArray(){ // Método cria uma array que possui cada elemento do slide individual e sua posição.
        this.slideArray = [...this.slide.children].map((element) =>{
            const position = this.slidesPosition(element)
            return { position, element }
        })
    }
    
    slidesIndexNav(index){ // Método declara uma variável que possui o index do slide ativo, anterior e posterior.
        const last = this.slideArray.length - 1
        this.index = {
            previous: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1
        }
    }

    chooseSlide(index){ //Método movimenta os slides para o escolhido com base em seu index.
        const activeSlide = this.slideArray[index]
        this.moveSlide(activeSlide.position)
        this.slidesIndexNav(index)
        this.distance.finalPosition = activeSlide.position
        this.changeActiveSlide()
    }

    changeActiveSlide(){ // Alterna o elemento que possui a class active.
        this.slideArray.forEach(i => i.element.classList.remove(this.activeClass))
        this.slideArray[this.index.active].element.classList.add(this.activeClass)
    }

    activePreviousSlide(){
        if(this.index.previous !== undefined) this.chooseSlide(this.index.previous)
    }

    activeNextSlide(){
        if(this.index.next !== undefined) this.chooseSlide(this.index.next)
    }

    onResize(){ // Após o tempo de 1 segundo, tefaz as posições dos slides.
        setTimeout(() =>{
            this.slidesArray()
            this.chooseSlide(this.index.active)
        }, 1000)
    }

    addResizeEvent(){  // Faz com que toda vez que a tela tenha seu tamanho alterado, um evento seja disparado.
        addEventListener('resize', this.onResize)
    }

    bindEvents(){ // Método para determinar que ao chamar o 'this' dentro dos métodos listados o resultado seja essa própria class.
        this.start = this.start.bind(this)
        this.end = this.end.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onResize = this.onResize.bind(this)
        this.activeNextSlide = this.activeNextSlide.bind(this)
        this.activePreviousSlide = this.activePreviousSlide.bind(this)
    }

    initFunctions(){
        this.bindEvents()
        this.transition(true)
        this.addSlideEvents()
        this.slidesArray()
        this.addResizeEvent()
        this.chooseSlide(0)
        return this
    }    
}

export class SlideNav extends Slide{
    bindEvents(){
        super.bindEvents()
        this.addArrow = this.addArrow.bind(this)
        this.addArrowEvent = this.addArrowEvent.bind(this)
    }
    addArrow(prev, next){
        this.prevButton = document.querySelector(prev)
        this.nextButton = document.querySelector(next)
        this.addArrowEvent()
    }
    addArrowEvent(){
        this.prevButton.addEventListener('click', this.activePreviousSlide)
        this.nextButton.addEventListener('click', this.activeNextSlide)
    }
}