export interface ResponseDTO<T> {
  data: T
  message: string
  status: string
  code: string
}
