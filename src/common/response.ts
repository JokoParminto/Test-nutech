
export class BuildFormat {
  public static failed(res: any, params: any) {
    return res.status(400).json(
      { 
        status: 102,
        message: params[0].msg,
        data: null
      }
    )
  }

  public static succesCreate(res: any, params: string) {
    return res.status(201).json(
      {
        status: 0,
        message: params,
        data: null
      }
    )
  }

  public static error(res: any, params: string) {
    return res.status(500).json(
      {
        status: 102,
        message: params,
        data: null
      }
    )
  }

  public static notFound(res: any, params: string) {
    return res.status(401).json(
      {
        status: 103,
        message: params,
        data: null
      }
    )
  }

  public static success(res: any, params: string, data:any) {
    return res.status(200).json(
      {
        status: 0,
        message: params,
        data: data
      }
    )
  }

  public static successPagination(res: any, params: string, offset: number, limit: number, data: any) {
    return res.status(200).json(
      {
        status: 0,
        message: params,
        data: {
          offset: offset,
          limit: limit,
          records: data
        }
      }
    )
  }

  public static unautorize(res: any, params: string) {
    return res.status(401).json(
      {
        status: 108,
        message: params,
        data: null
      }
    )
  }
}