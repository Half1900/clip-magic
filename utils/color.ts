export const getRandomColor = () => {
  const color = [
    'blue-inverse',
    'purple-inverse',
    'cyan-inverse',
    'green-inverse',
    'magenta-inverse',
    'pink-inverse',
    'red-inverse',
    'orange-inverse',
    'yellow-inverse',
    'volcano-inverse',
    'geekblue-inverse',
    'lime-inverse',
    'gold-inverse'
  ]
  return color[(Math.random() * color.length) | 0]
}
