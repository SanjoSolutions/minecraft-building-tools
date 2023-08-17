import { world, system, Block, Entity, BlockPermutation } from "@minecraft/server"

interface Space {
  dimensions: {x: number, y: number, z: number}
  state: (BlockPermutation | null)[]
}

interface PlayerState {
  firstBlock: Block | null
  lastCalled: number | null
  blockPermutation: BlockPermutation | null
  savedSpace: Space | null
}

const state: Map<Entity, PlayerState> = new Map()

world.beforeEvents.itemUseOn.subscribe(function (event) {
  if (event.itemStack.typeId === 'sanjo:fill_tool_block_selection_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      playerState.blockPermutation = event.block.permutation.clone()
      world.sendMessage('selected block: ' + event.block.permutation.type.id + ' ' + JSON.stringify(event.block.permutation.getAllStates()))

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:fill_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          const secondBlock = event.block
      
          if (playerState!.blockPermutation) {
            world.sendMessage('filling')
            fill(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState!.blockPermutation)
          } else {
            world.sendMessage('Please select a block type with the fill tool block selection tool first by using the tool on a block.')
          }

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:fill_hollow_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          const secondBlock = event.block
      
          if (playerState!.blockPermutation) {
            world.sendMessage('filling')
            fill(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState!.blockPermutation, {hollow: true})
          } else {
            world.sendMessage('Please select a block type with the fill tool block selection tool first by using the tool on a block.')
          }

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:remove_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          world.sendMessage('removing')
      
          const secondBlock = event.block
      
          remove(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z)
          
          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:copy_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          world.sendMessage('copying')
      
          const secondBlock = event.block
      
          copy(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState!)
          
          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:cut_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          world.sendMessage('cutting')
      
          const secondBlock = event.block
      
          cut(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState!)
          
          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:paste_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          if (playerState?.savedSpace) {
            world.sendMessage('pasting')
        
            const secondBlock = event.block
        
            paste(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState.savedSpace)

            playerState!.firstBlock = null
          } else {
            world.sendMessage('Please copy space first before pasting.')
          }
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === 'sanjo:paste_180_degree_rotated_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          world.sendMessage('setting first block')
          playerState!.firstBlock = event.block
        } else {
          if (playerState?.savedSpace) {
            world.sendMessage('pasting')
        
            const secondBlock = event.block
        
            paste180DegreeRotated(playerState!.firstBlock.location.x, playerState!.firstBlock.location.y, playerState!.firstBlock.location.z, secondBlock.location.x, secondBlock.location.y, secondBlock.location.z, playerState.savedSpace)

            playerState!.firstBlock = null
          } else {
            world.sendMessage('Please copy space first before pasting.')
          }
        }
      })

      playerState.lastCalled = now
    }
  }
})

function fill(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, permutation: BlockPermutation, options: {hollow?: boolean} = {hollow: false}) {
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const x2 = Math.max(fromX, toX)
  const y2 = Math.max(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension('overworld')
  for (let y = y1; y <= y2; y++) {
    for (let z = z1; z <= z2; z++) {
      for (let x = x1; x <= x2; x++) {
        if (options.hollow) {
          if (x === fromX || x === toX || y === fromY || y === toY || z === fromZ || z === toZ) {
            overworld.getBlock({x, y, z})?.setPermutation(permutation)
          }
        } else {
          overworld.getBlock({x, y, z})?.setPermutation(permutation)
        }
      }
    }
  }
}

function remove(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number) {
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const x2 = Math.max(fromX, toX)
  const y2 = Math.max(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension('overworld')
  const airPermutation = BlockPermutation.resolve('air')
  for (let y = y1; y <= y2; y++) {
    for (let z = z1; z <= z2; z++) {
      for (let x = x1; x <= x2; x++) {
        overworld.getBlock({x, y, z})?.setPermutation(airPermutation)
      }
    }
  }
}

function copy(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, playerState: PlayerState) {
  const dimensions = {
    x: Math.abs(toX - fromX) + 1,
    y: Math.abs(toY - fromY) + 1,
    z: Math.abs(toZ - fromZ) + 1
  }
  const state = new Array(dimensions.x * dimensions.y * dimensions.z)
  const savedSpace = {
    dimensions,
    state
  }

  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const overworld = world.getDimension('overworld')
  for (let y = 0; y < dimensions.y; y++) {
    for (let z = 0; z < dimensions.z; z++) {
      for (let x = 0; x < dimensions.x; x++) {
        let savedPermutation
        const block = overworld.getBlock({x: x1 + x, y: y1 + y, z: z1 + z})
        if (block) {
          const permutation = block.permutation
          if (permutation.type.id === 'minecraft:air') {
            savedPermutation = null
          } else {
            savedPermutation = permutation.clone()
          }
        } else {
          savedPermutation = null
        }

         state[y * (dimensions.x * dimensions.z) + z * dimensions.x + x] = savedPermutation
      }
    }
  }
  playerState.savedSpace = savedSpace
}

function cut(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, playerState: PlayerState) {
  copy(fromX, fromY, fromZ, toX, toY, toZ, playerState)
  remove(fromX, fromY, fromZ, toX, toY, toZ)
}

function paste(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, space: Space) {
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const overworld = world.getDimension('overworld')
  for (let y = 0; y < space.dimensions.y; y++) {
    for (let z = 0; z < space.dimensions.z; z++) {
      for (let x = 0; x < space.dimensions.x; x++) {
        const permutation = space.state[y * (space.dimensions.x * space.dimensions.z) + z * space.dimensions.x + x]
        if (permutation) {
          const block = overworld.getBlock({x: x1 + x, y: y1 + y, z: z1 + z})
          if (block) {
            block.setPermutation(permutation)
          }
        }
      }
    }
  }
}

function paste180DegreeRotated(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, space: Space) {
  const x2 = Math.max(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension('overworld')
  for (let y = 0; y < space.dimensions.y; y++) {
    for (let z = 0; z < space.dimensions.z; z++) {
      for (let x = 0; x < space.dimensions.x; x++) {
        let permutation = space.state[y * (space.dimensions.x * space.dimensions.z) + z * space.dimensions.x + x]
        if (permutation) {
          const block = overworld.getBlock({x: x2 - x, y: y1 + y, z: z2 - z})
          if (block) {
            const weirdoDirection = permutation.getState('weirdo_direction')
            if (typeof weirdoDirection !== 'undefined') {
              const rotations = new Map([
                [0, 1],
                [1, 0],
                [2, 3],
                [3, 2]
              ])
              const rotatedWeirdoDirection = rotations.get(weirdoDirection as number)!
              permutation = permutation.withState('weirdo_direction', rotatedWeirdoDirection)
            }
            block.setPermutation(permutation)
          }
        }
      }
    }
  }
}