const board = document.querySelector('.board'),
      userPlatformSpeed = document.getElementById('platformSpeed'),
      startGameBtn = document.getElementById('startGame'),
      userDoodlerSpeed = document.getElementById('doodlerSpeed'),
      currentResult = document.getElementById('currentResult'),
      record = document.getElementById('record'),
      permisionForFakePlatform = document.getElementById('fakePlatform')
let pixelsFromTopForBeginning = [500, 400, 300, 200, 100, 0],
    isGameOver = false,
    isPlaying = false,
    isJumping = true,
    checkIfDoodlerCanJump,
    makeDoodlerToFall,
    stopPlatformsIfGameOver,
    result = 0

function startGame(){
    createPlatformsInTheBeginning()
    createDoodler()
    stopPlatformsIfGameOver = setInterval(movePlatformsToBottom, 50)
    jump()
}


// PLATFORMS

function createPlatformsInTheBeginning(){
    for(i = 0; i < 6; i++){
        let randomXposition = Math.floor(Math.random() * 451)
        let platform = document.createElement('div')
        platform.classList.add('platform')
        platform.style.left = randomXposition + 'px'
        platform.style.top = pixelsFromTopForBeginning[i] + 'px'
        board.appendChild(platform)
    }
}
function createPlatformAndReplaceRemoved(){
    if(result % 10 === 0 && permisionForFakePlatform.value === 'yes'){
        let randomXposition = Math.floor(Math.random() * 451)
        let platform = document.createElement('div')
        platform.classList.add('platform', 'fake')
        platform.style.left = randomXposition + 'px'
        platform.style.top = 0 + 'px'
        board.appendChild(platform)
    }else{
        let randomXposition = Math.floor(Math.random() * 451)
        let platform = document.createElement('div')
        platform.classList.add('platform')
        platform.style.left = randomXposition + 'px'
        platform.style.top = 0 + 'px'
        board.appendChild(platform)
    }
}


function movePlatformsToBottom(){
    let platforms = document.querySelectorAll('.platform')
    platforms.forEach(platform => {
        let currentTop = platform.style.top
        let split = currentTop.split('px')
        let getNumberFromSplit = split[0]
        let newTopValue = getNumberFromSplit*1 + userPlatformSpeed.value*1
        if(newTopValue >= 585){
            platform.style.display = 'none'
            platform.remove()
            result++
            createPlatformAndReplaceRemoved()
            currentResult.textContent = result
        }else{
            // Set new bottom
            platform.style.top = newTopValue + 'px'
        }
    })
}
// PLATFORMS


// DOODLER
function createDoodler(){
    let doodler = document.createElement('div')
    doodler.classList.add('doodler')
    let platformWhereDoodlerShouldAppear = document.querySelector('.platform')
    doodler.style.left = platformWhereDoodlerShouldAppear.style.left
    doodler.style.top = 450 + 'px'
    board.appendChild(doodler)
}

function control(e){
    if(isGameOver) return
    if(e.key === 'ArrowLeft'){
        let doodler = document.querySelector('.doodler')
        let left = doodler.style.left
        let split = left.split('px')
        let pixelsFromLeft = split[0]
        if(pixelsFromLeft <= 0){
            doodler.style.left = 0 + 'px'
        }else{
            let newPixelsValue = +pixelsFromLeft - 10
            doodler.style.left = newPixelsValue + 'px'
        }
    }

    if(e.key === 'ArrowRight'){
        let doodler = document.querySelector('.doodler')
        let left = doodler.style.left
        let split = left.split('px')
        let pixelsFromLeft = split[0]
        if(pixelsFromLeft >= 470){
            doodler.style.left = 470 + 'px'
        }else{
            let newPixelsValue = +pixelsFromLeft + 10
            doodler.style.left = newPixelsValue + 'px'
        }
    }
}



