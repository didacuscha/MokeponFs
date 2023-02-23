const sectionChooseAttack = document.getElementById('choose-attack')
const sectionRestart = document.getElementById('restart')
const buttonMokeponPlayer = document.getElementById('mokepon-button')
const restartButton = document.getElementById('restart-button')
sectionRestart.style.display = 'none'

const sectionChooseMokepon = document.getElementById('choose-mokepon')
const spanMokeponPlayer = document.getElementById('mokepon-player')

const spanMokeponEnemy = document.getElementById('mokepon-enemy')

const spanPlayerLifes = document.getElementById('player-lifes')
const spanEnemyLifes = document.getElementById('enemy-lifes')

const messagesSection = document.getElementById('result')
const attacksOfPlayer = document.getElementById('attacks-of-player')
const attacksOfEnemy = document.getElementById('attacks-of-enemy')
const cardsContainer = document.getElementById('cardsContainer')
const containerAttacks = document.getElementById('containerAttacks')

const sectionShowMap = document.getElementById('show-map')
const map = document.getElementById('map')

let playerId = null 
let enemyId = null
let mokepons = []
let mokeponEnemies = []
let playerAttack = []
let enemyAttack = []
let mokeponOptions
let inputCharmander 
let inputSquirtle 
let inputBulbasour 
let playerMokepon
let obtainMokepon
let mokeponAttacks
let enemyMokeponAttacks
let fireButton 
let waterButton 
let earthButton 
let buttons = []
let indexPlayerAttack
let indexEnemyAttack
let playerVictories = 0
let enemyVictories = 0
let playerLifes = 3
let enemyLifes = 3
let canvas = map.getContext("2d")
let interval
let backgroundMap = new Image()
backgroundMap.src = './assets/mokemap.png'
let heightSought 
let mapWidth = window.innerWidth - 20
heightSought = mapWidth + 600 / 800
map.width = mapWidth
map.height = heightSought
const mapWidthMax = 350

if (mapWidth > mapWidthMax) {
   mapWidth = mapWidthMax - 20
}

class Mokepon {
   constructor(name, picture, life, pictureMap, id=null) {
      this.id = id
      this.name = name 
      this.picture = picture
      this.life = life 
      this.attacks = []
      this.width = 60
      this.height = 60
      this.x = random(0, map.width - this.width)
      this.y = random(0, map.height - this.height)
      this.mapPicture = new Image()
      this.mapPicture.src = pictureMap
      this.speedX = 0
      this.speedY = 0
   }

   paintMokepon() {
      canvas.drawImage(
         this.mapPicture,
         this.x,
         this.y,
         this.width,
         this.height
      )
   }
}

let charmander = new Mokepon ('Charmander', './assets/Charmander.png', 5, './assets/CharmanderHead.png')
let squirtle = new Mokepon ('Squirtle', './assets/Squirtle.png', 5, './assets/SquirtleHead.png')
let bulbasour = new Mokepon ('Bulbasour', './assets/Bulbasour.png', 5, './assets/BulbasourHead.png')

const CHARMANDER_ATTACKS = [
   { name: '🔥', id: 'fire-button' },
   { name: '🔥', id: 'fire-button' },
   { name: '🔥', id: 'fire-button' },
   { name: '💧', id: 'water-button' },
   { name: '🌳', id: 'earth-button' },
]
charmander.attacks.push(...CHARMANDER_ATTACKS)

const SQUIRTLE_ATTACKS = [
   { name: '🔥', id: 'fire-button' },
   { name: '💧', id: 'water-button' },
   { name: '💧', id: 'water-button' },
   { name: '💧', id: 'water-button' },
   { name: '🌳', id: 'earth-button' },
]
squirtle.attacks.push (...SQUIRTLE_ATTACKS)

const BULBASOUR_ATTACKS = [
   { name: '🔥', id: 'fire-button' },
   { name: '💧', id: 'water-button' },
   { name: '🌳', id: 'earth-button' },
   { name: '🌳', id: 'earth-button' },
   { name: '🌳', id: 'earth-button' },
]
bulbasour.attacks.push(...BULBASOUR_ATTACKS)

mokepons.push(charmander,squirtle,bulbasour)

function startGame(){
    sectionChooseAttack.style.display = 'none'
    sectionShowMap.style.display = 'none'

    mokepons.forEach((mokepon) => {
     mokeponOptions = `
     <input type="radio" name="mokepon" id=${mokepon.name} />
      <label class="mokepon-card" for=${mokepon.name}>
         <p>${mokepon.name}</p>
         <img src=${mokepon.picture} alt=${mokepon.name}>
      </label>
      `
      cardsContainer.innerHTML += mokeponOptions
      inputCharmander = document.getElementById('Charmander')
      inputSquirtle = document.getElementById('Squirtle')
      inputBulbasour = document.getElementById('Bulbasour')
   })

    buttonMokeponPlayer.addEventListener('click', chooseMokeponPlayer)
    
    restartButton.addEventListener('click', restartGame)

    joinGame()
}

