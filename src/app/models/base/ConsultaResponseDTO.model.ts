export interface ConsultaResponseDTO<T> {
  totalItems: number
  totalPages: number
  currentPage: number
  data: T
  message: string
  status: string
  code: string
}