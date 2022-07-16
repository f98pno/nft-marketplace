export type NftAttributes = {
    trait_type: "attack" | "health" | "speed"
    value: string
}

export type NftMeta = {
    name: string
    description: string
    image: string
    attributes: NftAttributes[]
}