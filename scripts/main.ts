import {
  world,
  system,
  Block,
  Entity,
  BlockPermutation,
  Player,
  EntityInventoryComponent,
} from "@minecraft/server"

interface Dimensions {
  x: number
  y: number
  z: number
}

interface Space {
  dimensions: Dimensions
  state: (BlockPermutation | null)[]
}

interface PlayerState {
  firstBlock: Block | null
  lastCalled: number | null
  blockPermutation: BlockPermutation | null
  savedSpace: Space | null
}

let stairsToBlock: Map<string, BlockPermutation> | null = null

function loadStairsToBlock() {
  if (stairsToBlock === null) {
    stairsToBlock = new Map([
      ["minecraft:normal_stone_stairs", BlockPermutation.resolve("stone")],
      ["minecraft:cobblestone_stairs", BlockPermutation.resolve("cobblestone")],
      [
        "minecraft:mossy_cobblestone_stairs",
        BlockPermutation.resolve("mossy_cobblestone"),
      ],
      [
        "minecraft:oak_stairs",
        BlockPermutation.resolve("planks", { wood_type: "oak" }),
      ],
      [
        "minecraft:spruce_stairs",
        BlockPermutation.resolve("planks", { wood_type: "spruce" }),
      ],
      [
        "minecraft:birch_stairs",
        BlockPermutation.resolve("planks", { wood_type: "birch" }),
      ],
      [
        "minecraft:jungle_stairs",
        BlockPermutation.resolve("planks", { wood_type: "jungle" }),
      ],
      [
        "minecraft:acacia_stairs",
        BlockPermutation.resolve("planks", { wood_type: "acacia" }),
      ],
      [
        "minecraft:dark_oak_stairs",
        BlockPermutation.resolve("planks", { wood_type: "dark_oak" }),
      ],
      [
        "minecraft:mangrove_stairs",
        BlockPermutation.resolve("planks", { wood_type: "mangrove" }),
      ],
      [
        "minecraft:cherry_stairs",
        BlockPermutation.resolve("planks", { wood_type: "cherry" }),
      ],
      [
        "minecraft:bamboo_stairs",
        BlockPermutation.resolve("planks", { wood_type: "bamboo" }),
      ],
      [
        "minecraft:bamboo_mosaic_stairs",
        BlockPermutation.resolve("planks", { wood_type: "bamboo_mosaic" }),
      ],
      [
        "minecraft:stone_brick_stairs",
        BlockPermutation.resolve("stonebrick", { stone_brick_type: "default" }),
      ],
      [
        "minecraft:mossy_stone_brick_stairs",
        BlockPermutation.resolve("stonebrick", { stone_brick_type: "mossy" }),
      ],
      ["minecraft:sandstone_stairs", BlockPermutation.resolve("sandstone")],
      [
        "minecraft:smooth_sandstone_stairs",
        BlockPermutation.resolve("sandstone", { sand_stone_type: "smooth" }),
      ],
      [
        "minecraft:red_sandstone_stairs",
        BlockPermutation.resolve("sandstone", { sand_stone_type: "red" }),
      ],
      [
        "minecraft:smooth_red_sandstone_stairs",
        BlockPermutation.resolve("sandstone", {
          sand_stone_type: "smooth_red",
        }),
      ],
      [
        "minecraft:granite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "granite" }),
      ],
      [
        "minecraft:polished_granite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "polished_granite" }),
      ],
      [
        "minecraft:diorite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "diorite" }),
      ],
      [
        "minecraft:polished_diorite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "polished_diorite" }),
      ],
      [
        "minecraft:andesite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "andesite" }),
      ],
      [
        "minecraft:polished_andesite_stairs",
        BlockPermutation.resolve("stone", { stone_type: "polished_andesite" }),
      ],
      ["minecraft:brick_stairs", BlockPermutation.resolve("brick_block")],
      [
        "minecraft:nether_brick_stairs",
        BlockPermutation.resolve("nether_brick"),
      ],
      [
        "minecraft:red_nether_brick_stairs",
        BlockPermutation.resolve("red_nether_brick"),
      ],
      [
        "minecraft:end_stone_brick_stairs",
        BlockPermutation.resolve("end_bricks"),
      ],
      [
        "minecraft:quartz_brick_stairs",
        BlockPermutation.resolve("quartz_bricks"),
      ],
      [
        "minecraft:smooth_quartz_brick_stairs",
        BlockPermutation.resolve("quartz_block", { chisel_type: "smooth" }),
      ],
      ["minecraft:purpur_stairs", BlockPermutation.resolve("purpur_block")],
      ["minecraft:prismarine_stairs", BlockPermutation.resolve("prismarine")],
      [
        "minecraft:dark_prismarine_stairs",
        BlockPermutation.resolve("prismarine", {
          prismarine_block_type: "dark",
        }),
      ],
      [
        "minecraft:prismarine_bricks_stairs",
        BlockPermutation.resolve("prismarine", {
          prismarine_block_type: "bricks",
        }),
      ],
      ["minecraft:crimson_stairs", BlockPermutation.resolve("crimson_planks")],
      ["minecraft:warped_stairs", BlockPermutation.resolve("warped_planks")],
      ["minecraft:blackstone_stairs", BlockPermutation.resolve("blackstone")],
      [
        "minecraft:polished_blackstone_stairs",
        BlockPermutation.resolve("polished_blackstone"),
      ],
      [
        "minecraft:polished_blackstone_brick_stairs",
        BlockPermutation.resolve("polished_blackstone_bricks"),
      ],
      ["minecraft:cut_copper_stairs", BlockPermutation.resolve("cut_copper")],
      [
        "minecraft:exposed_cut_copper_stairs",
        BlockPermutation.resolve("exposed_cut_copper"),
      ],
      [
        "minecraft:weathered_cut_copper_stairs",
        BlockPermutation.resolve("weathered_cut_copper"),
      ],
      [
        "minecraft:oxidized_cut_copper_stairs",
        BlockPermutation.resolve("oxidized_cut_copper"),
      ],
      [
        "minecraft:waxed_cut_copper_stairs",
        BlockPermutation.resolve("waxed_cut_copper"),
      ],
      [
        "minecraft:waxed_exposed_cut_copper_stairs",
        BlockPermutation.resolve("waxed_exposed_cut_copper"),
      ],
      [
        "minecraft:waxed_weathered_cut_copper_stairs",
        BlockPermutation.resolve("waxed_weathered_cut_copper"),
      ],
      [
        "minecraft:waxed_oxidized_cut_copper_stairs",
        BlockPermutation.resolve("waxed_oxidized_cut_copper"),
      ],
      [
        "minecraft:cobbled_deepslate_stairs",
        BlockPermutation.resolve("cobbled_deepslate"),
      ],
      [
        "minecraft:deepslate_tile_stairs",
        BlockPermutation.resolve("deepslate_tile"),
      ],
      [
        "minecraft:polished_deepslate_stairs",
        BlockPermutation.resolve("polished_deepslate"),
      ],
      [
        "minecraft:deepslate_brick_stairs",
        BlockPermutation.resolve("deepslate_bricks"),
      ],
      ["minecraft:mud_brick_stairs", BlockPermutation.resolve("mud_bricks")],
    ])
  }
}

