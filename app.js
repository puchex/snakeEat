let [boardWidth,boardHeight] = [50,50]
let [snakeSpeed,foodSpeed] = [80,5000]
let snake = []         // snake[0] is head.
let snakeSet = new Set()
let direction = 1 // 1-> right, 2->top 3-> left, 4-> bottom.              top left is (0,0)
let tiles = {}                                              // downwards x increases, right y increases
let score = 1000
let createBoard = () =>{
    if(snake.length)
    return
    const board = document.getElementById('snake-board')
    for(let i = 0;i<boardHeight;i++){
        const row = document.createElement('div');
        row.className = 'board-row'
        for(let j=0;j<boardWidth;j++){
            const item = document.createElement('div')
            item.className = "tile"
            // item.textContent = i*boardWidth+j
            tiles[i*boardWidth+j] = item;
            row.appendChild(item)
        }
        board.appendChild(row);
    }
    randX = boardHeight/2+Math.floor(Math.random()*(boardHeight/16));
    randY = boardWidth/2+Math.floor(Math.random()*(boardWidth/16));
    snakePush([randX,randY])
}

const snakePush = (pair) => {
    let [x,y] = pair
    const tile = tiles[x*boardWidth+y]
    tile.style.backgroundColor =  '#006400'
    snake.push(pair)
    snakeSet.add(pair[0]*boardWidth+pair[1])
}
const resetBoard = () =>{
    let board = document.getElementById('snake-board')
    while(board.firstChild){
        board.removeChild(board.firstChild);
    }
    snake = [] 
    snakeSet = new Set()
    tiles = {}
    direction = 2
    score = 1000
    // clearInterval(intervalId)
}
const isValidPos = (x,y) => {
    return x>=0 && x < boardHeight && y >=0 && y < boardWidth && (!snakeSet.has(x*boardWidth+y))
    && !hurdles.has(x*boardWidth+y)
}

const anyNeighbor = (x,y) => {
    let diff = [[0,1],[0,-1],[1,0],[-1,0]]
    for(let i =0 ;i<4;i++){
        if(isValidPos(x+diff[i][0],y+diff[i][1])){
            return [x+diff[i][0],y+diff[i][1]]
        }
    }
    console.log("Cant increase size for now")
    return -1
}
let feedSnake = () =>{
    if(!snake.length){
        createBoard()
        return
    }
    let tail = snake[snake.length-1]
    if(snake.length==1){
        let n = anyNeighbor(tail[0],tail[1])
        if(n==-1){
            return
        }
        score += 100
        snakePush(n)
        return
    }
    let lastSecond = snake[snake.length-2]
    let [x,y] = [2*tail[0]-lastSecond[0],2*tail[1]-lastSecond[1]]
    let curve = (Math.random()>0.5 ? 1 : -1)
    if(!curve && isValidPos(x,y)){
    score += 100
    snakePush([x,y])
    }
    else{
        [x,y] = tail
        let r = (Math.random() > 0.5 ? 1 : -1)
        if(tail[0] == lastSecond[0]){
            if(isValidPos(x+r,y)){
                score += 100
                snakePush([x+r,y])
            }
            else if(isValidPos(x-r,y)){
                score += 100
                snakePush([x-r,y])
            }
            else{
                // alert("Cant increase size for now!!")
            }
        }
        else{
            if(isValidPos(x,y+r)){
                score += 100
                snakePush([x,y+r])
            }
            else if(isValidPos(x,y-r) ){
                 score += 100
                    snakePush([x,y-r])
            }
            else{
                console.log("Cant increase size for now")

            }
        }
    }
}