function jump(){
    let doodler = document.querySelector('.doodler')

    let doodlerLeftWithPixels = doodler.style.left
    let splitLeft = doodlerLeftWithPixels.split('px')
    let doodlerLeft = +splitLeft[0]

    let doodlerTopWithPixels = doodler.style.top
    let splitTop = doodlerTopWithPixels.split('px')
    let doodlerTop = +splitTop[0] + 50
    
    let platforms = document.querySelectorAll('.platform')
    platforms.forEach(platform => {
        //Getting value of platforms
        let topWithPixels = platform.style.top
        let split = topWithPixels.split('px')
        let numberPlatfromTop = +split[0]

        let leftWithPixels = platform.style.left
        let platformLeftSplit = leftWithPixels.split('px')
        let numberPlatformLeft = +platformLeftSplit[0]



        if(doodlerTop >= numberPlatfromTop &&
           doodlerTop <= numberPlatfromTop + 15 &&
           (doodlerLeft >= numberPlatformLeft &&
            doodlerLeft <= numberPlatformLeft + 50 ||
           doodlerLeft + 30 >= numberPlatformLeft &&
           doodlerLeft + 30 <= numberPlatformLeft + 50) &&
           !platform.classList.contains('fake')
        ){
            moveDoodlerToTop()
            clearInterval(checkIfDoodlerCanJump)
            clearInterval(makeDoodlerToFall)
        }
    })
}

function moveDoodlerToTop(){
    let doodler = document.querySelector('.doodler')
    let moveDoodlerUpSlow
    
    const moveDoodlerUpFast = setInterval(() => {
        let doodlerTopWithPixels = doodler.style.top
        let splitTop = doodlerTopWithPixels.split('px')
        let doodlerTop = +splitTop[0] 

        let newTopValue = doodlerTop - userDoodlerSpeed.value*1
        doodler.style.top = newTopValue + 'px'
    }, 50)
    setTimeout(() => clearInterval(moveDoodlerUpFast), 1200)

    setTimeout(() => {
        moveDoodlerUpSlow = setInterval(() => {
            let doodlerTopWithPixels = doodler.style.top
            let splitTop = doodlerTopWithPixels.split('px')
            let doodlerTop = +splitTop[0] 
            let newTopValue = doodlerTop - (userDoodlerSpeed.value*1 - 4)
            doodler.style.top = newTopValue + 'px'
        }, 50)
    }, 1200)

    setTimeout(() => {
        clearInterval(moveDoodlerUpSlow)
        moveDoodlerToBottom()
    }, 1400)
}

function moveDoodlerToBottom(){
    let doodler = document.querySelector('.doodler')
    makeDoodlerToFall = setInterval(() => {
        let doodlerTopWithPixels = doodler.style.top
        let splitTop = doodlerTopWithPixels.split('px')
        let doodlerTop = +splitTop[0] 
        if(doodlerTop + 50 >= 600){
            isGameOver = true
            isPlaying = false
            // Change button style
            startGameBtn.disabled = false
            startGameBtn.style.cursor = 'pointer'
            startGameBtn.classList.add('allowed')

            // Allow to use settings after the game
            userPlatformSpeed.disabled = false
            userDoodlerSpeed.disabled = false
            permisionForFakePlatform.disabled = false


            // Work with local starage
            let getRecord = localStorage.getItem('record')
            if(getRecord === null){
                localStorage.setItem('record', result)
                record.textContent = result
            }else if(result > getRecord){
                record.textContent = result
                alert(`You have a new record: ${result}!!! The previous record was ${getRecord}`)
                localStorage.setItem('record', result)
            }


            // Reset current result
            result = 0

            clearInterval(checkIfDoodlerCanJump)
            clearInterval(makeDoodlerToFall)
            clearInterval(stopPlatformsIfGameOver)
        }else{
            let newTopValue = doodlerTop + userDoodlerSpeed.value*1
            doodler.style.top = newTopValue + 'px'
        }
    }, 50)
    checkIfDoodlerCanJump = setInterval(() => {
        jump()
    }, 50);
}

// DOODLER




startGameBtn.addEventListener('click', () => {
    if(isPlaying) return
    isGameOver = false
    isPlaying = true
    // Change button style
    startGameBtn.disabled = true
    startGameBtn.style.cursor = 'not-allowed'
    startGameBtn.classList.remove('allowed')
    // Forbid to use settings via the game
    userPlatformSpeed.disabled = true
    userDoodlerSpeed.disabled = true
    permisionForFakePlatform.disabled = true
    // Remover plaforms and interval
    clearInterval(stopPlatformsIfGameOver)
    let platforms = document.querySelectorAll('.platform')
    platforms.forEach(platform => platform.remove())
    // Reset current result
    currentResult.textContent = ''
    // Remove doodler
    let doodler = document.querySelector('.doodler')
    if(doodler === null){
        startGame()
    }else{
        doodler.remove()
        startGame()
    }    
})
document.addEventListener('keydown', e => control(e))

// Local storage
document.addEventListener('DOMContentLoaded', () => {
    let getRecord = localStorage.getItem('record')
    if(getRecord === null){
        record.textContent = 0
    }else{
        record.textContent = getRecord
    }
})
