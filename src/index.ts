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

export default Queue




// concurrency 可选 表示最多并行的项目
const queue = new Queue({concurrency: 3})

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))


queue.push(async () => {
  await sleep(1000)
  console.log('sleep 1000ms')
})
queue.push(async () => {
  await sleep(2000)
  console.log('sleep 2000ms')
})
queue.push(async () => {
  await sleep(3000)
  console.log('sleep 3000ms')
})
queue.push(() => {
  console.log('worked')
})

queue.push(async () => {
  await sleep(1000)
  console.log('over')
})