const state: Map<Entity, PlayerState> = new Map()

world.beforeEvents.itemUseOn.subscribe(function (event) {
  if (event.itemStack.typeId === "sanjo:block_selection_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      playerState.blockPermutation = event.block.permutation.clone()
      ;(event.source as Player).sendMessage(
        "selected block: " +
          event.block.permutation.type.id +
          ", " +
          JSON.stringify(event.block.permutation.getAllStates()),
      )

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:fill_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          const secondBlock = event.block

          if (playerState!.blockPermutation) {
            ;(event.source as Player).sendMessage("filling")
            fill(
              playerState!.firstBlock.location.x,
              playerState!.firstBlock.location.y,
              playerState!.firstBlock.location.z,
              secondBlock.location.x,
              secondBlock.location.y,
              secondBlock.location.z,
              playerState!.blockPermutation,
            )
          } else {
            ;(event.source as Player).sendMessage(
              "Please select a block type with the block selection tool first by using the tool on a block.",
            )
          }

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:fill_hollow_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          const secondBlock = event.block

          if (playerState!.blockPermutation) {
            ;(event.source as Player).sendMessage("filling")
            fill(
              playerState!.firstBlock.location.x,
              playerState!.firstBlock.location.y,
              playerState!.firstBlock.location.z,
              secondBlock.location.x,
              secondBlock.location.y,
              secondBlock.location.z,
              playerState!.blockPermutation,
              { hollow: true },
            )
          } else {
            ;(event.source as Player).sendMessage(
              "Please select a block type with the block selection tool first by using the tool on a block.",
            )
          }

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:remove_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          ;(event.source as Player).sendMessage("removing")

          const secondBlock = event.block

          remove(
            playerState!.firstBlock.location.x,
            playerState!.firstBlock.location.y,
            playerState!.firstBlock.location.z,
            secondBlock.location.x,
            secondBlock.location.y,
            secondBlock.location.z,
          )

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:copy_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          ;(event.source as Player).sendMessage("copying")

          const secondBlock = event.block

          copy(
            playerState!.firstBlock.location.x,
            playerState!.firstBlock.location.y,
            playerState!.firstBlock.location.z,
            secondBlock.location.x,
            secondBlock.location.y,
            secondBlock.location.z,
            playerState!,
          )

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:cut_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          ;(event.source as Player).sendMessage("cutting")

          const secondBlock = event.block

          cut(
            playerState!.firstBlock.location.x,
            playerState!.firstBlock.location.y,
            playerState!.firstBlock.location.z,
            secondBlock.location.x,
            secondBlock.location.y,
            secondBlock.location.z,
            playerState!,
          )

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:paste_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          if (playerState?.savedSpace) {
            ;(event.source as Player).sendMessage("pasting")

            const secondBlock = event.block

            paste(
              playerState!.firstBlock.location.x,
              playerState!.firstBlock.location.y,
              playerState!.firstBlock.location.z,
              secondBlock.location.x,
              secondBlock.location.y,
              secondBlock.location.z,
              playerState.savedSpace,
            )

            playerState!.firstBlock = null
          } else {
            ;(event.source as Player).sendMessage(
              "Please copy space first before pasting.",
            )
          }
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:paste_180_degree_rotated_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          if (playerState?.savedSpace) {
            ;(event.source as Player).sendMessage("pasting")

            const secondBlock = event.block

            paste180DegreeRotated(
              playerState!.firstBlock.location.x,
              playerState!.firstBlock.location.y,
              playerState!.firstBlock.location.z,
              secondBlock.location.x,
              secondBlock.location.y,
              secondBlock.location.z,
              playerState.savedSpace,
            )

            playerState!.firstBlock = null
          } else {
            ;(event.source as Player).sendMessage(
              "Please copy space first before pasting.",
            )
          }
        }
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:block_retriever") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        const inventory = event.source.getComponent(
          EntityInventoryComponent.componentId,
        ) as EntityInventoryComponent
        inventory.container?.addItem(event.block.permutation.getItemStack(1)!)
      })

      playerState.lastCalled = now
    }
  } else if (event.itemStack.typeId === "sanjo:roof_maker") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        if (playerState!.firstBlock === null) {
          ;(event.source as Player).sendMessage("setting first block")
          playerState!.firstBlock = event.block
        } else {
          const secondBlock = event.block

          if (playerState!.blockPermutation) {
            ;(event.source as Player).sendMessage("making roof")
            makeRoof(
              playerState!.firstBlock.location.x,
              playerState!.firstBlock.location.y,
              playerState!.firstBlock.location.z,
              secondBlock.location.x,
              secondBlock.location.y,
              secondBlock.location.z,
              playerState!.blockPermutation,
            )
          } else {
            ;(event.source as Player).sendMessage(
              "Please select a block type with the block selection tool first by using the tool on a block.",
            )
          }

          playerState!.firstBlock = null
        }
      })

      playerState.lastCalled = now
    }
  }
})

