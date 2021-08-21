interface QueueOptions {
  concurrency: number
}

type QueueItem =  ()=> any|Promise<any>

enum ArrayMethods  {
  push = 'push',
  pop ='pop',
  unshift ='unshift',
  splice ='splice',
  shift ='shift',
  slice ='slice',
  reverse ='reverse',
  indexOf ='indexOf',
  lastIndexOf ='lastIndexOf',
}
class Queue extends Array{
  items:QueueItem[]  = []
  concurrency = 1
  constructor(options?: QueueOptions) {
    super()
    this.concurrency = (options && options.concurrency) || 1

    Object.keys(ArrayMethods).forEach((method) => {
      this[ArrayMethods[method]] = Array.prototype[ArrayMethods[method]].bind(this.items)
    })
  }
  // 返回队列中的第一个元素——最先被添加，也将是最先被移除的元素。队列不做任何变动
  front() {
    return this.items[0]
  }
  // 查看队列是否为空
  isEmpty() {
    return this.items.length === 0
  }
  // 返回队列包含的元素个数
  size() {
    return this.items.length
  }
  // 开始运行
  start() {
    if (!this.isEmpty()) {
      console.log(this.concurrency)
      for (let i = 0; i < this.concurrency; i++) {
        this.next()
      }
    }
  }

  async next() {
    const fn = this.items.shift()
    if (fn) {
      await fn()
      await this.next()
    }
  }
}

function isFunction(props: any) {
  return Object.prototype.toString.call(props) === '[object Function]'
}
function isArray(props: any) {
  return Array.isArray(props)
}
function isAsyncFunction(props: any) {
  return Object.prototype.toString.call(props) === '[object AsyncFunction]'
}
function validateArgs(args: any| any[]) {
  if (isArray(args)) {
    return !args.find((arg: any) => !isFunction(arg))
  }
  return isAsyncFunction(args) || isFunction(args)
}


