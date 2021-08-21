# an js queue

## 使用

```javascript
import Queue from '@a417420427/queue'
const queue = new Queue({ concurrency: 3 })

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

const currentTime = () => Date.now()
let timeStamp = currentTime()
queue.push(async () => {
  await sleep(1000)
  console.log('sleep 1000ms after ' + (currentTime() - timeStamp))
})
queue.push(async () => {
  await sleep(2000)
  console.log('sleep 2000ms after ' + (currentTime() - timeStamp))
})
queue.push(async () => {
  await sleep(3000)
  console.log('sleep 3000ms after ' + (currentTime() - timeStamp))
})
queue.push(() => {
  console.log('worked after ' + (currentTime() - timeStamp))
})
queue.push(async () => {
  await sleep(1000)
  console.log('over after ' + (currentTime() - timeStamp))
})

queue.start()

// 输出
/**
sleep 1000ms after 1037
worked after 1037
sleep 2000ms after 2100
over after 2100
sleep 3000ms after 4184
 * 
*/
```