world.beforeEvents.itemUse.subscribe(function (event) {
  if (event.itemStack.typeId === "sanjo:undo_tool") {
    const now = Date.now()

    event.cancel = true

    let playerState: PlayerState | undefined = state.get(event.source)

    if (
      !playerState ||
      !playerState.lastCalled ||
      now - playerState.lastCalled > 300
    ) {
      if (!playerState) {
        playerState = {
          firstBlock: null,
          lastCalled: null,
          blockPermutation: null,
          savedSpace: null,
        }
        state.set(event.source, playerState)
      }

      system.run(function () {
        undo()
      })

      playerState.lastCalled = now
    }
  }
})

interface PreviousState {
  fromX: number
  fromY: number
  fromZ: number
  toX: number
  toY: number
  toZ: number
  state: (BlockPermutation | null)[]
}

const previousStates: PreviousState[] = []

function undo(): void {
  const previousState = previousStates.pop()
  if (previousState) {
    const { fromX, fromY, fromZ, toX, toY, toZ, state } = previousState
    const space = {
      dimensions: calculateDimensions(fromX, fromY, fromZ, toX, toY, toZ),
      state,
    }
    paste(fromX, fromY, fromZ, toX, toY, toZ, space, { backUp: false })
  }
}

function calculateDimensions(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
): Dimensions {
  return {
    x: Math.abs(toX - fromX) + 1,
    y: Math.abs(toY - fromY) + 1,
    z: Math.abs(toZ - fromZ) + 1,
  }
}