const growSnake = () => {
}
const moveHead = () => {
    [x,y] = snake[0]
    let dir = [[0,1],[-1,0],[0,-1],[1,0]]        
    let h = [x+dir[direction-1][0],y+dir[direction-1][1]]
    if(isValidPos(h[0],h[1])){
        tiles[snake[0][0]*boardWidth+snake[0][1]].style.backgroundColor ='#006400'
        snake.splice(0,0,h)
        tiles[h[0]*boardWidth+h[1]].style.backgroundColor = 'black'
        snakeSet.add(h[0]*boardWidth+h[1])
        if(food.has(h[0]*boardWidth+h[1])){
            feedSnake()
            score+=120
            console.log("Food is delicious !! score : "+score)
            food.delete(h[0]*boardWidth+h[1])
        }
        return 1;
    }
    else{
        if(hurdles.has(h[0]*boardWidth+h[1])){
            console.log("Severe Damage : 300 pts : , score :" +score)
        }
        console.log("Damage : 120 pts , score  : "+score)
        score -= 120
        if(score<=0){
            console.log("Game Over!!")
        }
        return 0
    }
}
const snakeRemove = () =>{
    let [x,y] =  snake.pop()
    tiles[x*boardWidth+y].style.backgroundColor = '#d4b4b4'
    snakeSet.delete(x*boardWidth+y)
}
const moveTheSnake = () =>{
    if(snake.length){
        if(moveHead()==1){
        snakeRemove()
        }
    }
}

const intervalId = setInterval(() => {
    if(snake.length)
    moveTheSnake()
    if(score<0){
        // clearInterval(intervalId)
        console.log("GameOver!!")
    }
}, snakeSpeed);

const food = new Set()
const createFood = () => {
    randX = Math.floor(Math.random()*(boardHeight));
    randY = Math.floor(Math.random()*(boardWidth));
    let id = randX*boardWidth+randY
    console.log(randX)
    if(hurdles.has(id)||snakeSet.has(id))
        return
    tiles[randX*boardWidth+randY].style.backgroundColor = 'blue'
    tiles[randX*boardWidth+randY].style.borderRadius = '100%'
    food.add(randX*boardWidth+randY);
    setTimeout(() => {
        tiles[randX*boardWidth+randY].style.backgroundColor = '#d4b4b4'
        food.delete(randX*boardWidth+randY);
    },200000)
}
const foodInterval = setInterval( () => {
    if(snake.length)
    createFood()
    if(score<0){
        // clearInterval(foodInterval)
    }
},foodSpeed)

document.addEventListener('keydown',(event) => {
        console.log(event.key+" Key pressed")

        switch (event.key){
            case 'ArrowRight':
            case 'l':
                if(direction!=3) direction = 1
                break
            case 'ArrowUp':
            case 'k':
                if(direction !=4) direction = 2
                break
            case 'ArrowLeft' :
            case 'h':
                if(direction !=1) direction = 3
                break
            case 'ArrowDown':
            case 'j':
                if(direction !=2) direction = 4
                break
            case 'Enter':   
                createBoard()
                break
            default : 
                break
        }
})


// create hurdles.
let hurdles = new Set()
const createHurdle = () => {
    let alongX = Math.random() > 0.5 ? 1 : 0
    if(alongX){
        console.log("Allong x")
        let x = Math.floor(Math.random()*boardHeight)
        let y1 = Math.floor(Math.random()*boardWidth)
        let y2 = y1+Math.floor(Math.random()*(boardWidth-y1)/2)
        for(let y = y1;y<=y2;y++){
            console.log(" x : "+x+ " y : "+y)
        tiles[x*boardWidth+y].style.borderRadius = '0%'
        tiles[x*boardWidth+y].style.backgroundColor = '#424242'
            hurdles.add(x*boardWidth+y)
        }
        return
    }
    console.log("Allong x")

    let x1 = Math.floor(Math.random()*boardHeight)
    let x2 = x1+Math.floor(Math.random()*(boardHeight-x1)/2)
    let y = Math.floor(Math.random()*(boardWidth))
    for(let x = x1;x<=x2;x++){
        console.log(" x : "+x+ " y : "+y)
        tiles[x*boardWidth+y].style.backgroundColor = '#424242'
        tiles[x*boardWidth+y].style.borderRadius = '0%'
        hurdles.add(x*boardWidth+y)
    }
}