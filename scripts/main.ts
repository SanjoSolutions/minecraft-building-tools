import { world, system, Block, Entity, BlockPermutation } from "@minecraft/server"

interface PlayerState {
  firstBlock: Block | null
  lastCalled: number | null
  blockPermutation: BlockPermutation | null
}

const state: Map<Entity, PlayerState> = new Map()

world.beforeEvents.itemUseOn.subscribe(function (event) {
  if (event.itemStack.typeId === 'sanjo:fill_tool_block_selection_tool') {
    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState) {
      playerState = {
        firstBlock: null,
        lastCalled: null,
        blockPermutation: null
      }
      state.set(event.source, playerState)
    }

    playerState.blockPermutation = event.block.permutation.clone()
    world.sendMessage('selected block: ' + event.block.permutation.type.id)
  } else if (event.itemStack.typeId === 'sanjo:fill_tool') {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (!playerState || !playerState.lastCalled || now - playerState.lastCalled > 300) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null
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
          blockPermutation: null
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
          blockPermutation: null
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