function fill(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  permutation: BlockPermutation,
  options: { hollow?: boolean } = { hollow: false },
) {
  backUp(fromX, fromY, fromZ, toX, toY, toZ)
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const x2 = Math.max(fromX, toX)
  const y2 = Math.max(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension("overworld")
  for (let y = y1; y <= y2; y++) {
    for (let z = z1; z <= z2; z++) {
      for (let x = x1; x <= x2; x++) {
        if (options.hollow) {
          if (
            x === fromX ||
            x === toX ||
            y === fromY ||
            y === toY ||
            z === fromZ ||
            z === toZ
          ) {
            overworld.getBlock({ x, y, z })?.setPermutation(permutation)
          }
        } else {
          overworld.getBlock({ x, y, z })?.setPermutation(permutation)
        }
      }
    }
  }
}

function backUp(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
): void {
  previousStates.push({
    fromX,
    fromY,
    fromZ,
    toX,
    toY,
    toZ,
    state: retrieveSpace(fromX, fromY, fromZ, toX, toY, toZ, { withAir: true })
      .state,
  })
}

function makeRoof(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  permutation: BlockPermutation,
) {
  backUp(fromX, fromY, fromZ, toX, toY, toZ)
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const x2 = Math.max(fromX, toX)
  const y2 = Math.max(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const dimensionY = Math.abs(toY - fromY) + 1
  const overworld = world.getDimension("overworld")
  const isWithWeirdoDirection =
    typeof permutation.getState("weirdo_direction") !== "undefined"
  let maxLengthForHighestLayer = isWithWeirdoDirection ? 3 : 2
  for (let y = 0; y < dimensionY; y++) {
    const minZ = z1 + y
    const maxZ = z2 - y
    const minX = x1 + y
    const maxX = x2 - y
    const dimensionZ = Math.abs(maxZ - minZ) + 1
    const dimensionX = Math.abs(maxX - minX) + 1
    const isHighestLayer =
      dimensionZ <= maxLengthForHighestLayer ||
      dimensionX <= maxLengthForHighestLayer ||
      y === dimensionY - 1
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        if (x === minX || x === maxX || z === minZ || z === maxZ) {
          let permutationForBlock
          if (isWithWeirdoDirection) {
            let weirdoDirection: number | undefined
            if (x === minX) {
              weirdoDirection = 0
            } else if (x === maxX) {
              weirdoDirection = 1
            } else if (z === minZ) {
              weirdoDirection = 2
            } else if (z === maxZ) {
              weirdoDirection = 3
            }
            permutationForBlock = permutation.withState(
              "weirdo_direction",
              weirdoDirection!,
            )
          } else {
            permutationForBlock = permutation
          }
          overworld
            .getBlock({ x, y: y1 + y, z })
            ?.setPermutation(permutationForBlock)
        } else if (isHighestLayer) {
          loadStairsToBlock()
          const permutationForBlock =
            stairsToBlock!.get(permutation.type.id) || permutation
          overworld
            .getBlock({ x, y: y1 + y, z })
            ?.setPermutation(permutationForBlock)
        }
      }
    }
    if (isHighestLayer) {
      break
    }
  }
}

