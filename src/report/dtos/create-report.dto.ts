import { IsLatitude, IsLatLong, IsLongitude, IsNumber, IsString, IsUUID, Max, Min } from "class-validator"

export class CreateReportDTO {
    @IsString()
    make: string

    @IsString()
    model: string

    @IsNumber()
    @Min(1990)
    @Max(new Date(Date.now()).getFullYear())
    year: number

    @IsLongitude()
    lng: number

    @IsLatitude()
    lat: number

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number

    @IsNumber()
    mileage: number
}