function joinGame() {
   fetch("http://macbook-pro.local:8080/unite")
      .then(function (res) {
         if (res.ok) {
            res.text()
               .then(function(answer){
                  console.log(answer)
                  playerId = answer
               })
         }
      })
}

function chooseMokeponPlayer() {
   if (inputCharmander.checked){
        spanMokeponPlayer.innerHTML = inputCharmander.id
        playerMokepon = inputCharmander.id
   } else if (inputSquirtle.checked){
        spanMokeponPlayer.innerHTML = inputSquirtle.id
        playerMokepon = inputSquirtle.id
   } else if (inputBulbasour.checked){
        spanMokeponPlayer.innerHTML = inputBulbasour.id
        playerMokepon = inputBulbasour.id
   } else {
        alert ("Please choose a Mokepon")
       return
   }

   sectionChooseMokepon.style.display = 'none'

   chooseMokepon(playerMokepon)

   extractAttacks(playerMokepon)
   sectionShowMap.style.display = 'flex'
   startMap()
}

function chooseMokepon(playerMokepon) {
   fetch(`http://macbook-pro.local:8080/mokepon/${playerId}`, {
      method: "post",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         mokepon: playerMokepon
      })
   })
}

function extractAttacks(playerMokepon){
   let attacks
   for (let i = 0; i < mokepons.length; i++) {
      if (playerMokepon === mokepons[i].name) {
         attacks = mokepons[i].attacks
      }
      
   }
   showAttacks(attacks)
}

function showAttacks(attacks) {
   attacks.forEach((attack) => {
      mokeponAttacks = `
      <button id=${attack.id} class="attack-button AButton">${attack.name} </button>
      `
      containerAttacks.innerHTML += mokeponAttacks
   })

   fireButton = document.getElementById('fire-button')
   waterButton = document.getElementById('water-button')
   earthButton = document.getElementById('earth-button')
   buttons = document.querySelectorAll('.AButton')
}

function attackSequence() {
   buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
         if (e.target.innerText === '🔥') {
            playerAttack.push('FIRE')
            console.log(playerAttack)
            button.style.background = '#112f58'
            button.disabled = true
         } else if (e.target.innerText === '💧') {
            playerAttack.push('WATER')
            console.log(playerAttack)
            button.style.background = '#112f58'
            button.disabled = true
         } else {
            playerAttack.push('EARTH')
            console.log(playerAttack)
            button.style.background = '#112f58'
            button.disabled = true
         } 
         if(playerAttack.length === 5) {
            sendAttacks() 
         } 
      })
   })
}

function sendAttacks() {
   fetch(`http://macbook-pro.local:8080/mokepon/${playerId}/attacks`, {
      method: "post",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         attacks: playerAttack
      })
   })

   interval = setInterval(obtainAttacks, 50)
}

function obtainAttacks () {
   fetch(`http://macbook-pro.local:8080/mokepon/${enemyId}/attacks`)
      .then(function(res) {
         if (res.ok) {
            res.json()
               .then(function ({ attacks }) {
                  if (attacks.length === 5) {
                     enemyAttack = attacks
                     combat()
                  }
               })
         }
      })
}

function chooseMokeponEnemy(enemy) {
   spanMokeponEnemy.innerHTML = enemy.name
   enemyMokeponAttacks = enemy.attacks
   attackSequence()
}

function enemyRandomAttack() {
   console.log('Enemy attacks', enemyMokeponAttacks)
   let randomAttack = random(0,enemyMokeponAttacks.length -1)

   if (randomAttack == 0 || randomAttack ==1) {
      enemyAttack.push('FIRE')
   } else if (randomAttack == 3 || randomAttack == 4) {
      enemyAttack.push('WATER')
   } else {
      enemyAttack.push('EARTH')
   } 
   console.log(enemyAttack)
   startFight()
}

function startFight() {
   if (playerAttack.length === 5) {
      combat()
   }
}

function indexBoth(player, enemy) {
   indexPlayerAttack = playerAttack[player]
   indexEnemyAttack = enemyAttack[enemy]
}

function combat() {
   clearInterval(interval)

   for (let index = 0; index < playerAttack.length; index++) {
      if(playerAttack[index] === enemyAttack[index]) {
         indexBoth(index, index)
         createMessage ("Tie")
      } else if (playerAttack[index] === 'FIRE' && enemyAttack[index] === 'EARTH' ) {
         indexBoth(index,index)
         createMessage ("player wins")
         playerVictories++
         spanPlayerLifes.innerHTML = playerVictories
      } else if (playerAttack[index] === 'WATER' && enemyAttack[index] === 'FIRE' ) {
         indexBoth(index,index)
         createMessage ("player wins")
         playerVictories++
         spanPlayerLifes.innerHTML = playerVictories
      } else if (playerAttack[index] === 'EARTH' && enemyAttack[index] === 'WATER' ) {
         indexBoth(index,index)
         createMessage ("player wins")
         playerVictories++
         spanPlayerLifes.innerHTML = playerVictories
      } else {
         indexBoth(index,index)
         createMessage ("You lose")
         enemyVictories++
         spanEnemyLifes.innerHTML = enemyVictories
      }
   }

   checkLifes()
}    