function remove(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
) {
  backUp(fromX, fromY, fromZ, toX, toY, toZ)
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const x2 = Math.max(fromX, toX)
  const y2 = Math.max(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension("overworld")
  const airPermutation = BlockPermutation.resolve("air")
  for (let y = y1; y <= y2; y++) {
    for (let z = z1; z <= z2; z++) {
      for (let x = x1; x <= x2; x++) {
        overworld.getBlock({ x, y, z })?.setPermutation(airPermutation)
      }
    }
  }
}

function copy(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  playerState: PlayerState,
) {
  playerState.savedSpace = retrieveSpace(fromX, fromY, fromZ, toX, toY, toZ)
}

function retrieveSpace(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  options: { withAir: boolean } = { withAir: false },
): Space {
  const dimensions = calculateDimensions(fromX, fromY, fromZ, toX, toY, toZ)
  const state = new Array(dimensions.x * dimensions.y * dimensions.z)
  const space = {
    dimensions,
    state,
  }

  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const overworld = world.getDimension("overworld")
  for (let y = 0; y < dimensions.y; y++) {
    for (let z = 0; z < dimensions.z; z++) {
      for (let x = 0; x < dimensions.x; x++) {
        let savedPermutation
        const block = overworld.getBlock({ x: x1 + x, y: y1 + y, z: z1 + z })
        if (block) {
          const permutation = block.permutation
          if (!options.withAir && permutation.type.id === "minecraft:air") {
            savedPermutation = null
          } else {
            savedPermutation = permutation.clone()
          }
        } else {
          savedPermutation = null
        }

        state[y * (dimensions.x * dimensions.z) + z * dimensions.x + x] =
          savedPermutation
      }
    }
  }

  return space
}

function cut(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  playerState: PlayerState,
) {
  backUp(fromX, fromY, fromZ, toX, toY, toZ)
  copy(fromX, fromY, fromZ, toX, toY, toZ, playerState)
  remove(fromX, fromY, fromZ, toX, toY, toZ)
}

function paste(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  space: Space,
  options: { backUp: boolean } = { backUp: true },
) {
  if (options.backUp) {
    backUp(fromX, fromY, fromZ, toX, toY, toZ)
  }
  const x1 = Math.min(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z1 = Math.min(fromZ, toZ)
  const overworld = world.getDimension("overworld")
  for (let y = 0; y < space.dimensions.y; y++) {
    for (let z = 0; z < space.dimensions.z; z++) {
      for (let x = 0; x < space.dimensions.x; x++) {
        const permutation =
          space.state[
            y * (space.dimensions.x * space.dimensions.z) +
              z * space.dimensions.x +
              x
          ]
        if (permutation) {
          const block = overworld.getBlock({ x: x1 + x, y: y1 + y, z: z1 + z })
          if (block) {
            block.setPermutation(permutation)
          }
        }
      }
    }
  }
}

function paste180DegreeRotated(
  fromX: number,
  fromY: number,
  fromZ: number,
  toX: number,
  toY: number,
  toZ: number,
  space: Space,
) {
  backUp(fromX, fromY, fromZ, toX, toY, toZ)
  const x2 = Math.max(fromX, toX)
  const y1 = Math.min(fromY, toY)
  const z2 = Math.max(fromZ, toZ)
  const overworld = world.getDimension("overworld")
  for (let y = 0; y < space.dimensions.y; y++) {
    for (let z = 0; z < space.dimensions.z; z++) {
      for (let x = 0; x < space.dimensions.x; x++) {
        let permutation =
          space.state[
            y * (space.dimensions.x * space.dimensions.z) +
              z * space.dimensions.x +
              x
          ]
        if (permutation) {
          const block = overworld.getBlock({ x: x2 - x, y: y1 + y, z: z2 - z })
          if (block) {
            const weirdoDirection = permutation.getState("weirdo_direction")
            if (typeof weirdoDirection !== "undefined") {
              const rotations = new Map([
                [0, 1],
                [1, 0],
                [2, 3],
                [3, 2],
              ])
              const rotatedWeirdoDirection = rotations.get(
                weirdoDirection as number,
              )!
              permutation = permutation.withState(
                "weirdo_direction",
                rotatedWeirdoDirection,
              )
            }
            block.setPermutation(permutation)
          }
        }
      }
    }
  }
}
