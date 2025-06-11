import { Expose, Transform } from "class-transformer"

const DOLAR_TO_REAL_COTATION: number = 5.6

export class ReportDTO {
    @Expose()
    id: string

    @Expose()
    approved: boolean
    
    @Expose()
    price: number

    @Expose()
    year: number

    @Expose()
    lng: number

    @Expose()
    lat: number
    @Expose()
    make: string

    @Expose()
    model: string

    @Expose()
    mileage: number

    @Expose()
    coin: string

    @Expose()
    @Transform(({ obj }) => obj.user.id)
    userId: string

    @Expose()
    @Transform(({ obj }) => obj.price * DOLAR_TO_REAL_COTATION)
    price_in_BRL: number

}