function checkLifes() {
   if (enemyVictories < playerVictories){
      createFinalMessage("CONGRATULATIONS, YOU WON")
   } else if (enemyVictories > playerVictories) {
      createFinalMessage("SORRY, YOU LOSE")
   } else {
      createFinalMessage("Close Game, TIE")
   }
}

function createMessage(result) {
   let newPlayerAttack = document.createElement('p')
   let newEnemyAttack = document.createElement('p')

   messagesSection.innerHTML = result
   newPlayerAttack.innerHTML = indexPlayerAttack
   newEnemyAttack.innerHTML = indexEnemyAttack

   attacksOfPlayer.appendChild(newPlayerAttack)
   attacksOfEnemy.appendChild(newEnemyAttack)
}

function createFinalMessage(finalResult) {
   messagesSection.innerHTML = finalResult
   sectionRestart.style.display = 'block'
}

function restartGame(){
   location.reload()
}

function random(min,max) {
   return Math.floor(Math.random() * (max - min + 1 ) + min)
}

function paintCanvas() {
   obtainMokepon.x = obtainMokepon.x + obtainMokepon.speedX
   obtainMokepon.y = obtainMokepon.y + obtainMokepon.speedY
   canvas.clearRect(0,0, map.width, map.height)
   canvas.drawImage(
      backgroundMap,
      0,
      0,
      map.width,
      map.height
   )   
   obtainMokepon.paintMokepon()

   sendPosition(obtainMokepon.x, obtainMokepon.y)

   mokeponEnemies.forEach(function (mokepon) {
      mokepon.paintMokepon()
      checkCollision(mokepon)
   })
}

function sendPosition(x, y) {
   fetch(`http://macbook-pro.local:8080/mokepon/${playerId}/position`, {
      method: "post",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         x,
         y
      })
})
.then(function (res) {
   if (res.ok) {
       res.json()
         .then(function ({ enemies }) {
            console.log(enemies)
            mokeponEnemies = enemies.map(function (enemy) {
            let enemyMokepon = null
            const mokeponName = enemy.mokepon.name || ""
            if (mokeponName === "Charmander") {
               enemyMokepon = new Mokepon ('Charmander', './assets/Charmander.png', 5, './assets/CharmanderHead.png', enemy.id)
            } else if (mokeponName === "Squirtle") {
               enemyMokepon = new Mokepon('Squirtle', './assets/Squirtle.png', 5, './assets/SquirtleHead.png', enemy.id)
            } else if (mokeponName === "Bulbasour") {
               enemyMokepon = new Mokepon('Bulbasour', './assets/Bulbasour.png', 5, './assets/BulbasourHead.png', enemy.id)
            }

            enemyMokepon.x = enemy.x
            enemyMokepon.y = enemy.y

            return enemyMokepon
         })
      })
   }
 })
}

function moveUp() {
   obtainMokepon.speedY = -5
}

function moveRight() {
   obtainMokepon.speedX = 5
}

function moveDown() {
   obtainMokepon.speedY = 5
}

function moveLeft() {
   obtainMokepon.speedX = -5
}

function stopMovement() {
   obtainMokepon.speedX = 0
   obtainMokepon.speedY = 0
}

function keyPressed(event) {
   switch (event.key) {
      case 'ArrowUp':
         moveUp()
         break
      case 'ArrowDown':
         moveDown()
         break
      case 'ArrowRight':
         moveRight()
         break
      case 'ArrowLeft':
         moveLeft()
         break
      default:
         break
   }
}

function startMap() {
   
   obtainMokepon = obtainMokeponObject(playerMokepon)
   console.log(obtainMokepon, playerMokepon)
   interval = setInterval(paintCanvas, 50)
   window.addEventListener('keydown', keyPressed)
   window.addEventListener('keyup', stopMovement)
}

function obtainMokeponObject() {
   for (let i = 0; i < mokepons.length; i++) {
      if (playerMokepon === mokepons[i].name) {
         return mokepons[i]
      } 
   }
}

function checkCollision(enemy) {
   const enemyUp = enemy.y
   const enemyDown = enemy.y + enemy.height
   const enemyRight = enemy.x + enemy.width 
   const enemyLeft = enemy.x

   const playerUp = obtainMokepon.y
   const playerDown = obtainMokepon.y + obtainMokepon.height
   const playerRight = obtainMokepon.x + obtainMokepon.width 
   const playerLeft = obtainMokepon.x

   if(
     playerDown < enemyUp ||
     playerUp > enemyDown ||
     playerRight < enemyLeft ||
     playerLeft > enemyRight 
   ) {
      return
   }

   stopMovement()
   clearInterval(interval)
   console.log('collision detected')

   enemyId = enemy.id
   sectionChooseAttack.style.display = 'flex'
   sectionShowMap.style.display = 'none'
   chooseMokeponEnemy(enemy)
   
}

window.addEventListener('load',startGame)