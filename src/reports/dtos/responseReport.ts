import { Expose, Transform } from 'class-transformer';

export class ResponseReport {
  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  kilometer: number;

  @Expose()
  price: number;

  @Transform(({ obj }) => obj.user?.id)
  @Expose()
  userId: string;

  @Expose()
  isApprove: boolean;
}
