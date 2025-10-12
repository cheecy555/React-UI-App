export interface Checklist {
    id: string
    type: number
    title: string
    name: string
    code: string
    notes: string
    val?: number
    val2?: number
    data: {
        details: Details[]
        price: Price
    }
    flags?: Flags
}

export interface ProductOptions {
    code: string
    name: string
    helpText: string
    price: number | null
    image: string
}

export interface Tiers {
    minQty: number
    unitprice: number
    before: Date
    name: string
    code: string
    desc: string
}

export interface Price {
    base: number
    calc: any[]
    options: ProductOptions[]
    tiers: Tiers[]
}

export interface Flags {
    H: string
    P: string
    R: string
    S: string
    V: string
}

export interface Exprice {
    id: number
    name: string
    flags?: string | null
}

export interface Details {
    type: string
    text: string
    field: string
    label: string
    list:
    | {
        listcode: string
        name: string
        desc: string
        content: string
    }
    | string
    price?: {
        val?: any
        percent?: boolean
    }
    multi: boolean
    show: string
    flags?: string
    required: boolean
    child?: boolean
    description?: string
    remember?: boolean
    delimiter?: string
    max?: any
    min?: any
    limit?: number | string
    value?: number
    unitNum?: string
    maxlength?: number
    maxlines?: number
    stateConds:any
    hasRemark?: boolean
    showHelptext?: boolean
    showDescription?: boolean
    showchildnumber?: boolean
    basis?: string
    mpricelist?: Exprice[] | null
    lprice?: string
    qty?: any
    defaultValue?: any
    showInput?:boolean
}


interface GalleryFile {
    id: string
    name: string
    uts: string
    seq: number
    type: 0 | 1 | 1.5 | 2 //0 for avatar, 1 for banner, 1.5 for mobile banner, 2 for portfolio
    notes?: string
    tags?: any[]
    expiry?: Date
    effdate?: Date
    data?: any
    thumbhash?: string
}

export interface Gallery {
    files: GalleryFile[]
}

