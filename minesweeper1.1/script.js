let matrix = null
let running = null


init(12,12,15)

document
    .querySelector('button')
    .addEventListener('click', ()=> init(12,12,15))

function init (colums,rows,mines){
    matrix = getMatrix(colums,rows)
    running = true

    for(let i = 0; i<mines; i++){
        setRandomMine(matrix)
    }
    update()
}

function update(){
    if(!running){
        return
    }
    const gameElement = matrixToHtml(matrix)
    const appElement = document.querySelector('#app')

    appElement.innerHTML = ''
    appElement.append(gameElement)

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            //imgElement.addEventListener('keydown', keydownHandler)
            imgElement.addEventListener('mousedown', mousedownHandler)
            imgElement.addEventListener('mouseup', mouseupHandler)
            imgElement.addEventListener('mouseleave', mouseleaveHandler)
            
            //imgElement.addEventListener('keyup', keyupHandler) 
        })
    if(isLosing(matrix)){
        alert('you lose!')
        running=false
    }
    else if(isWin(matrix)){
        alert('you win')
        running=false
    }
}




//function keydownHandler(event){
    //console.log(event)
    // const { cell, space } = getInfo(event)
    // console.log(getInfo(event))

    // if(space){
    //     cell.space = true
    // }
    // update()
//}

// function keyupHandler(event){
//     const { cell, space }= getInfo(event)
//     const keySpace = cell.space
//     if(space){
//         cell.space = false
//     }
//     if(keySpace){
//         leftHandler(cell)
//     }
// }



function mousedownHandler(event){
    console.log(event)
    const { cell, left, right} = getInfo(event)

    if(left){
        cell.left = true
    }

    if(right){
        cell.right = true
    }

    if(cell.left && cell.right){
        bothHandler(cell)
    }

    update()
}


function mouseupHandler(event){
    const {left, right, cell} = getInfo(event)

    const both = cell.right && cell.left && (left || right)
    const leftMouse=!both && cell.left && left
    const rightMouse=!both && cell.right && right
    
    if(both){
        forEach(matrix, x => x.poten = false)
    }

    if(left){
        cell.left = false
    }
    if(right){
        cell.right = false
    }

    if(leftMouse){
        leftHandler(cell)
    }

    else if(rightMouse){
        rightHandler(cell)
    }

    update()
}



function mouseleaveHandler(event){
    const info =getInfo(event)
    info.cell.left = false
    info.cell.right = false
    update()
}

function getInfo(event){
    const element = event.target
    const cellId = parseInt(element.getAttribute('data-cell-id'))

    return{
        left: event.which === 1,
        right: event.which === 3,
        //arrowL:,
        //arrowR:,
        //arrowU:,
        //arrowD:,
        //space: event.which === 32,
        cell: getCellById(matrix,cellId)
    }
}






function leftHandler(cell){  //обработка лкм
    if(cell.show || cell.flag){
        return
    }
    cell.show=true

    
    showSpread(matrix, cell.x, cell.y)
    
    
}

function rightHandler(cell){ //обработка пкм

    if(!cell.show){
        cell.flag = !cell.flag
    }
    
}

function bothHandler(cell){  //обработка нажатия двух кнопок мыши
    if(!cell.show || !cell.number){
        return
    }

    const cells = getAroundCells(matrix,cell.x, cell.y)
    const flags = cells.filter(x => x.flag).length

    if (flags === cell.number){
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => {
                cell.show = true
                showSpread(matrix,cell.x,cell.y)
            })
    }

    else{
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.poten = true)
    }

}