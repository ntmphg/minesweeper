document.addEventListener('DOMContentLoaded'/* html and css loaded before js*/, () => {
    const grid = document.querySelector('.grid') /*returns the first element that matches a CSS selector*/
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    let width= 10
    let squares=[], arr=[]
    let board = []
    let totalBomb = 20
    let dx = [-1,-1,-1,0,1,1, 1,0]
    let dy = [-1, 0, 1,1,1,0,-1,-1]
    let isGameOver = false
    let flags=0
    function countBomb(x,y) {
        for(let i=0;i<8;i++) {
            let xx=x+dx[i], yy=y+dy[i]
            if(xx>-1 && xx<width && yy>-1 && yy<width && board[xx][yy]>-1) {
            //console.log(x,y,dx[i],dy[i],x+dx[i],y+dy[i])
                board[xx][yy]++;
            }
        }
    }
    //create board
    function createBoard() {
        flagsLeft.innerHTML = totalBomb
        for(let i=0;i<totalBomb;i++)
            squares[i]=-1
        for(let i=totalBomb;i<width*width;i++)
            squares[i]=0
        squares.sort(() => Math.random() - 0.5);
        for(let i=0; i<width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id',i) 
            if(squares[i]===-1) square.classList.add('bomb')
            else square.classList.add('valid')
            grid.appendChild(square)
            arr.push(square)
            square.addEventListener('click', function(e) {
                click(square)
            })

            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }
        for(let i=0; i<width;i++) {
            board[i]=[]
            for(let j=0;j<width;j++) {  
                board[i][j]=squares[i*width+j]
                if(board[i][j]===-1) arr[i*width+j].classList.add('bomb')
            }
        }
        for(let i=0;i<width;i++) {
            for(let j=0;j<width;j++) {
                if(board[i][j]===-1) {
                    countBomb(i,j)
                }
            }
        }
        for(let i=0;i<width;i++) {
            for(let j=0;j<width;j++) {
                arr[i*width+j].setAttribute('data',board[i][j])
                // console.log(i*width+j,board[i][j])
            }
        }
        // for(let i=0;i<arr.length;i++)
        // console.log(arr[i].getAttribute('data'))
        // for(let i=0;i<width;i++) {
        //     for(let j=0;j<width;j++) {
        //         arr[i*width+j].innerHTML = board[i][j]
        //     }
        // }
    }
    createBoard() 
    function click(square) {
        let currentId=square.id
        // console.log(arr[square.id].data)
        if (isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')) {
            gameOver(square)
            // alert('game over')
        } else {
            // arr[square.id].innerHTML=arr[square.id].getAttribute('data')
            checkSquare(square)
        }
    }
    function checkSquare(square) {
        let currentId=square.id
        let x=Math.trunc(currentId/width), y=currentId%width
        if(x<0 || x>=width || y<0 || y>=width) return
        if(arr[square.id].classList.contains('checked')||arr[square.id].classList.contains('bomb')) return
        // if(arr[square.id].getAttribute('data')!==0) return
        arr[square.id].classList.add('checked')
        let k=arr[square.id].getAttribute('data')
        if(k>0) {
            if(k==1) square.classList.add('one')
            if(k==2) square.classList.add('two')
            if(k==3) square.classList.add('three')
            if(k==4) square.classList.add('four')
            arr[square.id].innerHTML=k
        }
        for(let i=0;i<8;i++) {
            let xx=x+dx[i], yy=y+dy[i]
            // console.log(xx,yy)
            if(xx>=0 && xx<width && yy>=0 && yy<width ) {
                let newId=xx*width+yy 
                if(arr[newId].getAttribute('data')==0) {
                    const newSquare=document.getElementById(newId)
                // console.log(x,y,xx,yy,newId,newSquare)
                    checkSquare(newSquare)
                } else if(k==0 && arr[newId].getAttribute('data')>0) {
                    arr[newId].classList.add('checked')
                    let t=arr[newId].getAttribute('data')
                    if(t==1) arr[newId].classList.add('one')
                    if(t==2) arr[newId].classList.add('two')
                    if(t==3) arr[newId].classList.add('three')
                    if(t==4) arr[newId].classList.add('four')
                    arr[newId].innerHTML=t
                }
            }
        }
    }
    function addFlag(square) {
        if(isGameOver) return
        if(!square.classList.contains('checked') && flags<totalBomb) { 
            if(!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML ='&#128681'
                flags++
                flagsLeft.innerHTML=totalBomb-flags
                checkWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML=''
                flags--
                flagsLeft.innerHTML=totalBomb-flags
            }
        }   
    }

    function gameOver(square) {
        result.innerHTML='BOOM!!! GAME OVER'
        isGameOver=true

        //show all bombs
        arr.forEach(square => {
            if(square.classList.contains('bomb')) 
                square.innerHTML='&#128163'
        })
        // alert('game over')
    }

    function checkWin() {
        let matches=0
        for( let i=0;i<arr.length;i++)
        if(arr[i].classList.contains('flag') && arr[i].classList.contains('bomb'))
            matches++;
        if(matches===totalBomb) {
            result.innerHTML='YOU WIN!!!'
            isGameOver=true
        }
    }
    


                




































})