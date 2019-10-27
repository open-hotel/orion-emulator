type MatrixMapAxisFunction<T, R = any, M = T> = (
  value: T,
  i: number,
  matrix?: Matrix<M>,
) => R;
type MatrixMapFunction<V, M = any, R = any> = (
  value: V,
  x: number,
  y: number,
  matrix?: Matrix<M>,
) => R;
type MatrixReduceFunction<A, T = any> = (
  acc: A,
  el: T,
  x: number,
  y: number,
  matrix?: Matrix<T>,
) => A;

export enum MatrixTypes {
  number = '0',
  string = '1',
}

export const MatrixDeserializers = {
  number: v => Number(v),
  string: v => v,
};
export const MatrixSerializer = {
  number: (v: number) => String(v),
  string: (v: string) => v,
};

const defaultSerializeOptions = {
  headerDelimiter: ';',
  metaDelimiter: ':',
  delimiter: ',',
  deserializer: MatrixDeserializers.string,
  serializer: MatrixSerializer.string,
};

type SerializeOptions = typeof defaultSerializeOptions;

export class Matrix<T = any> {
  constructor(
    public cols: number = 0,
    public rows: number = 0,
    public data?: T[],
    public meta = []
  ) {
    this.data = data || new Array(cols * rows).fill(null);
  }

  getIndexOf(x: number, y: number) {
    return y * this.cols + x;
  }

  getCoords(index: number) {
    return {
      x: index % this.cols,
      y: Math.floor(index / this.cols),
    };
  }

  get(x: number, y: number, defaultValue: any = null): T {
    const index = this.getIndexOf(x, y);
    return index >= this.data.length ? defaultValue : this.data[index];
  }

  set(x: number, y: number, value: T): Matrix<T> {
    const index = this.getIndexOf(x, y);
    this.data[index] = value;
    return this;
  }

  getCol(x: number): T[] {
    const result = [];
    this.data.every((item, index) => {
      if ((index - x) % this.cols) {
        result.push(item);
        return true;
      }
      return false;
    });
    return result;
  }

  getRow(y: number): T[] {
    const start = y * this.cols;
    const end = start + this.cols;

    return this.data.slice(start, end);
  }

  clear() {
    this.data = new Array(this.cols * this.rows).fill(null);
    return this;
  }

  mapRows<R>(cb: MatrixMapAxisFunction<T[], R, T>): R[] {
    const maped = [];

    for (let y = 0; y < this.rows; y++) {
      maped[y] = cb(this.getRow(y), y, this);
    }

    return maped;
  }

  mapCols<C>(cb: MatrixMapAxisFunction<T[], C, T>): C[] {
    const maped = [];

    for (let x = 0; x < this.cols; x++) {
      maped[x] = cb(this.getRow(x), x, this);
    }

    return maped;
  }

  map<M>(cb: (value: T, x: number, y: number, matrix: this) => M): M[] {
    return this.data.map((value, index) => {
      const { x, y } = this.getCoords(index);
      return cb(value, x, y, this);
    });
  }

  clone(): Matrix<T> {
    return Matrix.from<T>(this.data, this.cols, this.rows);
  }

  every(
    cb: (value: T, x: number, y: number, matrix: this) => boolean,
  ): boolean {
    return this.data.every((value, index) => {
      const { x, y } = this.getCoords(index);
      return cb(value, x, y, this);
    });
  }

  some(cb: (value: T, x: number, y: number, matrix: this) => boolean): boolean {
    return this.data.some((value, index) => {
      const { x, y } = this.getCoords(index);
      return cb(value, x, y, this);
    });
  }

  forEach(cb: MatrixMapFunction<T, T, any>): void {
    return this.data.forEach((value, index) => {
      const { x, y } = this.getCoords(index);
      return cb(value, x, y, this);
    });
  }

  forEachRow(cb: MatrixMapAxisFunction<T[], void, any>): void {
    for (let y = 0; y < this.rows; y++) {
      cb(this.getRow(y), +y, this);
    }
  }

  reduce<U>(cb: MatrixReduceFunction<U, T>, initialValue?: U): U {
    return this.data.reduce<U>((acc, value, index) => {
      const { x, y } = this.getCoords(index);
      return cb(acc, value, x, y, this);
    }, initialValue);
  }

  neighborsOf(x: number, y: number): Matrix<T> {
    return Matrix.from<T>([
      [this.get(x - 1, y), this.get(x, y - 1), this.get(x + 1, y)],
      [this.get(x - 1, y), this.get(x, y), this.get(x + 1, y)],
      [this.get(x - 1, y), this.get(x, y + 1), this.get(x + 1, y)],
    ]);
  }

  static fromString<T>(
    encodedMatrix: string,
    {
      metaDelimiter,
      headerDelimiter,
      deserializer,
      delimiter,
    }: SerializeOptions = defaultSerializeOptions,
  ): Matrix<T> {
    const [encodedHeader, encodedData] = encodedMatrix.split(metaDelimiter);
    const [cols, rows, ...meta] = encodedHeader.split(headerDelimiter);
    deserializer = deserializer || MatrixDeserializers.string;
    const data = encodedData.split(delimiter).map<T>(deserializer);
    return this.fromArray<T>(data, +cols, +rows, meta);
  }

  static fromArray<T = any>(data: T[], cols: number, rows: number, meta = []): Matrix<T> {
    return new Matrix(cols, rows, data, meta);
  }

  static from<T = any>(data: string, options?: SerializeOptions): Matrix<T>;
  static from<T = any>(data: T[], cols: number, rows: number): Matrix<T>;
  static from<T = any>(data: T[][]): Matrix<T>;
  static from<T = any>(data: Matrix): Matrix<T>;
  static from<T = any>(
    data,
    cols?,
    rows?,
    options?: SerializeOptions,
  ): Matrix<T> {
    // Clone
    if (data instanceof this) return data.clone();

    // Encoded String
    if (typeof data === 'string') {
      options = cols || defaultSerializeOptions;
      return this.fromString<T>(data, options);
    }

    // Array
    if (Array.isArray(data)) {
      // 2D Array
      if (Array.isArray(data[0])) {
        cols = cols || data[0].length;
        rows = rows.length;
        return this.fromArray<T>([].concat(...data), cols, rows);
      }

      // 1D Array
      return new Matrix<T>(cols, rows, data);
    }

    throw new TypeError(
      `Type of data should be Array, Array2D, String or Matrix instance.`,
    );
  }

  toString({
    headerDelimiter = ';',
    metaDelimiter = ':',
    delimiter = ',',
  } = {}) {
    return [
      [this.cols, this.rows, ...this.meta].join(headerDelimiter),
      this.data.join(delimiter),
    ].join(metaDelimiter);
  }
}
